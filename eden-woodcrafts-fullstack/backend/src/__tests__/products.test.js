"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
jest.mock("../lib/prisma", () => ({
    prisma: {
        product: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn() }
    }
}));
const prisma_1 = require("../lib/prisma");
const app_1 = require("../app");
const app = (0, app_1.createApp)();
describe("GET /api/products", () => {
    it("returns a paginated list shape", async () => {
        prisma_1.prisma.product.findMany.mockResolvedValue([{ id: "p1", name: "Oak Table" }]);
        prisma_1.prisma.product.count.mockResolvedValue(1);
        const res = await (0, supertest_1.default)(app).get("/api/products");
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ items: [{ id: "p1", name: "Oak Table" }], total: 1, page: 1 });
    });
});
describe("GET /api/products/:id", () => {
    it("returns 404 for a product that doesn't exist", async () => {
        prisma_1.prisma.product.findFirst.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/products/does-not-exist");
        expect(res.status).toBe(404);
    });
});
