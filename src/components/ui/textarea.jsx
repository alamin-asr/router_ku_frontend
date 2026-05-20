import { cn } from '../../lib/utils';

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20',
        className,
      )}
      {...props}
    />
  );
}