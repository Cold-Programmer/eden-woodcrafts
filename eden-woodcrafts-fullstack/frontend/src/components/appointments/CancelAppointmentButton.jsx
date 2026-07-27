"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";
export function CancelAppointmentButton({ id }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();
    async function handleCancel() {
        if (!confirm("Cancel this appointment request?"))
            return;
        setLoading(true);
        const res = await apiFetchClient(`/api/appointments/${id}`, { method: "DELETE" });
        setLoading(false);
        if (!res.ok) {
            showToast("Couldn't cancel that appointment.", "error");
            return;
        }
        showToast("Appointment cancelled", "info");
        router.refresh();
    }
    return (<button onClick={handleCancel} disabled={loading} className="text-sm text-red-600 hover:underline disabled:opacity-50">
      Cancel
    </button>);
}
