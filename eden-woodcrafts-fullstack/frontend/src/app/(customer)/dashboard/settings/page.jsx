"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetchClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", photoUrl: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    apiFetchClient("/api/auth/me").then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      if (!data.user) {
        router.push("/login?redirect=/dashboard/settings");
        return;
      }
      setUser(data.user);
      setProfileForm({
        name: data.user.name || "",
        phone: data.user.phone || "",
        photoUrl: data.user.photoUrl || ""
      });
    });
  }, [router]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setSavingProfile(true);
    const res = await apiFetchClient("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm)
    });
    setSavingProfile(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      showToast(data?.error?.formErrors?.[0] || "Couldn't update your profile.", "error");
      return;
    }
    const updated = await res.json();
    setUser(updated);
    showToast("Profile updated", "success");
    router.refresh();
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords don't match.", "error");
      return;
    }
    setSavingPassword(true);
    const res = await apiFetchClient("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    });
    setSavingPassword(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      showToast(data?.error || data?.error?.formErrors?.[0] || "Couldn't change your password.", "error");
      return;
    }
    showToast("Password changed", "success");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }

  if (!user) {
    return <div className="text-charcoal/60">Loading settings...</div>;
  }

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Settings</h1>
        <p className="mt-1 text-sm text-charcoal/60">{user.email} · {user.role}</p>
      </div>

      <section>
        <h2 className="font-serif text-lg font-semibold text-charcoal">Profile</h2>
        <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-wood/10">
              {profileForm.photoUrl ? (
                <Image src={profileForm.photoUrl} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-lg font-semibold text-wood">
                  {user.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-charcoal">Profile Photo URL</label>
              <input
                value={profileForm.photoUrl}
                onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-charcoal/50">
                Paste a hosted image URL — direct file upload isn't wired up yet.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Name</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Phone</label>
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              placeholder="07XXXXXXXX"
              className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Email</label>
            <input value={user.email} disabled className="w-full rounded-lg border border-wood/10 bg-wood/5 px-3 py-2 text-sm text-charcoal/50" />
            <p className="mt-1 text-xs text-charcoal/50">Email changes aren't supported yet — contact support if this needs updating.</p>
          </div>
          <Button type="submit" disabled={savingProfile}>{savingProfile ? "Saving..." : "Save Profile"}</Button>
        </form>
      </section>

      <section className="border-t border-wood/10 pt-8">
        <h2 className="font-serif text-lg font-semibold text-charcoal">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" disabled={savingPassword}>{savingPassword ? "Changing..." : "Change Password"}</Button>
        </form>
      </section>
    </div>
  );
}
