"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.categoriesRouter = (0, express_1.Router)();
exports.categoriesRouter.get("/", async (_req, res) => {
    const categories = await prisma_1.prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } }
    });
    res.json(categories);
});
