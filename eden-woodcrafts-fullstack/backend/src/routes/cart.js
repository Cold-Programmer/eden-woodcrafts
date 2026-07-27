"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
exports.cartRouter = (0, express_1.Router)();
exports.cartRouter.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const items = await prisma_1.prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } } }
    });
    res.json(items);
});
exports.cartRouter.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const productId = req.body?.productId;
    const quantity = Math.max(1, Number(req.body?.quantity) || 1);
    if (!productId)
        return res.status(400).json({ error: "productId is required" });
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive)
        return res.status(404).json({ error: "Product not available" });
    const item = await prisma_1.prisma.cartItem.upsert({
        where: { userId_productId: { userId: user.id, productId } },
        update: { quantity: { increment: quantity } },
        create: { userId: user.id, productId, quantity }
    });
    res.status(201).json(item);
});
exports.cartRouter.patch("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const productId = req.body?.productId;
    const quantity = Number(req.body?.quantity);
    if (!productId || !Number.isFinite(quantity) || quantity < 1) {
        return res.status(400).json({ error: "Invalid productId or quantity" });
    }
    const result = await prisma_1.prisma.cartItem.updateMany({
        where: { userId: user.id, productId },
        data: { quantity }
    });
    if (result.count === 0)
        return res.status(404).json({ error: "Cart item not found" });
    res.json({ success: true });
});
exports.cartRouter.delete("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const productId = req.query.productId;
    if (!productId)
        return res.status(400).json({ error: "productId is required" });
    await prisma_1.prisma.cartItem.deleteMany({ where: { userId: user.id, productId } });
    res.json({ success: true });
});
