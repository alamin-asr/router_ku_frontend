import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-6 sm:p-8 pb-0', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn('text-2xl font-bold tracking-tight text-slate-900 dark:text-white', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('mt-2 text-sm text-slate-500 dark:text-slate-400', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 sm:p-8', className)} {...props} />;
}