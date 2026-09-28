import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={theme === 'dark'}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052] dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 ${compact ? 'w-10 px-0' : ''}`}
    >
      <Icon aria-hidden="true" className="h-4 w-4 text-[#785910] dark:text-[#dfbe74]" />
      {!compact && <span>{nextTheme === 'dark' ? 'Dark' : 'Light'}</span>}
    </button>
  );
}
