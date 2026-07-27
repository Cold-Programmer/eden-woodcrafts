import { cookies } from "next/headers";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// Server-side fetch helper — forwards the incoming request's auth cookies
// to the backend so SSR pages can load user-scoped data (orders, admin
// stats, etc). Browser fetches from client components use apiFetchClient
// instead, which relies on the browser sending cookies automatically.
export async function apiFetchServer(path, init = {}) {
    const store = await cookies();
    const cookieHeader = store.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: { ...(init.headers || {}), cookie: cookieHeader },
        cache: "no-store"
    });
}
