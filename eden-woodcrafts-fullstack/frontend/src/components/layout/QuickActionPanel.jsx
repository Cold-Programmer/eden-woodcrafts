"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
// Every button here does something real when clicked — no decorative
// placeholders for features that don't exist yet (AI assistant, live
// chat, command palette, etc. aren't wired to anything, so they're not
// here — see README for why).
export function QuickActionPanel() {
    const [open, setOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        function onScroll() {
            setShowBackToTop(window.scrollY > 500);
        }
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (<div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (<div className="flex flex-col gap-2 rounded-xl2 border border-wood/10 bg-surface p-3 shadow-lg" style={{ animation: "toast-in var(--duration-base) var(--ease-standard)" }}>
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-xs font-medium text-page-ink/60">Theme</span>
            <ThemeToggle />
          </div>
          <Link href="/dashboard/wishlist" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-page-ink hover:bg-wood/10">
            ❤️ Wishlist
          </Link>
          <a href="https://wa.me/254702543867" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-page-ink hover:bg-wood/10">
            💬 WhatsApp Support
          </a>
          <Link href="/contact" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-page-ink hover:bg-wood/10">
            📞 Contact & Help
          </Link>
          {showBackToTop && (<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-page-ink hover:bg-wood/10">
              ⬆️ Back to Top
            </button>)}
        </div>)}

      <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close quick actions" : "Open quick actions"} aria-expanded={open} className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-warmwhite shadow-lg transition hover:scale-105 hover:bg-forest-light active:scale-95">
        <span className="text-xl">{open ? "×" : "✦"}</span>
      </button>
    </div>);
}
