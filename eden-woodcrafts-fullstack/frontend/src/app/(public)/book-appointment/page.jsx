"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetchClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
const SERVICES = [
    { value: "CONSULTATION", label: "Design Consultation" },
    { value: "REPAIR", label: "Furniture Repair" },
    { value: "RESTORATION", label: "Restoration & Refinishing" },
    { value: "DELIVERY_ASSEMBLY", label: "Delivery & Assembly" },
    { value: "WORKSHOP_VISIT", label: "Workshop Visit" }
];
function BookAppointmentForm() {
    const router = useRouter();
    const params = useSearchParams();
    const preselected = params.get("service");
    const [form, setForm] = useState({
        service: SERVICES.some((s) => s.value === preselected) ? preselected : "CONSULTATION",
        preferredDate: "",
        address: "",
        phone: "",
        notes: ""
    });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        setError(null);
        const res = await apiFetchClient("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                preferredDate: new Date(form.preferredDate).toISOString()
            })
        });
        if (res.status === 401) {
            router.push("/login?redirect=/book-appointment");
            return;
        }
        const data = await res.json();
        if (!res.ok) {
            setStatus("error");
            setError(data.error?.formErrors?.[0] || data.error || "Couldn't book that appointment");
            return;
        }
        setStatus("success");
    }
    if (status === "success") {
        return (<div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-forest">Appointment requested!</h1>
        <p className="mt-3 text-charcoal/70">
          We'll confirm the time with you by phone. You can track its status from your dashboard.
        </p>
        <Button onClick={() => router.push("/dashboard/appointments")} className="mt-6">
          View My Appointments
        </Button>
      </div>);
    }
    return (<div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Book an Appointment</h1>
      <p className="mt-2 text-charcoal/70">
        Repairs, restoration, consultations, delivery/assembly, or a workshop visit — pick what
        you need and a preferred time, and we'll confirm by phone.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Service</label>
          <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2">
            {SERVICES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Preferred Date &amp; Time *</label>
          <input required type="datetime-local" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Phone *</label>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XXXXXXXX" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">
            Address {form.service !== "WORKSHOP_VISIT" && "(if this is at your home/office)"}
          </label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Leave blank if visiting the workshop" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="What needs fixing, or what you'd like to discuss" rows={3} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Submitting..." : "Request Appointment"}
        </Button>
      </form>
    </div>);
}
export default function BookAppointmentPage() {
    return (<Suspense>
      <BookAppointmentForm />
    </Suspense>);
}
