
import React, { useState, FormEvent } from 'react';
import { LinkIcon } from './components/LinkIcon';
import { FileIcon } from './components/FileIcon';
import { DownloadIcon } from './components/DownloadIcon';

const App: React.FC = () => {
  const [driveLink, setDriveLink] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractFileId = (url: string): string | null => {
    const regex = /\/file\/d\/([a-zA-Z0-9_-]{25,})|\/d\/([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regex);
    if (match) {
      return match[1] || match[2];
    }
    return null;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setDownloadLink(null);
    setIsLoading(true);

    if (!driveLink) {
      setError('Please enter a Google Drive link.');
      setIsLoading(false);
      return;
    }

    // Simulate a short delay for better UX
    setTimeout(() => {
      const fileId = extractFileId(driveLink);

      if (fileId) {
        const directDownloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        setDownloadLink(directDownloadLink);
      } else {
        setError('Invalid Google Drive link. Please make sure it is a valid file link.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="w-full max-w-sm mx-auto h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100">
            Google Drive PDF Downloader
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg italic">
            Convert your shareable PDF links into direct download links instantly.
          </p>
        </header>

        <main className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="drive-link" className="font-semibold text-lg">Enter Google Drive Link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="drive-link"
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-slate-800"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Converting...</span>
                </>
              ) : (
                'Convert to Download Link'
              )}
            </button>
          </form>

          {downloadLink && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 animate-fade-in">
              <h2 className="text-lg font-semibold text-center mb-4">Your Download is Ready!</h2>
              <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <FileIcon className="h-10 w-10 text-purple-500 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    PDF file ready for download.
                  </p>
                </div>
                <a
                  href={downloadLink}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 flex-shrink-0 transition-colors duration-300"
                >
                  <DownloadIcon className="h-5 w-5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          )}
        </main>
        <footer className="text-center mt-10 text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Drive Link Converter. All rights reserved.</p>
        </footer>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
