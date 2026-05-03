import { spawn } from 'node:child_process';
import { LLMCallError, safeParseJson, type LLMProvider } from './types';

/**
 * Backend that delegates to the locally-installed Claude Code CLI.
 *
 * Why: the user's Claude Pro/Max subscription is consumed, not per-token API
 * credit. Trade-offs:
 *   - Requires `claude` in PATH and an active subscription login.
 *   - No prompt caching hook (Claude Code handles it internally but we cannot
 *     steer it). We still pass system blocks, just not flagged as ephemeral.
 *   - Windows works (Claude Code ships a native binary).
 *   - Only works locally — cannot be used from a hosted deployment.
 */

function claudeBinary(): string {
  return process.env.JOBSEEKER_CLAUDE_BIN || 'claude';
}

export async function isClaudeCodeAvailable(): Promise<{ ok: boolean; version?: string; reason?: string }> {
  return new Promise((resolve) => {
    const bin = claudeBinary();
    const child = spawn(bin, ['--version'], { shell: process.platform === 'win32' });
    let out = '';
    let err = '';
    child.stdout.on('data', (b) => (out += b.toString()));
    child.stderr.on('data', (b) => (err += b.toString()));
    child.on('error', (e) => resolve({ ok: false, reason: e.message }));
    child.on('close', (code) => {
      if (code === 0) resolve({ ok: true, version: out.trim() || undefined });
      else resolve({ ok: false, reason: err.trim() || `exit ${code}` });
    });
    setTimeout(() => {
      try { child.kill(); } catch {}
      resolve({ ok: false, reason: 'timeout' });
    }, 5000);
  });
}

function runClaude(args: string[], stdin: string, timeoutMs: number): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const bin = claudeBinary();
    const child = spawn(bin, args, { shell: process.platform === 'win32' });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      try { child.kill('SIGTERM'); } catch {}
      reject(new Error(`Claude Code timed out after ${Math.round(timeoutMs / 1000)}s`));
    }, timeoutMs);
    child.stdout.on('data', (b) => (stdout += b.toString()));
    child.stderr.on('data', (b) => (stderr += b.toString()));
    child.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
    child.stdin.write(stdin);
    child.stdin.end();
  });
}

export const claudeCodeProvider: LLMProvider = {
  id: 'claude-code',
  displayName: 'Claude Code (uses your Pro/Max subscription)',
  supportsPromptCaching: false,
  supportsNativeJson: false,
  requiresBinary: 'claude',
  requiresApiKey: false,
  defaultModels: [
    { id: 'haiku', label: 'Haiku', note: 'cheapest against subscription quota' },
    { id: 'sonnet', label: 'Sonnet', note: 'recommended' },
    { id: 'opus', label: 'Opus', note: 'heavy — watch your quota' }
  ],

  async call(cfg, opts) {
    // Combine system blocks + user into a single structured prompt piped to stdin.
    const systemText = opts.system
      .map((b) => b.text)
      .filter(Boolean)
      .join('\n\n---\n\n');
    const userText = opts.jsonOnly
      ? `${opts.user}\n\nReturn ONLY valid JSON. No prose before or after. No markdown fences.`
      : opts.user;
    const stdinPayload = `${userText}`;

    const args = [
      '-p',
      '--output-format', 'json',
      '--max-turns', '1',
      '--dangerously-skip-permissions',
      '--append-system-prompt', systemText,
      '--model', cfg.model || 'sonnet'
    ];

    let result: { code: number; stdout: string; stderr: string };
    try {
      result = await runClaude(args, stdinPayload, 180_000);
    } catch (err) {
      throw new LLMCallError(
        `Claude Code invocation failed: ${(err as Error).message}. Is it installed and logged in? (\`claude login\`)`,
        'claude-code'
      );
    }

    if (result.code !== 0) {
      throw new LLMCallError(
        `Claude Code exited ${result.code}: ${result.stderr || result.stdout || 'no output'}`,
        'claude-code',
        result.code,
        result.stdout
      );
    }

    // Parse the envelope JSON emitted by `--output-format json`.
    // Shape: { type:"result", subtype:"success"|"error_*", is_error, result, usage:{ input_tokens, output_tokens, ... } }
    const envelope = safeParseJson<{
      type?: string;
      is_error?: boolean;
      result?: string;
      error?: string;
      usage?: { input_tokens?: number; output_tokens?: number; cache_read_input_tokens?: number };
    }>(result.stdout);

    if (!envelope) {
      // Fallback: maybe the raw stdout IS the model output (older versions).
      const text = result.stdout.trim();
      return {
        text,
        json: opts.jsonOnly ? safeParseJson(text) : undefined,
        usage: { input: 0, output: 0 },
        provider: 'claude-code',
        model: cfg.model
      };
    }

    if (envelope.is_error) {
      throw new LLMCallError(envelope.error || 'Claude Code reported an error', 'claude-code', undefined, result.stdout);
    }

    const text = (envelope.result || '').trim();
    return {
      text,
      json: opts.jsonOnly ? safeParseJson(text) : undefined,
      usage: {
        input: envelope.usage?.input_tokens || 0,
        output: envelope.usage?.output_tokens || 0,
        cached_read: envelope.usage?.cache_read_input_tokens
      },
      provider: 'claude-code',
      model: cfg.model
    };
  }
};
