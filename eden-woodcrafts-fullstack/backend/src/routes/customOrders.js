"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customOrdersRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
const validation_1 = require("../lib/validation");
exports.customOrdersRouter = (0, express_1.Router)();
exports.customOrdersRouter.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const parsed = validation_1.customOrderSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { desiredDate, ...rest } = parsed.data;
    const request = await prisma_1.prisma.customOrderRequest.create({
        data: { ...rest, userId: user.id, desiredDate: desiredDate ? new Date(desiredDate) : null }
    });
    res.status(201).json(request);
});
exports.customOrdersRouter.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const requests = await prisma_1.prisma.customOrderRequest.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    res.json(requests);
});
