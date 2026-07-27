"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
export default function CustomOrderPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        measurements: "",
        material: "",
        color: "",
        finish: "",
        budget: "",
        desiredDate: ""
    });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        setError(null);
        const res = await apiFetchClient("/api/custom-orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                budget: form.budget ? Number(form.budget) : undefined,
                designImages: []
            })
        });
        if (res.status === 401) {
            router.push("/login?redirect=/custom-order");
            return;
        }
        const data = await res.json();
        if (!res.ok) {
            setStatus("error");
            setError(data.error?.formErrors?.[0] || "Could not submit request");
            return;
        }
        setStatus("success");
    }
    if (status === "success") {
        return (<div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-forest">Request received!</h1>
        <p className="mt-3 text-charcoal/70">
          Our team will review your measurements and send a quotation to your dashboard for approval.
        </p>
        <Button onClick={() => router.push("/dashboard")} className="mt-6">Go to Dashboard</Button>
      </div>);
    }
    return (<div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Request Custom Furniture</h1>
      <p className="mt-2 text-charcoal/70">
        Tell us what you have in mind — dimensions, material, color and finish. We'll follow up with
        a quotation before any production begins.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Measurements *</label>
          <textarea required value={form.measurements} onChange={(e) => setForm({ ...form, measurements: e.target.value })} placeholder="e.g. Bed frame 6x6ft, headboard 4ft high" className="w-full rounded-lg border border-wood/20 px-4 py-2" rows={3}/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Preferred Material *</label>
          <input required value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="e.g. Mahogany, Mvule, Pine" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Color</label>
            <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Finish</label>
            <input value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} placeholder="Matte, glossy..." className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Budget (KSh)</label>
            <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Desired Date</label>
            <input type="date" value={form.desiredDate} onChange={(e) => setForm({ ...form, desiredDate: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
          </div>
        </div>
        <p className="text-xs text-charcoal/50">
          Image/sketch/PDF upload is not wired up in this MVP yet — mention reference details in
          the measurements field and our team will follow up directly.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>);
}
