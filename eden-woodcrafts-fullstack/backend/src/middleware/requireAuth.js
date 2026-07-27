"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRoleMiddleware = requireRoleMiddleware;
const auth_1 = require("../lib/auth");
function requireAuth(req, res, next) {
    const user = (0, auth_1.getCurrentUser)(req);
    if (!user)
        return res.status(401).json({ error: "Not authenticated" });
    req.user = user;
    next();
}
function requireRoleMiddleware(roles) {
    return (req, res, next) => {
        const user = (0, auth_1.getCurrentUser)(req);
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user;
        next();
    };
}
