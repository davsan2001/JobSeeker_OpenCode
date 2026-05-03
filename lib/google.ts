/**
 * Google OAuth 2.0 + Gmail send + Drive upload.
 *
 * Strategy: Bring-Your-Own OAuth client.
 *   Each user creates their own OAuth client in Google Cloud Console and pastes
 *   the Client ID + Secret into Settings. Pros:
 *     - No Google-side app verification needed (would require auditor for gmail.send)
 *     - Each installation is autonomous — users control their own credentials
 *     - Works for downloadable / self-hosted model
 *
 * Scopes used:
 *   - gmail.send        → send mail only, cannot read inbox
 *   - drive.file        → touch only files the app creates
 *   - userinfo.email    → know which account we're connected to
 *
 * Implemented with raw fetch — no googleapis SDK (it's enormous for our needs).
 */

import { randomBytes } from 'node:crypto';

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email'
];

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true';
const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';

export class GoogleApiError extends Error {
  constructor(message: string, public readonly status?: number, public readonly raw?: string) {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// OAuth flow
// -----------------------------------------------------------------------------

export function buildAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
  loginHint?: string;
}): string {
  const u = new URL(AUTH_URL);
  u.searchParams.set('client_id', params.clientId);
  u.searchParams.set('redirect_uri', params.redirectUri);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', GOOGLE_SCOPES.join(' '));
  // `offline` is what makes Google return a refresh_token; `consent` forces the
  // consent screen so we reliably get a fresh refresh_token even if the user
  // previously granted these scopes.
  u.searchParams.set('access_type', 'offline');
  u.searchParams.set('prompt', 'consent');
  u.searchParams.set('include_granted_scopes', 'true');
  u.searchParams.set('state', params.state);
  if (params.loginHint) u.searchParams.set('login_hint', params.loginHint);
  return u.toString();
}

export function generateOAuthState(): string {
  return randomBytes(16).toString('hex');
}

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;   // only on first consent; we persist it
  expires_in: number;       // seconds
  scope: string;
  token_type: 'Bearer';
  id_token?: string;
}

export async function exchangeCodeForTokens(args: {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}): Promise<OAuthTokens> {
  const body = new URLSearchParams({
    code: args.code,
    client_id: args.clientId,
    client_secret: args.clientSecret,
    redirect_uri: args.redirectUri,
    grant_type: 'authorization_code'
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const raw = await res.text();
  if (!res.ok) throw new GoogleApiError(`Token exchange failed: ${raw}`, res.status, raw);
  return JSON.parse(raw) as OAuthTokens;
}

export async function refreshAccessToken(args: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<{ access_token: string; expires_in: number; scope: string }> {
  const body = new URLSearchParams({
    client_id: args.clientId,
    client_secret: args.clientSecret,
    refresh_token: args.refreshToken,
    grant_type: 'refresh_token'
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const raw = await res.text();
  if (!res.ok) throw new GoogleApiError(`Token refresh failed: ${raw}`, res.status, raw);
  return JSON.parse(raw);
}

export async function fetchUserEmail(accessToken: string): Promise<string> {
  const res = await fetch(USERINFO_URL, {
    headers: { authorization: `Bearer ${accessToken}` }
  });
  const raw = await res.text();
  if (!res.ok) throw new GoogleApiError(`userinfo failed: ${raw}`, res.status, raw);
  const data = JSON.parse(raw) as { email?: string };
  return data.email || '';
}

// -----------------------------------------------------------------------------
// Gmail
// -----------------------------------------------------------------------------

export interface Attachment {
  filename: string;
  content: string;          // plain text / markdown
  mimeType: string;         // 'text/markdown', 'text/plain', etc.
}

/** Encodes a raw RFC 2822 message as base64url (Gmail's expected format). */
function toBase64Url(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function encodeSubject(subject: string): string {
  // UTF-8 "encoded-word" header so non-ASCII subjects survive.
  return `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
}

function buildMime(args: {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachments?: Attachment[];
}): string {
  const boundary = `jobseeker_${randomBytes(8).toString('hex')}`;
  const hasAttachments = !!(args.attachments && args.attachments.length);

  const headers: string[] = [
    `From: ${args.from}`,
    `To: ${args.to}`,
    args.cc ? `Cc: ${args.cc}` : '',
    args.bcc ? `Bcc: ${args.bcc}` : '',
    `Subject: ${encodeSubject(args.subject)}`,
    'MIME-Version: 1.0'
  ].filter(Boolean);

  if (!hasAttachments) {
    headers.push('Content-Type: text/plain; charset="UTF-8"');
    headers.push('Content-Transfer-Encoding: 7bit');
    return `${headers.join('\r\n')}\r\n\r\n${args.body}`;
  }

  headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  const parts: string[] = [];
  parts.push(
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    args.body
  );
  for (const a of args.attachments!) {
    const b64 = Buffer.from(a.content, 'utf8').toString('base64');
    // Wrap base64 at 76 chars per RFC 2045.
    const wrapped = b64.replace(/(.{76})/g, '$1\r\n');
    parts.push(
      `--${boundary}`,
      `Content-Type: ${a.mimeType}; name="${a.filename}"`,
      `Content-Disposition: attachment; filename="${a.filename}"`,
      'Content-Transfer-Encoding: base64',
      '',
      wrapped
    );
  }
  parts.push(`--${boundary}--`);

  return `${headers.join('\r\n')}\r\n\r\n${parts.join('\r\n')}`;
}

export async function sendGmail(args: {
  accessToken: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachments?: Attachment[];
}): Promise<{ id: string; threadId: string }> {
  const mime = buildMime(args);
  const raw = toBase64Url(mime);
  const res = await fetch(GMAIL_SEND_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${args.accessToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });
  const text = await res.text();
  if (!res.ok) throw new GoogleApiError(`Gmail send failed: ${text}`, res.status, text);
  return JSON.parse(text);
}

// -----------------------------------------------------------------------------
// Drive
// -----------------------------------------------------------------------------

export interface DriveFile {
  id: string;
  name: string;
  webViewLink?: string;
  mimeType: string;
}

/**
 * Uploads a single file to Drive using multipart upload.
 * With `drive.file` scope we can only see files the app created.
 */
export async function uploadDriveFile(args: {
  accessToken: string;
  name: string;
  mimeType: string;
  content: string;
  parents?: string[];
}): Promise<DriveFile> {
  const boundary = `drive_${randomBytes(8).toString('hex')}`;
  const metadata: Record<string, unknown> = { name: args.name, mimeType: args.mimeType };
  if (args.parents && args.parents.length) metadata.parents = args.parents;

  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${args.mimeType}\r\n\r\n` +
    `${args.content}\r\n` +
    `--${boundary}--`;

  const url = `${DRIVE_UPLOAD_URL}&fields=id,name,webViewLink,mimeType`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${args.accessToken}`,
      'content-type': `multipart/related; boundary=${boundary}`
    },
    body
  });
  const text = await res.text();
  if (!res.ok) throw new GoogleApiError(`Drive upload failed: ${text}`, res.status, text);
  return JSON.parse(text) as DriveFile;
}

/**
 * Creates (or reuses, by name) a folder in the user's Drive.
 * We search among files we created (drive.file scope limits to that).
 */
export async function ensureDriveFolder(args: {
  accessToken: string;
  name: string;
  parent?: string;
}): Promise<string> {
  const q =
    `name='${args.name.replace(/'/g, "\\'")}'` +
    ` and mimeType='application/vnd.google-apps.folder' and trashed=false` +
    (args.parent ? ` and '${args.parent}' in parents` : '');
  const search = new URL(DRIVE_FILES_URL);
  search.searchParams.set('q', q);
  search.searchParams.set('fields', 'files(id,name)');
  const s = await fetch(search.toString(), {
    headers: { authorization: `Bearer ${args.accessToken}` }
  });
  if (s.ok) {
    const j = (await s.json()) as { files?: { id: string; name: string }[] };
    if (j.files && j.files.length) return j.files[0].id;
  }
  // Not found → create it.
  const createRes = await fetch(DRIVE_FILES_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${args.accessToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: args.name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: args.parent ? [args.parent] : undefined
    })
  });
  const text = await createRes.text();
  if (!createRes.ok) throw new GoogleApiError(`Drive folder create failed: ${text}`, createRes.status, text);
  const folder = JSON.parse(text) as { id: string };
  return folder.id;
}
