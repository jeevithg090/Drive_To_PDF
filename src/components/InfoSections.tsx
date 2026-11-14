import { ChevronDownIcon } from './icons';

const STEPS = [
  {
    title: 'Share the file',
    body: 'In Google Drive, set General access to “Anyone with the link” and copy the link.',
  },
  {
    title: 'Paste and convert',
    body: 'The link is rewritten in your browser. Nothing is uploaded or stored.',
  },
  {
    title: 'Download',
    body: 'Drive files download directly. Docs, Sheets and Slides download as PDF.',
  },
] as const;

const FORMATS = [
  { example: 'drive.google.com/file/d/…/view', note: 'also /preview, /edit and /file/u/0/d/…' },
  { example: 'drive.google.com/open?id=…', note: 'and drive.google.com/uc?id=…' },
  { example: 'drive.usercontent.google.com/download?id=…', note: 'direct-download host' },
  { example: 'docs.google.com/document/d/…', note: 'Google Doc → PDF' },
  { example: 'docs.google.com/spreadsheets/d/…', note: 'Google Sheet → PDF' },
  { example: 'docs.google.com/presentation/d/…', note: 'Google Slides → PDF' },
] as const;

/** Collapsible list of accepted link formats, shown under the input. */
export const SupportedLinks = () => (
  <details className="group rounded-lg border border-slate-200 text-sm dark:border-slate-800">
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 font-medium text-slate-700 select-none hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60 [&::-webkit-details-marker]:hidden">
      Which links are supported?
      <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-150 group-open:rotate-180" />
    </summary>
    <ul className="space-y-2 border-t border-slate-200 px-3 py-3 dark:border-slate-800">
      {FORMATS.map(({ example, note }) => (
        <li key={example} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
          <code className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">
            {example}
          </code>
          <span className="text-xs text-slate-600 dark:text-slate-400">{note}</span>
        </li>
      ))}
      <li className="pt-1 text-xs text-slate-600 dark:text-slate-400">
        Folder links are not supported. Open the folder and copy the link of a single file.
      </li>
    </ul>
  </details>
);

/** Three-step explainer shown under the main card. */
export const HowItWorks = () => (
  <section aria-labelledby="how-it-works" className="mt-12">
    <h2 id="how-it-works" className="text-center text-lg font-semibold sm:text-xl">
      How it works
    </h2>
    <ol className="mt-6 grid gap-4 sm:grid-cols-3">
      {STEPS.map(({ title, body }, index) => (
        <li key={title} className="card p-5">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-200"
          >
            {index + 1}
          </span>
          <h3 className="mt-3 font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{body}</p>
        </li>
      ))}
    </ol>
  </section>
);
