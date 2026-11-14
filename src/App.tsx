import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { CopyButton } from './components/CopyButton';
import { DownloadIcon } from './components/DownloadIcon';
import { FileIcon } from './components/FileIcon';
import { LinkIcon } from './components/LinkIcon';
import { convertDriveLink, KIND_LABELS, type ConvertedLink } from './lib/driveLink';

const App = () => {
  const inputId = useId();
  const errorId = useId();
  const hintId = useId();

  const [driveLink, setDriveLink] = useState('');
  const [result, setResult] = useState<ConvertedLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriveLink(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const conversion = convertDriveLink(driveLink);
    if (conversion.ok) {
      setResult(conversion.value);
      setError(null);
    } else {
      setResult(null);
      setError(conversion.error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-gray-900 selection:bg-purple-500 selection:text-white dark:bg-slate-900 dark:text-gray-100">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-10 text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-6 h-2 w-full max-w-sm rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Google Drive PDF Downloader
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg dark:text-gray-400">
            Turn a shareable Google Drive link into a direct download link — or export a Google Doc,
            Sheet or Slides deck as PDF.
          </p>
        </header>

        <main className="rounded-2xl bg-white p-6 shadow-2xl md:p-8 dark:bg-slate-800">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <label htmlFor={inputId} className="text-lg font-semibold">
              Google Drive link
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LinkIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={inputId}
                type="text"
                inputMode="url"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={driveLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/…/view"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 py-3 pr-4 pl-10 transition-colors duration-300 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 aria-invalid:border-red-500 dark:border-slate-600 dark:bg-slate-700"
              />
            </div>
            <p id={hintId} className="text-sm text-gray-500 dark:text-gray-400">
              The file must be shared as “Anyone with the link”. Your link is converted locally in
              your browser and never sent anywhere.
            </p>
            {error && (
              <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-bold text-white transition-colors duration-300 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-slate-800"
            >
              Convert to download link
            </button>
          </form>

          <section aria-live="polite">
            {result && (
              <div className="mt-8 animate-fade-in border-t border-gray-200 pt-6 dark:border-slate-700">
                <h2 className="mb-4 text-center text-lg font-semibold">Your download is ready</h2>
                <div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-700">
                  <div className="flex min-w-0 items-center gap-4">
                    <FileIcon
                      aria-hidden="true"
                      className="h-10 w-10 flex-shrink-0 text-purple-500"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{KIND_LABELS[result.kind]}</p>
                      <p
                        className="truncate font-mono text-xs text-gray-600 dark:text-gray-300"
                        title={result.downloadUrl}
                      >
                        {result.downloadUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <CopyButton text={result.downloadUrl} />
                    <a
                      href={result.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-slate-700"
                    >
                      <DownloadIcon aria-hidden="true" className="h-5 w-5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Not affiliated with Google. Large files may show Google’s virus-scan warning first.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
