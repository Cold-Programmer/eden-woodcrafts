"use client";
import { apiFetchClient } from "@/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function Navbar({ user }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    async function handleLogout() {
        await apiFetchClient("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    }
    const dashboardHref = user?.role === "ADMIN" ? "/admin" : user?.role === "STAFF" ? "/staff" : "/dashboard";
    return (<header className="sticky top-0 z-50 border-b border-wood/10 bg-warmwhite/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-xl font-bold text-forest">
          Eden <span className="text-gold">Woodcrafts</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-charcoal md:flex">
          <Link href="/shop" className="hover:text-forest">Shop</Link>
          <Link href="/about" className="hover:text-forest">About</Link>
          <Link href="/portfolio" className="hover:text-forest">Portfolio</Link>
          <Link href="/custom-order" className="hover:text-forest">Custom Order</Link>
          <Link href="/services" className="hover:text-forest">Services</Link>
          <Link href="/contact" className="hover:text-forest">Contact</Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/cart" className="text-sm font-medium text-charcoal hover:text-forest">
            Cart
          </Link>
          {user ? (<>
              <Link href="/dashboard/wishlist" className="text-sm font-medium text-charcoal hover:text-forest">
                Wishlist
              </Link>
              <Link href={dashboardHref} className="text-sm font-medium text-charcoal hover:text-forest">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-warmwhite hover:bg-forest-light">
                Log out
              </button>
            </>) : (<>
              <Link href="/login" className="text-sm font-medium text-charcoal hover:text-forest">
                Log in
              </Link>
              <Link href="/register" className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-warmwhite hover:bg-forest-light">
                Sign up
              </Link>
            </>)}
        </div>

        <button className="md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="block h-0.5 w-6 bg-charcoal mb-1"/>
          <span className="block h-0.5 w-6 bg-charcoal mb-1"/>
          <span className="block h-0.5 w-6 bg-charcoal"/>
        </button>
      </div>

      {open && (<div className="border-t border-wood/10 bg-warmwhite px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-charcoal">
            <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/custom-order" onClick={() => setOpen(false)}>Custom Order</Link>
            <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/cart" onClick={() => setOpen(false)}>Cart</Link>
            {user ? (<>
                <Link href={dashboardHref} onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-forest">Log out</button>
              </>) : (<>
                <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                <Link href="/register" onClick={() => setOpen(false)}>Sign up</Link>
              </>)}
          </div>
        </div>)}
    </header>);
}
