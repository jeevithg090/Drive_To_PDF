/**
 * Parsing and conversion of Google Drive / Google Docs share links into
 * direct download (or PDF export) URLs.
 *
 * Everything here is pure and runs entirely in the browser: no network
 * requests are made and nothing leaves the user's machine.
 */

/** The kinds of Google resources a share link can point at. */
export type DriveResourceKind = 'file' | 'document' | 'spreadsheet' | 'presentation';

export interface ConvertedLink {
  kind: DriveResourceKind;
  fileId: string;
  /** Direct download URL for Drive files, PDF export URL for Google Workspace files. */
  downloadUrl: string;
}

export type ConversionResult = { ok: true; value: ConvertedLink } | { ok: false; error: string };

export const ERRORS = {
  empty: 'Please enter a Google Drive link.',
  invalidUrl: 'That does not look like a valid URL.',
  notGoogle: 'Only drive.google.com and docs.google.com links are supported.',
  folder:
    'Folder links cannot be downloaded directly. Open the folder and copy the link of a single file.',
  noFileId: 'Could not find a file ID in that link. Make sure it is a link to a single file.',
} as const;

const DRIVE_HOSTS = new Set(['drive.google.com', 'drive.usercontent.google.com']);
const DOCS_HOST = 'docs.google.com';

/** Drive file IDs are URL-safe base64-ish strings; real ones are 25–44+ characters. */
const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{25,128}$/;

const DOCS_KINDS: Record<string, Exclude<DriveResourceKind, 'file'>> = {
  document: 'document',
  spreadsheets: 'spreadsheet',
  presentation: 'presentation',
};

/** Returns true if `id` looks like a Google Drive file ID. */
export const isValidFileId = (id: string): boolean => FILE_ID_PATTERN.test(id);

/**
 * Parses user input into a URL, tolerating surrounding whitespace and a
 * missing `https://` scheme (e.g. `drive.google.com/file/d/...`).
 */
const parseUrl = (input: string): URL | null => {
  const trimmed = input.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
};

/** Finds the path segment that follows a `d` segment: `/file/d/<id>/view`, `/document/d/<id>/edit`. */
const idAfterDSegment = (segments: string[]): string | null => {
  const index = segments.indexOf('d');
  return index >= 0 ? (segments[index + 1] ?? null) : null;
};

export const buildFileDownloadUrl = (fileId: string, resourceKey?: string | null): string => {
  const params = new URLSearchParams({ export: 'download', id: fileId });
  if (resourceKey) params.set('resourcekey', resourceKey);
  return `https://drive.google.com/uc?${params.toString()}`;
};

export const buildPdfExportUrl = (
  kind: Exclude<DriveResourceKind, 'file'>,
  fileId: string,
): string => {
  const base = `https://docs.google.com`;
  switch (kind) {
    case 'document':
      return `${base}/document/d/${fileId}/export?format=pdf`;
    case 'spreadsheet':
      return `${base}/spreadsheets/d/${fileId}/export?format=pdf`;
    case 'presentation':
      return `${base}/presentation/d/${fileId}/export/pdf`;
  }
};

/**
 * Converts a Google Drive or Google Docs share link into a direct download URL.
 *
 * Supported inputs include:
 * - `https://drive.google.com/file/d/<id>/view?usp=sharing`
 * - `https://drive.google.com/file/u/0/d/<id>/view`
 * - `https://drive.google.com/open?id=<id>`
 * - `https://drive.google.com/uc?id=<id>&export=download`
 * - `https://drive.usercontent.google.com/download?id=<id>`
 * - `https://docs.google.com/{document,spreadsheets,presentation}/d/<id>/edit` (exported as PDF)
 */
export const convertDriveLink = (input: string): ConversionResult => {
  if (!input.trim()) return { ok: false, error: ERRORS.empty };

  const url = parseUrl(input);
  if (!url) return { ok: false, error: ERRORS.invalidUrl };

  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === DOCS_HOST) {
    const kind = DOCS_KINDS[segments[0] ?? ''];
    const fileId = idAfterDSegment(segments);
    if (kind && fileId && isValidFileId(fileId)) {
      return { ok: true, value: { kind, fileId, downloadUrl: buildPdfExportUrl(kind, fileId) } };
    }
    // Legacy docs.google.com/file/d/<id> links are plain Drive files.
    if (segments[0] === 'file' && fileId && isValidFileId(fileId)) {
      return fileResult(fileId, url);
    }
    return { ok: false, error: ERRORS.noFileId };
  }

  if (!DRIVE_HOSTS.has(host)) return { ok: false, error: ERRORS.notGoogle };

  if (segments.includes('folders')) return { ok: false, error: ERRORS.folder };

  const fileId = idAfterDSegment(segments) ?? url.searchParams.get('id');
  if (fileId && isValidFileId(fileId)) return fileResult(fileId, url);

  return { ok: false, error: ERRORS.noFileId };
};

const fileResult = (fileId: string, url: URL): ConversionResult => ({
  ok: true,
  value: {
    kind: 'file',
    fileId,
    downloadUrl: buildFileDownloadUrl(fileId, url.searchParams.get('resourcekey')),
  },
});

export const KIND_LABELS: Record<DriveResourceKind, string> = {
  file: 'Google Drive file',
  document: 'Google Doc (exported as PDF)',
  spreadsheet: 'Google Sheet (exported as PDF)',
  presentation: 'Google Slides deck (exported as PDF)',
};
