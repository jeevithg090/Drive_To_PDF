import { describe, expect, it } from 'vitest';
import {
  buildFileDownloadUrl,
  buildPdfExportUrl,
  convertDriveLink,
  ERRORS,
  isValidFileId,
} from './driveLink';

const ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz_0123-';
const DOWNLOAD = `https://drive.google.com/uc?export=download&id=${ID}`;

const expectFile = (input: string, downloadUrl = DOWNLOAD) => {
  expect(convertDriveLink(input)).toEqual({
    ok: true,
    value: { kind: 'file', fileId: ID, downloadUrl },
  });
};

const expectError = (input: string, error: string) => {
  expect(convertDriveLink(input)).toEqual({ ok: false, error });
};

describe('convertDriveLink: Drive files', () => {
  it.each([
    `https://drive.google.com/file/d/${ID}/view?usp=sharing`,
    `https://drive.google.com/file/d/${ID}/view`,
    `https://drive.google.com/file/d/${ID}`,
    `https://drive.google.com/file/d/${ID}/preview`,
    `https://drive.google.com/file/u/0/d/${ID}/view`,
    `https://drive.google.com/open?id=${ID}`,
    `https://drive.google.com/uc?id=${ID}&export=download`,
    `https://drive.usercontent.google.com/download?id=${ID}&export=download`,
    `https://docs.google.com/file/d/${ID}/edit`,
    `http://drive.google.com/file/d/${ID}/view`,
    `https://DRIVE.GOOGLE.COM/file/d/${ID}/view`,
  ])('converts %s', (input) => {
    expectFile(input);
  });

  it('accepts links without a scheme and with surrounding whitespace', () => {
    expectFile(`  drive.google.com/file/d/${ID}/view?usp=sharing \n`);
  });

  it('preserves the resource key needed by older shared links', () => {
    expectFile(
      `https://drive.google.com/file/d/${ID}/view?usp=sharing&resourcekey=0-abc_DEF`,
      `${DOWNLOAD}&resourcekey=0-abc_DEF`,
    );
  });
});

describe('convertDriveLink: Google Workspace files', () => {
  it('exports Google Docs as PDF', () => {
    expect(convertDriveLink(`https://docs.google.com/document/d/${ID}/edit?usp=sharing`)).toEqual({
      ok: true,
      value: {
        kind: 'document',
        fileId: ID,
        downloadUrl: `https://docs.google.com/document/d/${ID}/export?format=pdf`,
      },
    });
  });

  it('exports Google Sheets as PDF', () => {
    const result = convertDriveLink(`https://docs.google.com/spreadsheets/d/${ID}/edit#gid=0`);
    expect(result).toMatchObject({
      ok: true,
      value: {
        kind: 'spreadsheet',
        downloadUrl: `https://docs.google.com/spreadsheets/d/${ID}/export?format=pdf`,
      },
    });
  });

  it('exports Google Slides as PDF, including multi-account /u/N/ links', () => {
    const result = convertDriveLink(`https://docs.google.com/presentation/u/1/d/${ID}/edit`);
    expect(result).toMatchObject({
      ok: true,
      value: {
        kind: 'presentation',
        downloadUrl: `https://docs.google.com/presentation/d/${ID}/export/pdf`,
      },
    });
  });

  it('rejects unsupported docs.google.com paths', () => {
    expectError(`https://docs.google.com/forms/d/${ID}/viewform`, ERRORS.noFileId);
  });
});

describe('convertDriveLink: invalid input', () => {
  it.each(['', '   '])('rejects empty input %j', (input) => {
    expectError(input, ERRORS.empty);
  });

  it('rejects text that is not a URL', () => {
    expectError('not a url at all', ERRORS.invalidUrl);
  });

  it('rejects non-http(s) schemes', () => {
    expectError(`javascript:alert(1)//drive.google.com/file/d/${ID}`, ERRORS.invalidUrl);
    expectError(`ftp://drive.google.com/file/d/${ID}`, ERRORS.invalidUrl);
  });

  it.each([
    `https://example.com/file/d/${ID}/view`,
    `https://drive.google.com.evil.example/file/d/${ID}/view`,
    `https://evil.example/?next=https://drive.google.com/file/d/${ID}`,
  ])('rejects non-Google host %s', (input) => {
    expectError(input, ERRORS.notGoogle);
  });

  it('rejects folder links with a helpful message', () => {
    expectError(`https://drive.google.com/drive/folders/${ID}?usp=sharing`, ERRORS.folder);
  });

  it.each([
    'https://drive.google.com/file/d/short/view',
    'https://drive.google.com/open?id=tooShort123',
    'https://drive.google.com/drive/my-drive',
    `https://drive.google.com/file/d/${ID.slice(0, 10)}!!${ID.slice(10)}/view`,
  ])('rejects links without a valid file ID: %s', (input) => {
    expectError(input, ERRORS.noFileId);
  });
});

describe('helpers', () => {
  it('validates file IDs', () => {
    expect(isValidFileId(ID)).toBe(true);
    expect(isValidFileId('a'.repeat(24))).toBe(false);
    expect(isValidFileId('a'.repeat(25))).toBe(true);
    expect(isValidFileId(`${ID}/`)).toBe(false);
  });

  it('encodes the resource key when building download URLs', () => {
    expect(buildFileDownloadUrl(ID, 'a b&c')).toBe(`${DOWNLOAD}&resourcekey=a+b%26c`);
    expect(buildFileDownloadUrl(ID, null)).toBe(DOWNLOAD);
  });

  it('builds PDF export URLs for each Workspace type', () => {
    expect(buildPdfExportUrl('document', ID)).toContain('/document/d/');
    expect(buildPdfExportUrl('spreadsheet', ID)).toContain('/spreadsheets/d/');
    expect(buildPdfExportUrl('presentation', ID)).toContain('/export/pdf');
  });
});
