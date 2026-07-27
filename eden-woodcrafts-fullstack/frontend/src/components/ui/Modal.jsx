"use client";
import { useEffect } from "react";
export function Modal({ open, onClose, title, children }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape")
                onClose();
        }
        if (open)
            document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-md rounded-xl2 bg-white p-6 shadow-lg" style={{ animation: "toast-in var(--duration-base) var(--ease-standard)" }}>
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="font-serif text-lg font-bold text-charcoal">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-charcoal/50 hover:text-charcoal">
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>);
}
