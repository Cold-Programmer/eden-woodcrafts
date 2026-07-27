"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";
const STATUSES = ["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"];
export function AppointmentStatusSelect({ id, status }) {
    const [value, setValue] = useState(status);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();
    async function handleChange(newStatus) {
        const previous = value;
        setValue(newStatus);
        setLoading(true);
        const res = await apiFetchClient(`/api/admin/appointments/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        setLoading(false);
        if (!res.ok) {
            setValue(previous);
            showToast("Couldn't update appointment status.", "error");
            return;
        }
        showToast(`Marked ${newStatus.toLowerCase()}`, "success");
        router.refresh();
    }
    return (<select value={value} disabled={loading} onChange={(e) => handleChange(e.target.value)} className="rounded-full border border-wood/20 px-3 py-1 text-xs">
      {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
    </select>);
}
