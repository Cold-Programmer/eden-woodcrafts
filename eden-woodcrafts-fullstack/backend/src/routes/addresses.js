"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
const validation_1 = require("../lib/validation");
exports.addressesRouter = (0, express_1.Router)();
exports.addressesRouter.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const addresses = await prisma_1.prisma.address.findMany({
        where: { userId: user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    });
    res.json(addresses);
});
exports.addressesRouter.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const parsed = validation_1.addressSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    if (parsed.data.isDefault) {
        await prisma_1.prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }
    const address = await prisma_1.prisma.address.create({ data: { ...parsed.data, userId: user.id } });
    res.status(201).json(address);
});
exports.addressesRouter.patch("/:id", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const existing = await prisma_1.prisma.address.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== user.id)
        return res.status(404).json({ error: "Address not found" });
    const parsed = validation_1.addressSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    if (parsed.data.isDefault) {
        await prisma_1.prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }
    const address = await prisma_1.prisma.address.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(address);
});
exports.addressesRouter.delete("/:id", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const existing = await prisma_1.prisma.address.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== user.id)
        return res.status(404).json({ error: "Address not found" });
    await prisma_1.prisma.address.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});
