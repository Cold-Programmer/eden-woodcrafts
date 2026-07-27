"use client";
import { useEffect, useState } from "react";
import { apiFetchClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
const emptyForm = { label: "", line1: "", line2: "", city: "Nairobi", county: "", phone: "", isDefault: false };
export default function AddressesPage() {
    const [addresses, setAddresses] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();
    async function load() {
        const res = await apiFetchClient("/api/addresses");
        if (res.ok)
            setAddresses(await res.json());
    }
    useEffect(() => {
        load();
    }, []);
    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const res = await apiFetchClient("/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        setSaving(false);
        if (!res.ok) {
            const data = await res.json().catch(() => null);
            showToast(data?.error?.formErrors?.[0] || "Couldn't save that address.", "error");
            return;
        }
        showToast("Address saved", "success");
        setForm(emptyForm);
        setShowForm(false);
        load();
    }
    async function handleDelete(id) {
        await apiFetchClient(`/api/addresses/${id}`, { method: "DELETE" });
        showToast("Address removed", "info");
        load();
    }
    async function handleSetDefault(id) {
        await apiFetchClient(`/api/addresses/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDefault: true })
        });
        load();
    }
    if (!addresses) {
        return <div className="mx-auto max-w-3xl px-4 py-10 text-charcoal/60">Loading addresses...</div>;
    }
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Saved Addresses</h1>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Add Address"}</Button>
      </div>

      {showForm && (<form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-xl2 border border-wood/10 bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Label (e.g. Home)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="rounded-lg border border-wood/20 px-3 py-2 text-sm"/>
            <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-wood/20 px-3 py-2 text-sm"/>
          </div>
          <input required placeholder="Street / building / house number" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"/>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border border-wood/20 px-3 py-2 text-sm"/>
            <input placeholder="County (optional)" value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })} className="rounded-lg border border-wood/20 px-3 py-2 text-sm"/>
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal/70">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}/>
            Set as default address
          </label>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Address"}</Button>
        </form>)}

      {addresses.length === 0 ? (<div className="mt-8">
          <EmptyState title="No saved addresses" description="Add one to speed up checkout next time."/>
        </div>) : (<ul className="mt-8 space-y-3">
          {addresses.map((a) => (<li key={a.id} className="flex items-start justify-between rounded-xl2 border border-wood/10 bg-white p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-charcoal">{a.label}</span>
                  {a.isDefault && <Badge tone="gold">Default</Badge>}
                </div>
                <p className="mt-1 text-sm text-charcoal/70">{a.line1}, {a.city}{a.county ? `, ${a.county}` : ""}</p>
                <p className="text-sm text-charcoal/50">{a.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-2 text-sm">
                {!a.isDefault && (<button onClick={() => handleSetDefault(a.id)} className="text-forest hover:underline">Set as default</button>)}
                <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </li>))}
        </ul>)}
    </div>);
}
