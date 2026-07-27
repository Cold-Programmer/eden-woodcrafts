"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = require("./routes/auth");
const products_1 = require("./routes/products");
const categories_1 = require("./routes/categories");
const cart_1 = require("./routes/cart");
const orders_1 = require("./routes/orders");
const payments_1 = require("./routes/payments");
const customOrders_1 = require("./routes/customOrders");
const admin_1 = require("./routes/admin");
const wishlist_1 = require("./routes/wishlist");
const addresses_1 = require("./routes/addresses");
const reviews_1 = require("./routes/reviews");
const appointments_1 = require("./routes/appointments");
const projects_1 = require("./routes/projects");
// Supports a comma-separated list so both localhost (PC browser) and your
// LAN IP (phone/tablet on the same WiFi) can both pass CORS at once.
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin(origin, callback) {
            // Allow no-origin requests (curl, server-to-server) and anything
            // in the allowlist.
            if (!origin || FRONTEND_ORIGINS.includes(origin))
                return callback(null, true);
            callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    if (process.env.NODE_ENV !== "test") {
        app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
    }
    const generalLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, limit: 600 });
    app.use(generalLimiter);
    app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
    app.use("/api/auth", auth_1.authRouter);
    app.use("/api/products", products_1.productsRouter);
    app.use("/api/categories", categories_1.categoriesRouter);
    app.use("/api/cart", cart_1.cartRouter);
    app.use("/api/orders", orders_1.ordersRouter);
    app.use("/api/payments", payments_1.paymentsRouter);
    app.use("/api/custom-orders", customOrders_1.customOrdersRouter);
    app.use("/api/wishlist", wishlist_1.wishlistRouter);
    app.use("/api/addresses", addresses_1.addressesRouter);
    app.use("/api/reviews", reviews_1.reviewsRouter);
    app.use("/api/appointments", appointments_1.appointmentsRouter);
    app.use("/api/projects", projects_1.projectsRouter);
    app.use("/api/admin", admin_1.adminRouter);
    app.use((req, res) => {
        res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
    });
    app.use((err, _req, res, _next) => {
        console.error(err);
        res.status(err.status || 500).json({ error: err.publicMessage || "Internal server error" });
    });
    return app;
}
