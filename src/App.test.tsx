import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { ERRORS } from './lib/driveLink';

const ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz_0123-';

const setup = () => {
  const user = userEvent.setup();
  render(<App />);
  const input = screen.getByLabelText('Google Drive link');
  const submit = screen.getByRole('button', { name: /convert to download link/i });
  return { user, input, submit };
};

describe('App', () => {
  it('renders the heading and form', () => {
    setup();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Google Drive PDF Downloader' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument();
  });

  it('shows an accessible error for empty input', async () => {
    const { user, input, submit } = setup();
    await user.click(submit);
    expect(screen.getByRole('alert')).toHaveTextContent(ERRORS.empty);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows an error for a non-Drive link and clears it when typing', async () => {
    const { user, input, submit } = setup();
    await user.type(input, 'https://example.com/file/d/abc');
    await user.click(submit);
    expect(screen.getByRole('alert')).toHaveTextContent(ERRORS.notGoogle);

    await user.type(input, 'x');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('produces a direct download link for a Drive file', async () => {
    const { user, input, submit } = setup();
    await user.type(input, `https://drive.google.com/file/d/${ID}/view?usp=sharing`);
    await user.click(submit);

    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toHaveAttribute('href', `https://drive.google.com/uc?export=download&id=${ID}`);
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Google Drive file')).toBeInTheDocument();
  });

  it('produces a PDF export link for a Google Doc when submitting with Enter', async () => {
    const { user, input } = setup();
    await user.type(input, `https://docs.google.com/document/d/${ID}/edit{Enter}`);

    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
      'href',
      `https://docs.google.com/document/d/${ID}/export?format=pdf`,
    );
    expect(screen.getByText('Google Doc (exported as PDF)')).toBeInTheDocument();
  });

  it('hides a previous result after an invalid submission', async () => {
    const { user, input, submit } = setup();
    await user.type(input, `https://drive.google.com/file/d/${ID}/view`);
    await user.click(submit);
    expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'https://drive.google.com/drive/folders/' + ID);
    await user.click(submit);
    expect(screen.getByRole('alert')).toHaveTextContent(ERRORS.folder);
    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument();
  });

  it('copies the download link to the clipboard', async () => {
    const { user, input, submit } = setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    await user.type(input, `https://drive.google.com/file/d/${ID}/view`);
    await user.click(submit);
    await user.click(screen.getByRole('button', { name: 'Copy link' }));

    expect(writeText).toHaveBeenCalledWith(`https://drive.google.com/uc?export=download&id=${ID}`);
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('reports a clipboard failure', async () => {
    const { user, input, submit } = setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    await user.type(input, `https://drive.google.com/file/d/${ID}/view`);
    await user.click(submit);
    await user.click(screen.getByRole('button', { name: 'Copy link' }));

    expect(screen.getByRole('button', { name: 'Copy failed' })).toBeInTheDocument();
  });
});

describe('App result actions', () => {
  it('labels PDF exports and resets the form with "Convert another link"', async () => {
    const { user, input } = setup();
    await user.type(input, `https://docs.google.com/spreadsheets/d/${ID}/edit{Enter}`);
    expect(screen.getByRole('link', { name: /download pdf/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue(/export\?format=pdf$/)).toHaveAttribute('readonly');

    await user.click(screen.getByRole('button', { name: /convert another link/i }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument();
  });

  it('clears the input with the clear button', async () => {
    const { user, input } = setup();
    expect(screen.queryByRole('button', { name: 'Clear link' })).not.toBeInTheDocument();
    await user.type(input, 'drive.google.com');
    await user.click(screen.getByRole('button', { name: 'Clear link' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('moves focus back to the input after a validation error', async () => {
    const { user, input, submit } = setup();
    await user.click(submit);
    expect(input).toHaveFocus();
  });
});
