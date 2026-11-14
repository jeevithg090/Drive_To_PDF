import type { ComponentType, SVGProps } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { ThemePreference } from '../lib/theme';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';

const OPTIONS: {
  value: ThemePreference;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { value: 'light', label: 'Light theme', Icon: SunIcon },
  { value: 'dark', label: 'Dark theme', Icon: MoonIcon },
  { value: 'system', label: 'Use system theme', Icon: MonitorIcon },
];

/** Three-way light / dark / system switch. Each option is a toggle button with `aria-pressed`. */
export const ThemeToggle = () => {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => setPreference(value)}
            className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-md transition-[color,background-color,border-color] duration-150 ${
              active
                ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <Icon className="size-[18px]" />
          </button>
        );
      })}
    </div>
  );
};
