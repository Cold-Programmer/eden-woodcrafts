"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
const validation_1 = require("../lib/validation");
exports.adminRouter = (0, express_1.Router)();
const VALID_STATUSES = [
    "PENDING_PAYMENT", "CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK",
    "PACKAGING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"
];
exports.adminRouter.get("/stats", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN"]), async (_req, res) => {
    const [productCount, orderCount, customerCount, pendingOrders, revenueAgg] = await Promise.all([
        prisma_1.prisma.product.count({ where: { isActive: true } }),
        prisma_1.prisma.order.count(),
        prisma_1.prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma_1.prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
        prisma_1.prisma.order.aggregate({ _sum: { total: true }, where: { status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] } } })
    ]);
    res.json({
        productCount,
        orderCount,
        customerCount,
        pendingOrders,
        revenue: Number(revenueAgg._sum.total || 0)
    });
});
// Products
exports.adminRouter.get("/products", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const pageSize = 20;
    const [items, total] = await Promise.all([
        prisma_1.prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { category: true, images: { take: 1 } }
        }),
        prisma_1.prisma.product.count()
    ]);
    res.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
});
exports.adminRouter.post("/products", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const parsed = validation_1.productSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const existingSlug = await prisma_1.prisma.product.findUnique({ where: { slug: parsed.data.slug } });
    if (existingSlug)
        return res.status(409).json({ error: "A product with this slug already exists" });
    const { images, ...data } = parsed.data;
    const product = await prisma_1.prisma.product.create({
        data: { ...data, images: { create: images.map((url, position) => ({ url, position })) } },
        include: { images: true, category: true }
    });
    res.status(201).json(product);
});
exports.adminRouter.patch("/products/:id", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const parsed = validation_1.productSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const existing = await prisma_1.prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing)
        return res.status(404).json({ error: "Product not found" });
    const { images, ...data } = parsed.data;
    const product = await prisma_1.prisma.product.update({
        where: { id: req.params.id },
        data: {
            ...data,
            ...(images ? { images: { deleteMany: {}, create: images.map((url, position) => ({ url, position })) } } : {})
        },
        include: { images: true, category: true }
    });
    res.json(product);
});
exports.adminRouter.delete("/products/:id", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN"]), async (req, res) => {
    const existing = await prisma_1.prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing)
        return res.status(404).json({ error: "Product not found" });
    await prisma_1.prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true });
});
// Orders
exports.adminRouter.get("/orders", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const status = req.query.status;
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const pageSize = 20;
    const where = status ? { status: status } : {};
    const [items, total] = await Promise.all([
        prisma_1.prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { user: { select: { name: true, email: true } }, items: true, payments: true }
        }),
        prisma_1.prisma.order.count({ where })
    ]);
    res.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
});
exports.adminRouter.patch("/orders/:id", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const status = req.body?.status;
    if (!status || !VALID_STATUSES.includes(status))
        return res.status(400).json({ error: "Invalid status" });
    const existing = await prisma_1.prisma.order.findUnique({ where: { id: req.params.id } });
    if (!existing)
        return res.status(404).json({ error: "Order not found" });
    const order = await prisma_1.prisma.order.update({ where: { id: req.params.id }, data: { status: status } });
    res.json(order);
});
// Appointments — staff manage these directly (this is core workshop-ops
// work: consultations, repairs, delivery/assembly, workshop visits).
const VALID_APPOINTMENT_STATUSES = ["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"];
exports.adminRouter.get("/appointments", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const status = req.query.status;
    const where = status ? { status: status } : {};
    const appointments = await prisma_1.prisma.appointment.findMany({
        where,
        orderBy: { preferredDate: "asc" },
        include: { user: { select: { name: true, email: true, phone: true } } }
    });
    res.json(appointments);
});
exports.adminRouter.patch("/appointments/:id", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const status = req.body?.status;
    const staffNotes = req.body?.staffNotes;
    if (status && !VALID_APPOINTMENT_STATUSES.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }
    const existing = await prisma_1.prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!existing)
        return res.status(404).json({ error: "Appointment not found" });
    const appointment = await prisma_1.prisma.appointment.update({
        where: { id: req.params.id },
        data: { ...(status ? { status: status } : {}), ...(staffNotes !== undefined ? { staffNotes } : {}) }
    });
    res.json(appointment);
});
// Portfolio projects — ADMIN has full CRUD. STAFF can only update the
// status (marking a project's progress), since they're the ones doing
// the actual work — not create/delete, which stays a content-management
// decision for ADMIN.
exports.adminRouter.get("/projects", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (_req, res) => {
    const projects = await prisma_1.prisma.project.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });
    res.json(projects);
});
exports.adminRouter.post("/projects", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN"]), async (req, res) => {
    const parsed = validation_1.projectSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const project = await prisma_1.prisma.project.create({ data: parsed.data });
    res.status(201).json(project);
});
exports.adminRouter.patch("/projects/:id", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN", "STAFF"]), async (req, res) => {
    const existing = await prisma_1.prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existing)
        return res.status(404).json({ error: "Project not found" });
    const isStaffOnly = req.user.role === "STAFF";
    if (isStaffOnly) {
        // Staff can only touch status — reject any attempt to change content.
        const status = req.body?.status;
        if (!status || !["IN_PROGRESS", "COMPLETED"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const project = await prisma_1.prisma.project.update({ where: { id: req.params.id }, data: { status: status } });
        return res.json(project);
    }
    const parsed = validation_1.projectSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const project = await prisma_1.prisma.project.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(project);
});
exports.adminRouter.delete("/projects/:id", (0, requireAuth_1.requireRoleMiddleware)(["ADMIN"]), async (req, res) => {
    const existing = await prisma_1.prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existing)
        return res.status(404).json({ error: "Project not found" });
    await prisma_1.prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});
