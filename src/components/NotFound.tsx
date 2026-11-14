import { useEffect } from 'react';
import { FileDownIcon } from './icons';

/** Shown for any path other than the app's home page. */
export const NotFound = () => {
  useEffect(() => {
    document.title = 'Page not found — Google Drive PDF Downloader';
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="card w-full max-w-md p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <FileDownIcon className="size-6" />
        </span>
        <p className="mt-5 text-sm font-bold tracking-widest text-brand-700 dark:text-brand-300">
          404
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          This page doesn’t exist. The converter lives on the home page.
        </p>
        <a href={import.meta.env.BASE_URL} className="btn btn-primary mt-6">
          Go to the converter
        </a>
      </div>
    </main>
  );
};
