import { cn } from '../../lib/utils';

const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-60';

const variantStyles = {
  default: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99]',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
};

const sizeStyles = {
  default: 'h-11 px-4 py-2',
  sm: 'h-9 rounded-lg px-3',
  lg: 'h-12 rounded-xl px-6',
  icon: 'h-10 w-10',
};

export function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button';

  return (
    <Comp
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
}