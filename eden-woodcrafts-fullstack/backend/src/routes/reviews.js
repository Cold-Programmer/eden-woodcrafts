"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
const validation_1 = require("../lib/validation");
exports.reviewsRouter = (0, express_1.Router)();
exports.reviewsRouter.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const parsed = validation_1.reviewSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { productId, orderId, rating, comment, images } = parsed.data;
    // Require a delivered order containing this product before allowing a
    // review — prevents drive-by reviews on products never purchased.
    const eligibleOrder = await prisma_1.prisma.order.findFirst({
        where: {
            userId: user.id,
            status: "DELIVERED",
            ...(orderId ? { id: orderId } : {}),
            items: { some: { productId } }
        }
    });
    if (!eligibleOrder) {
        return res.status(403).json({ error: "You can only review products from a delivered order" });
    }
    const existing = await prisma_1.prisma.review.findFirst({ where: { userId: user.id, productId, orderId: eligibleOrder.id } });
    if (existing)
        return res.status(409).json({ error: "You've already reviewed this product for this order" });
    const review = await prisma_1.prisma.review.create({
        data: { userId: user.id, productId, orderId: eligibleOrder.id, rating, comment, images }
    });
    res.status(201).json(review);
});
