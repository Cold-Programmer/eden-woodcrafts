"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.setAuthCookies = setAuthCookies;
exports.clearAuthCookies = clearAuthCookies;
exports.getCurrentUser = getCurrentUser;
exports.requireRole = requireRole;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("./prisma");
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";
const isProd = process.env.NODE_ENV === "production";
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function signAccessToken(user) {
    return jsonwebtoken_1.default.sign(user, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}
function signRefreshToken(user) {
    return jsonwebtoken_1.default.sign(user, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
    }
    catch {
        return null;
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
    }
    catch {
        return null;
    }
}
// SameSite=lax works across localhost:3000 <-> localhost:4000 because the
// browser treats different ports on localhost as the same "site" — only the
// scheme+registrable-domain matter for SameSite, not the port.
function setAuthCookies(res, user) {
    const access = signAccessToken(user);
    const refresh = signRefreshToken(user);
    res.cookie("access_token", access, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 15
    });
    res.cookie("refresh_token", refresh, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
}
function clearAuthCookies(res) {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
}
function getCurrentUser(req) {
    const token = req.cookies?.access_token;
    if (!token)
        return null;
    return verifyAccessToken(token);
}
async function requireRole(req, roles) {
    const user = getCurrentUser(req);
    if (!user || !roles.includes(user.role))
        return null;
    const dbUser = await prisma_1.prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser)
        return null;
    return user;
}
