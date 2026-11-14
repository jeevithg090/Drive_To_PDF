import { describe, expect, it } from 'vitest';
import { isHomePath } from './route';

describe('isHomePath', () => {
  it.each(['/', '/index.html'])('accepts %s at the root base', (path) => {
    expect(isHomePath(path)).toBe(true);
  });

  it.each(['/about', '/file/d/abc', '/index.htm'])('rejects %s', (path) => {
    expect(isHomePath(path)).toBe(false);
  });

  it('respects a sub-path base with or without a trailing slash', () => {
    expect(isHomePath('/Drive_To_PDF/', '/Drive_To_PDF/')).toBe(true);
    expect(isHomePath('/Drive_To_PDF', '/Drive_To_PDF/')).toBe(true);
    expect(isHomePath('/Drive_To_PDF/index.html', '/Drive_To_PDF')).toBe(true);
    expect(isHomePath('/', '/Drive_To_PDF/')).toBe(false);
  });
});
