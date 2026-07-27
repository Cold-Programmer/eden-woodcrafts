"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const requireAuth_1 = require("../middleware/requireAuth");
const validation_1 = require("../lib/validation");
exports.appointmentsRouter = (0, express_1.Router)();
exports.appointmentsRouter.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const parsed = validation_1.appointmentSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const preferredDate = new Date(parsed.data.preferredDate);
    if (Number.isNaN(preferredDate.getTime())) {
        return res.status(400).json({ error: "Invalid date" });
    }
    if (preferredDate.getTime() < Date.now()) {
        return res.status(400).json({ error: "Choose a date in the future" });
    }
    const appointment = await prisma_1.prisma.appointment.create({
        data: { ...parsed.data, preferredDate, userId: user.id }
    });
    res.status(201).json(appointment);
});
exports.appointmentsRouter.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const appointments = await prisma_1.prisma.appointment.findMany({
        where: { userId: user.id },
        orderBy: { preferredDate: "desc" }
    });
    res.json(appointments);
});
exports.appointmentsRouter.delete("/:id", requireAuth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const existing = await prisma_1.prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== user.id)
        return res.status(404).json({ error: "Appointment not found" });
    if (existing.status !== "REQUESTED") {
        return res.status(409).json({ error: "Only pending requests can be cancelled here — contact us to change a confirmed booking." });
    }
    await prisma_1.prisma.appointment.update({ where: { id: req.params.id }, data: { status: "CANCELLED" } });
    res.json({ success: true });
});
