import { NextResponse } from "next/server";
// Route-level guard. We ask the backend who the user is rather than
// verifying the JWT locally: Next.js middleware runs on the Edge runtime by
// default, which does NOT support Node's `crypto` module — the
// `jsonwebtoken` package silently fails to verify there, which is why
// logins looked broken even though the backend accepted them correctly.
// Asking the backend also removes the need to keep a JWT_SECRET in sync
// across two separate .env files.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const roleProtectedPrefixes = [
    { prefix: "/admin", roles: ["ADMIN"] },
    { prefix: "/staff", roles: ["ADMIN", "STAFF"] },
    { prefix: "/dashboard", roles: ["CUSTOMER", "ADMIN", "STAFF"] }
];
export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const match = roleProtectedPrefixes.find((r) => pathname.startsWith(r.prefix));
    if (!match)
        return NextResponse.next();
    const cookieHeader = req.headers.get("cookie") || "";
    let user = null;
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { cookie: cookieHeader }
        });
        if (res.ok) {
            const data = await res.json();
            user = data.user;
        }
    }
    catch {
        // Backend unreachable — treat as unauthenticated rather than crashing
        // the request.
        user = null;
    }
    if (!user || !match.roles.includes(user.role)) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/admin/:path*", "/staff/:path*", "/dashboard/:path*"]
};
