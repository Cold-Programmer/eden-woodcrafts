"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.productsRouter = (0, express_1.Router)();
exports.productsRouter.get("/", async (req, res) => {
    const q = req.query.q;
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sort = req.query.sort || "newest";
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const pageSize = 12;
    const where = { isActive: true };
    if (q) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } }
        ];
    }
    if (category)
        where.category = { slug: category };
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice)
            where.price.gte = parseFloat(minPrice);
        if (maxPrice)
            where.price.lte = parseFloat(maxPrice);
    }
    const orderBy = sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" } : { createdAt: "desc" };
    const [items, total] = await Promise.all([
        prisma_1.prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true }
        }),
        prisma_1.prisma.product.count({ where })
    ]);
    res.json({ items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
});
exports.productsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const product = await prisma_1.prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }], isActive: true },
        include: {
            images: { orderBy: { position: "asc" } },
            category: true,
            reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } }
        }
    });
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    res.json(product);
});
