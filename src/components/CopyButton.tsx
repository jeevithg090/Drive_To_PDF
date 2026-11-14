import { useEffect, useRef, useState } from 'react';

type CopyState = 'idle' | 'copied' | 'failed';

const LABELS: Record<CopyState, string> = {
  idle: 'Copy link',
  copied: 'Copied!',
  failed: 'Copy failed',
};

interface CopyButtonProps {
  text: string;
  /** How long the confirmation stays visible, in milliseconds. */
  resetAfterMs?: number;
}

export const CopyButton = ({ text, resetAfterMs = 2000 }: CopyButtonProps) => {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), resetAfterMs);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className="rounded-lg border-2 border-purple-600 px-4 py-2 font-bold text-purple-700 transition-colors duration-300 hover:bg-purple-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none dark:text-purple-300 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-700"
    >
      {LABELS[state]}
    </button>
  );
};
