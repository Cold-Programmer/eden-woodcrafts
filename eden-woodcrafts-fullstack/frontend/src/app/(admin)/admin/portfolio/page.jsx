"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetchClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

const emptyForm = { title: "", location: "", description: "", image: "", status: "IN_PROGRESS" };

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function load() {
    const res = await apiFetchClient("/api/admin/projects");
    if (res.ok) setProjects(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p) {
    setForm({ title: p.title, location: p.location, description: p.description, image: p.image, status: p.status });
    setEditingId(p.id);
    setShowForm(true);
  }

  function startNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const res = await apiFetchClient(editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      showToast(data?.error?.formErrors?.[0] || "Couldn't save that project.", "error");
      return;
    }
    showToast(editingId ? "Project updated" : "Project added", "success");
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project? This can't be undone.")) return;
    const res = await apiFetchClient(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Couldn't delete that project.", "error");
      return;
    }
    showToast("Project deleted", "info");
    load();
  }

  if (!projects) {
    return <div className="text-charcoal/60">Loading portfolio...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Portfolio</h1>
        <Button onClick={startNew}>{showForm && !editingId ? "Cancel" : "+ New Project"}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-3 rounded-xl2 border border-wood/10 bg-white p-5">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm" />
          <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm" />
          <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm" />
          <input required placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm">
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Project" : "Add Project"}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No projects yet" description="Add completed or in-progress work to show on the public Portfolio page." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl2 border border-wood/10 bg-white">
              <div className="relative aspect-[4/3] w-full bg-wood/5">
                <Image src={p.image} alt={p.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <Badge tone={p.status === "COMPLETED" ? "success" : "gold"}>{p.status.replace("_", " ")}</Badge>
                </div>
                <h3 className="mt-2 font-serif text-sm font-semibold text-charcoal">{p.title}</h3>
                <p className="text-xs text-charcoal/50">{p.location}</p>
                <div className="mt-3 flex gap-3 text-sm">
                  <button onClick={() => startEdit(p)} className="text-forest hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
