import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, { type = "info", duration = 3500 } = {}) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const toast = useMemo(
    () => ({
      success: (m, opts) => push(m, { ...opts, type: "success" }),
      error:   (m, opts) => push(m, { ...opts, type: "error" }),
      info:    (m, opts) => push(m, { ...opts, type: "info" }),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

function ToastItem({ toast, onClose }) {
  const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? AlertCircle : Info;
  const palette = {
    success: "bg-success-500 text-white",
    error:   "bg-danger-500 text-white",
    info:    "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
  }[toast.type];
  return (
    <div
      className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-xl px-4 py-3 shadow-elevated animate-slide-up ${palette}`}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="ml-2 rounded-md p-1 hover:bg-white/20"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
