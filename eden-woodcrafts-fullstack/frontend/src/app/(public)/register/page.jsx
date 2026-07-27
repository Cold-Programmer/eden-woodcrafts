"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const res = await apiFetchClient("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(data.error?.formErrors?.[0] || data.error || "Registration failed");
            return;
        }
        router.push("/dashboard");
        router.refresh();
    }
    return (<div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-serif text-2xl font-bold text-charcoal">Create an account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Full name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Phone (optional)</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XXXXXXXX" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Password</label>
          <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-charcoal/60">
        Already have an account? <Link href="/login" className="text-forest underline">Log in</Link>
      </p>
    </div>);
}
