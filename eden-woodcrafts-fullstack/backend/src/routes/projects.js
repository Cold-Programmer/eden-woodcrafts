"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.projectsRouter = (0, express_1.Router)();
// Public — portfolio page listing
exports.projectsRouter.get("/", async (_req, res) => {
    const projects = await prisma_1.prisma.project.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });
    res.json(projects);
});
