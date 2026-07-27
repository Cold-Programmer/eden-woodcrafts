"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
export function ProductForm({ categories, initial, productId, redirectTo = "/admin/products" }) {
    const router = useRouter();
    const [form, setForm] = useState({
        name: initial?.name || "",
        slug: initial?.slug || "",
        description: initial?.description || "",
        material: initial?.material || "",
        price: initial?.price || "",
        discount: initial?.discount || "0",
        stock: initial?.stock || "0",
        dimensions: initial?.dimensions || "",
        categoryId: initial?.categoryId || categories[0]?.id || "",
        imageUrl: initial?.imageUrl || ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const payload = {
            name: form.name,
            slug: form.slug,
            description: form.description,
            material: form.material || undefined,
            price: Number(form.price),
            discount: Number(form.discount || 0),
            stock: Number(form.stock),
            dimensions: form.dimensions || undefined,
            categoryId: form.categoryId,
            images: form.imageUrl ? [form.imageUrl] : []
        };
        const res = await apiFetchClient(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
            method: productId ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(JSON.stringify(data.error));
            return;
        }
        router.push(redirectTo);
        router.refresh();
    }
    return (<form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Slug (URL-friendly)</label>
        <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="oak-dining-table" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Description</label>
        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Price (KSh)</label>
          <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Discount (%)</label>
          <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Stock</label>
          <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Material</label>
          <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Dimensions</label>
        <input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder='e.g. 180cm x 90cm x 75cm' className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Category</label>
        <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Image URL</label>
        <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://res.cloudinary.com/..." className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
        <p className="mt-1 text-xs text-charcoal/50">
          Direct Cloudinary upload widget isn't wired up in this MVP — paste an already-hosted image URL for now.
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Product"}</Button>
    </form>);
}
