"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
const validation_1 = require("../lib/validation");
const mpesa_1 = require("../lib/mpesa");
exports.paymentsRouter = (0, express_1.Router)();
exports.paymentsRouter.post("/mpesa/initiate", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const parsed = validation_1.stkInitiateSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const order = await prisma_1.prisma.order.findUnique({ where: { id: parsed.data.orderId } });
    if (!order || order.userId !== user.id)
        return res.status(404).json({ error: "Order not found" });
    if (order.status !== "PENDING_PAYMENT")
        return res.status(409).json({ error: "This order is not awaiting payment" });
    const phone = (0, mpesa_1.normalizeKenyanPhone)(parsed.data.phone);
    const payment = await prisma_1.prisma.payment.create({
        data: { orderId: order.id, method: "MPESA", amount: order.total, status: "PENDING", phoneNumber: phone }
    });
    try {
        const stk = await (0, mpesa_1.initiateStkPush)({
            phone,
            amount: Number(order.total),
            accountReference: order.orderNumber,
            transactionDesc: `Eden Woodcrafts order ${order.orderNumber}`
        });
        await prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { checkoutRequestId: stk.CheckoutRequestID } });
        res.json({
            message: "Check your phone and enter your M-Pesa PIN to complete payment.",
            checkoutRequestId: stk.CheckoutRequestID,
            paymentId: payment.id
        });
    }
    catch (err) {
        await prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
        const message = err instanceof Error ? err.message : "Failed to initiate M-Pesa payment";
        console.error("M-Pesa STK push failed:", message);
        res.status(502).json({ error: message });
    }
});
// Public webhook — Safaricom calls this directly, no auth. Always 200 so
// Daraja doesn't retry indefinitely; only mutate state on a valid payload.
exports.paymentsRouter.post("/mpesa/callback", async (req, res) => {
    const payload = req.body;
    if (!payload?.Body?.stkCallback) {
        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }
    const parsed = (0, mpesa_1.parseStkCallback)(payload);
    const payment = await prisma_1.prisma.payment.findFirst({ where: { checkoutRequestId: parsed.checkoutRequestId } });
    if (!payment)
        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    if (parsed.success) {
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.payment.update({
                where: { id: payment.id },
                data: { status: "COMPLETED", mpesaReceipt: parsed.mpesaReceipt, rawCallback: payload }
            }),
            prisma_1.prisma.order.update({ where: { id: payment.orderId }, data: { status: "CONFIRMED" } })
        ]);
    }
    else {
        await prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", rawCallback: payload } });
    }
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});
