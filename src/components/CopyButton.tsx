import { useEffect, useRef, useState } from 'react';
import { AlertCircleIcon, CheckIcon, CopyIcon } from './icons';

type CopyState = 'idle' | 'copied' | 'failed';

const LABELS: Record<CopyState, string> = {
  idle: 'Copy link',
  copied: 'Copied!',
  failed: 'Copy failed',
};

const ICONS = { idle: CopyIcon, copied: CheckIcon, failed: AlertCircleIcon } as const;

interface CopyButtonProps {
  text: string;
  /** How long the confirmation stays visible, in milliseconds. */
  resetAfterMs?: number;
  className?: string;
}

export const CopyButton = ({ text, resetAfterMs = 2000, className = '' }: CopyButtonProps) => {
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

  const Icon = ICONS[state];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`btn btn-secondary ${
        state === 'copied' ? 'text-green-800! dark:text-green-300!' : ''
      } ${state === 'failed' ? 'text-red-700! dark:text-red-300!' : ''} ${className}`}
    >
      <Icon className="size-[18px]" />
      <span>{LABELS[state]}</span>
    </button>
  );
};
