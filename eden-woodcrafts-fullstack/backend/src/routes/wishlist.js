"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
exports.wishlistRouter = (0, express_1.Router)();
exports.wishlistRouter.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const items = await prisma_1.prisma.wishlistItem.findMany({
        where: { userId: user.id },
        include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } }, category: true } } }
    });
    res.json(items);
});
exports.wishlistRouter.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const productId = req.body?.productId;
    if (!productId)
        return res.status(400).json({ error: "productId is required" });
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    const item = await prisma_1.prisma.wishlistItem.upsert({
        where: { userId_productId: { userId: user.id, productId } },
        update: {},
        create: { userId: user.id, productId }
    });
    res.status(201).json(item);
});
exports.wishlistRouter.delete("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const productId = req.query.productId;
    if (!productId)
        return res.status(400).json({ error: "productId is required" });
    await prisma_1.prisma.wishlistItem.deleteMany({ where: { userId: user.id, productId } });
    res.json({ success: true });
});
