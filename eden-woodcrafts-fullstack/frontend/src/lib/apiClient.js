"use client";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// Client-side fetch helper for use in "use client" components. Always
// includes credentials so the backend's httpOnly auth cookies are sent —
// works across localhost ports because they're the same "site".
export function apiFetchClient(path, init = {}) {
    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: "include",
        headers: { ...(init.headers || {}) }
    });
}
