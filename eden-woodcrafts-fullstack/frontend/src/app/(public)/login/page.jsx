"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get("redirect") || "/";
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const res = await apiFetchClient("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(data.error || "Login failed");
            return;
        }
        router.push(redirect);
        router.refresh();
    }
    return (<div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-serif text-2xl font-bold text-charcoal">Log in</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-charcoal/60">
        No account? <Link href="/register" className="text-forest underline">Sign up</Link>
      </p>
    </div>);
}
export default function LoginPage() {
    return (<Suspense>
      <LoginForm />
    </Suspense>);
}
