// PDF parsing is optional — if pdf-parse is not installed we gracefully fall
// back to "please paste the text version". Keeps the happy path working.

export async function extractTextFromBuffer(
  buf: Buffer,
  mime: string,
  filename: string
): Promise<string> {
  const name = filename.toLowerCase();
  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    try {
      // Import the inner module directly to skip pdf-parse's index.js debug
      // code that tries to open a test PDF at module load (breaks under bundlers).
      const mod: unknown = await import('pdf-parse/lib/pdf-parse.js');
      const pdfParse =
        (mod as { default?: (b: Buffer) => Promise<{ text: string }> }).default ||
        (mod as (b: Buffer) => Promise<{ text: string }>);
      const result = await pdfParse(buf);
      if (!result?.text || result.text.trim().length < 50) {
        throw new Error(
          'PDF parsed but contained almost no text (it may be image-based / scanned). Paste the resume as plain text instead.'
        );
      }
      return normalize(result.text);
    } catch (err) {
      throw new Error(
        `Could not parse PDF (${(err as Error).message}). Paste the resume as plain text instead.`
      );
    }
  }
  if (
    mime.startsWith('text/') ||
    name.endsWith('.md') ||
    name.endsWith('.txt') ||
    name.endsWith('.markdown')
  ) {
    return normalize(buf.toString('utf8'));
  }
  // Unknown — try utf8.
  return normalize(buf.toString('utf8'));
}

function normalize(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '  ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
