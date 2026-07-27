"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const validation_1 = require("../lib/validation");
exports.authRouter = (0, express_1.Router)();
// Strict limit ONLY on the brute-force-sensitive endpoints. /me and
// /logout are called on nearly every page load (layout + middleware both
// check auth), so putting them behind this same limiter meant normal
// browsing tripped it and looked like random logouts.
const bruteForceLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, limit: 30 });
exports.authRouter.post("/register", bruteForceLimiter, async (req, res) => {
    const parsed = validation_1.registerSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { name, email, phone, password } = parsed.data;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: "An account with this email already exists" });
    const passwordHash = await (0, auth_1.hashPassword)(password);
    const user = await prisma_1.prisma.user.create({
        data: { name, email, phone: phone || null, passwordHash, role: "CUSTOMER" }
    });
    (0, auth_1.setAuthCookies)(res, { id: user.id, role: user.role, email: user.email });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
exports.authRouter.post("/login", bruteForceLimiter, async (req, res) => {
    const parsed = validation_1.loginSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || !(await (0, auth_1.verifyPassword)(password, user.passwordHash))) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    (0, auth_1.setAuthCookies)(res, { id: user.id, role: user.role, email: user.email });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
exports.authRouter.post("/logout", async (_req, res) => {
    (0, auth_1.clearAuthCookies)(res);
    res.json({ success: true });
});
exports.authRouter.get("/me", async (req, res) => {
    const authUser = (0, auth_1.getCurrentUser)(req);
    if (!authUser)
        return res.json({ user: null });
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: authUser.id },
        select: { id: true, name: true, email: true, role: true, phone: true, photoUrl: true }
    });
    res.json({ user });
});
exports.authRouter.patch("/profile", async (req, res) => {
    const authUser = (0, auth_1.getCurrentUser)(req);
    if (!authUser)
        return res.status(401).json({ error: "Not authenticated" });
    const parsed = validation_1.updateProfileSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { name, phone, photoUrl } = parsed.data;
    const user = await prisma_1.prisma.user.update({
        where: { id: authUser.id },
        data: {
            ...(name !== undefined ? { name } : {}),
            ...(phone !== undefined ? { phone: phone || null } : {}),
            ...(photoUrl !== undefined ? { photoUrl: photoUrl || null } : {})
        },
        select: { id: true, name: true, email: true, role: true, phone: true, photoUrl: true }
    });
    res.json(user);
});
exports.authRouter.post("/change-password", async (req, res) => {
    const authUser = (0, auth_1.getCurrentUser)(req);
    if (!authUser)
        return res.status(401).json({ error: "Not authenticated" });
    const parsed = validation_1.changePasswordSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const user = await prisma_1.prisma.user.findUnique({ where: { id: authUser.id } });
    if (!user)
        return res.status(404).json({ error: "User not found" });
    const valid = await (0, auth_1.verifyPassword)(parsed.data.currentPassword, user.passwordHash);
    if (!valid)
        return res.status(401).json({ error: "Current password is incorrect" });
    const passwordHash = await (0, auth_1.hashPassword)(parsed.data.newPassword);
    await prisma_1.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ success: true });
});
