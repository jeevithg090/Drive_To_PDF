import { useEffect, useRef } from 'react';
import { KIND_LABELS, type ConvertedLink } from '../lib/driveLink';
import { CopyButton } from './CopyButton';
import { CheckCircleIcon, DownloadIcon, FileDownIcon, RefreshIcon } from './icons';

interface ResultCardProps {
  result: ConvertedLink;
  onReset: () => void;
}

/** Success state: the converted link with Download, Copy and "Convert another" actions. */
export const ResultCard = ({ result, onReset }: ResultCardProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isPdfExport = result.kind !== 'file';

  // Scroll the result into view on small screens, where it may render below the fold.
  useEffect(() => {
    headingRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [result.downloadUrl]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
        <CheckCircleIcon className="size-5 shrink-0" />
        <h2 ref={headingRef} className="text-base font-semibold sm:text-lg">
          Your download link is ready
        </h2>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            <FileDownIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{KIND_LABELS[result.kind]}</p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              File ID <span className="font-mono break-all">{result.fileId}</span>
            </p>
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {isPdfExport ? 'PDF export URL' : 'Direct download URL'}
          </span>
          <input
            readOnly
            value={result.downloadUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 block min-h-10 w-full truncate rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-800 focus:border-brand-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <a
            href={result.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            <DownloadIcon className="size-[18px]" />
            <span>Download{isPdfExport ? ' PDF' : ''}</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <CopyButton text={result.downloadUrl} />
        </div>
      </div>

      <button type="button" onClick={onReset} className="btn btn-ghost mt-3 w-full sm:w-auto">
        <RefreshIcon className="size-4" />
        Convert another link
      </button>
    </div>
  );
};
