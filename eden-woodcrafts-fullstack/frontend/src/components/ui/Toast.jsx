"use client";
import { createContext, useCallback, useContext, useState } from "react";
const ToastContext = createContext(null);
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}
const KIND_STYLES = {
    success: "bg-forest text-warmwhite",
    error: "bg-red-600 text-white",
    info: "bg-charcoal text-warmwhite"
};
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((message, kind = "info") => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, kind }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);
    return (<ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (<div key={t.id} role="status" style={{ animation: "toast-in var(--duration-base) var(--ease-standard)" }} className={`pointer-events-auto min-w-[220px] max-w-sm rounded-md px-4 py-3 text-sm shadow-lg ${KIND_STYLES[t.kind]}`}>
            {t.message}
          </div>))}
      </div>
    </ToastContext.Provider>);
}
