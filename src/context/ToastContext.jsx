import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

let id = 0;

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: 'bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  error:   'bg-red-50 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  info:    'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  warning: 'bg-amber-50 border-amber-400 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

const iconColors = {
  success: 'text-emerald-500', error: 'text-red-500',
  info: 'text-blue-500', warning: 'text-amber-500',
};

function ToastItem({ toast, onRemove }) {
  const Icon = icons[toast.type] || Info;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm w-full
      ${styles[toast.type]} animate-toast-in`}>
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
        <p className="text-sm leading-snug">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const tid = ++id;
    setToasts(t => [...t, { id: tid, type, title, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== tid)), duration);
  }, []);

  const removeToast = useCallback((tid) => setToasts(t => t.filter(x => x.id !== tid)), []);

  const toast = {
    success: (msg, title) => addToast({ type: 'success', message: msg, title }),
    error:   (msg, title) => addToast({ type: 'error',   message: msg, title }),
    info:    (msg, title) => addToast({ type: 'info',    message: msg, title }),
    warning: (msg, title) => addToast({ type: 'warning', message: msg, title }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 items-end">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={removeToast} />)}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
