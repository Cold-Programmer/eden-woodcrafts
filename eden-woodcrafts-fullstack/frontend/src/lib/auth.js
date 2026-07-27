// Frontend-side "who is logged in" helper for use in Server Components
// (layouts, pages). Delegates to the backend's /api/auth/me rather than
// verifying the JWT locally — see middleware.ts for why (Edge runtime +
// jsonwebtoken don't mix, and this also avoids needing a shared secret
// between the two .env files).
import { apiFetchServer } from "./api";
export async function getCurrentUser() {
    try {
        const res = await apiFetchServer("/api/auth/me");
        if (!res.ok)
            return null;
        const data = await res.json();
        return data.user;
    }
    catch {
        return null;
    }
}
