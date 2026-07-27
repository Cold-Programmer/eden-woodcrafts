"use client";
import { useState } from "react";
export function Tooltip({ label, children }) {
    const [open, setOpen] = useState(false);
    return (<span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open && (<span role="tooltip" className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-charcoal px-2.5 py-1.5 text-xs text-warmwhite shadow-lg">
          {label}
        </span>)}
    </span>);
}
