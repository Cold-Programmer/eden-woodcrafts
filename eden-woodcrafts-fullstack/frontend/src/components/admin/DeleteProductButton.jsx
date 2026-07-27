"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
export function DeleteProductButton({ id }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    async function handleDelete() {
        if (!confirm("Hide this product from the storefront? Past orders keep their history."))
            return;
        setLoading(true);
        const res = await apiFetchClient(`/api/admin/products/${id}`, { method: "DELETE" });
        setLoading(false);
        if (!res.ok) {
            showToast("Couldn't remove that product.", "error");
            return;
        }
        showToast("Product hidden from storefront", "success");
        router.refresh();
    }
    return (<button onClick={handleDelete} disabled={loading} className="text-red-600 hover:underline disabled:opacity-50">
      {loading ? "..." : "Delete"}
    </button>);
}
