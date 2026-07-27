"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
const STATUSES = [
    "PENDING_PAYMENT",
    "CONFIRMED",
    "IN_PRODUCTION",
    "QUALITY_CHECK",
    "PACKAGING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED"
];
export function OrderStatusSelect({ orderId, status }) {
    const router = useRouter();
    const [value, setValue] = useState(status);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    async function handleChange(newStatus) {
        const previous = value;
        setValue(newStatus);
        setLoading(true);
        const res = await apiFetchClient(`/api/admin/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        setLoading(false);
        if (!res.ok) {
            setValue(previous);
            showToast("Couldn't update order status.", "error");
            return;
        }
        showToast(`Order moved to ${newStatus.replaceAll("_", " ")}`, "success");
        router.refresh();
    }
    return (<select value={value} disabled={loading} onChange={(e) => handleChange(e.target.value)} className="rounded-full border border-wood/20 px-3 py-1 text-xs">
      {STATUSES.map((s) => (<option key={s} value={s}>{s.replaceAll("_", " ")}</option>))}
    </select>);
}
