import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../lib/theme';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeToggle', () => {
  it('defaults to the system theme', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Use system theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('applies and saves an explicit choice', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Dark theme' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Light theme' }));
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

    await user.click(screen.getByRole('button', { name: 'Use system theme' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('restores a saved choice and ignores unknown values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const { unmount } = render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    unmount();

    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Use system theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
