import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { HowItWorks, SupportedLinks } from './components/InfoSections';
import { ResultCard } from './components/ResultCard';
import { ThemeToggle } from './components/ThemeToggle';
import { AlertCircleIcon, FileDownIcon, LinkIcon, ShieldIcon, XIcon } from './components/icons';
import { convertDriveLink, type ConvertedLink } from './lib/driveLink';

const App = () => {
  const inputId = useId();
  const errorId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

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
      inputRef.current?.focus();
    }
  };

  const reset = () => {
    setDriveLink('');
    setResult(null);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold text-brand-700 shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3 dark:bg-slate-900 dark:text-brand-300"
      >
        Skip to content
      </a>

      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <FileDownIcon className="size-5" />
          </span>
          <span className="text-sm sm:text-base">Drive → PDF</span>
        </div>
        <ThemeToggle />
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-16 sm:px-6 sm:pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Google Drive PDF Downloader
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-pretty text-slate-600 sm:text-lg dark:text-slate-400">
            Turn a shareable Google Drive link into a direct download link — or export a Google Doc,
            Sheet or Slides deck as PDF.
          </p>
        </div>

        <div className="card mx-auto mt-8 max-w-2xl p-5 sm:mt-10 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
            <label htmlFor={inputId} className="text-sm font-semibold sm:text-base">
              Google Drive link
            </label>
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                inputMode="url"
                enterKeyHint="go"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={driveLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/…/view"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${errorId} ${hintId}` : hintId}
                className={`input pl-10 ${driveLink ? 'pr-12' : 'pr-3'}`}
              />
              {driveLink && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Clear link"
                  title="Clear link"
                  className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>

            {error && (
              <p
                id={errorId}
                role="alert"
                className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200"
              >
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            <p
              id={hintId}
              className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <ShieldIcon className="mt-0.5 size-4 shrink-0" />
              <span>
                The file must be shared as “Anyone with the link”. Your link is converted locally in
                your browser and never sent anywhere.
              </span>
            </p>

            <button type="submit" className="btn btn-primary mt-1 w-full">
              Convert to download link
            </button>

            <SupportedLinks />
          </form>

          <section aria-live="polite" aria-label="Result">
            {result && (
              <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
                <ResultCard key={result.downloadUrl} result={result} onReset={reset} />
              </div>
            )}
          </section>
        </div>

        <HowItWorks />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <p className="mx-auto max-w-3xl px-4">
          Not affiliated with Google. Large files may show Google’s virus-scan warning first.
        </p>
      </footer>
    </div>
  );
};

export default App;
