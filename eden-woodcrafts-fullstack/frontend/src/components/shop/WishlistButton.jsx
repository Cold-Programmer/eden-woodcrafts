"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";
export function WishlistButton({ productId, initialSaved = false }) {
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();
    async function toggle() {
        setLoading(true);
        const res = saved
            ? await apiFetchClient(`/api/wishlist?productId=${productId}`, { method: "DELETE" })
            : await apiFetchClient("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            });
        setLoading(false);
        if (res.status === 401) {
            router.push("/login?redirect=/wishlist");
            return;
        }
        if (!res.ok) {
            showToast("Something went wrong updating your wishlist.", "error");
            return;
        }
        setSaved(!saved);
        showToast(saved ? "Removed from wishlist" : "Saved to wishlist", "success");
    }
    return (<button onClick={toggle} disabled={loading} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${saved ? "border-gold bg-gold/10 text-wood" : "border-wood/20 text-charcoal/50 hover:text-wood"}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.3 5 5.7 5c1.9 0 3.4 1 4.3 2.4C10.9 6 12.4 5 14.3 5c3.4 0 5.2 3.4 3.7 6.9C19.5 16.4 12 21 12 21z"/>
      </svg>
    </button>);
}
