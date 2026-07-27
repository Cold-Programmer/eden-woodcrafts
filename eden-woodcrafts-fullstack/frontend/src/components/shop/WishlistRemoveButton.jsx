"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";
export function WishlistRemoveButton({ productId }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();
    async function handleRemove() {
        setLoading(true);
        await apiFetchClient(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
        setLoading(false);
        showToast("Removed from wishlist", "info");
        router.refresh();
    }
    return (<button onClick={handleRemove} disabled={loading} className="text-sm text-red-600 hover:underline disabled:opacity-50">
      Remove
    </button>);
}
