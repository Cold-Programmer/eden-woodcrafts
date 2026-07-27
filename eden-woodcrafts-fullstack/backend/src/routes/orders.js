"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
exports.ordersRouter = (0, express_1.Router)();
function generateOrderNumber() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `EW-${Date.now().toString().slice(-6)}${rand}`;
}
exports.ordersRouter.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const addressId = req.body?.addressId;
    const notes = req.body?.notes;
    const cartItems = await prisma_1.prisma.cartItem.findMany({ where: { userId: user.id }, include: { product: true } });
    if (cartItems.length === 0)
        return res.status(400).json({ error: "Your cart is empty" });
    for (const item of cartItems) {
        if (item.quantity > item.product.stock) {
            return res.status(409).json({ error: `Not enough stock for ${item.product.name}` });
        }
    }
    const subtotal = cartItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
    const deliveryFee = subtotal > 20000 ? 0 : 1000;
    const total = subtotal + deliveryFee;
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: user.id,
                addressId: addressId || null,
                subtotal,
                deliveryFee,
                total,
                notes,
                items: {
                    create: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.product.price }))
                }
            },
            include: { items: true }
        });
        for (const item of cartItems) {
            await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
        }
        await tx.cartItem.deleteMany({ where: { userId: user.id } });
        return created;
    });
    res.status(201).json(order);
});
exports.ordersRouter.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const orders = await prisma_1.prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } }, payments: true }
    });
    res.json(orders);
});
exports.ordersRouter.get("/:id", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: req.params.id },
        include: { items: { include: { product: true } }, payments: true, address: true }
    });
    if (!order)
        return res.status(404).json({ error: "Order not found" });
    if (order.userId !== user.id && user.role === "CUSTOMER")
        return res.status(403).json({ error: "Forbidden" });
    res.json(order);
});
