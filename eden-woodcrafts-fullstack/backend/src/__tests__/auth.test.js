"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
jest.mock("../lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn()
        }
    }
}));
const prisma_1 = require("../lib/prisma");
const app_1 = require("../app");
const app = (0, app_1.createApp)();
describe("POST /api/auth/register", () => {
    it("rejects an invalid payload with 400", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({ email: "not-an-email" });
        expect(res.status).toBe(400);
    });
    it("creates a user and sets auth cookies on valid input", async () => {
        prisma_1.prisma.user.findUnique.mockResolvedValue(null);
        prisma_1.prisma.user.create.mockResolvedValue({
            id: "user_1",
            name: "Test User",
            email: "test@example.com",
            role: "CUSTOMER"
        });
        const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe("test@example.com");
        expect(res.headers["set-cookie"]).toBeDefined();
    });
    it("returns 409 when the email is already registered", async () => {
        prisma_1.prisma.user.findUnique.mockResolvedValue({ id: "existing" });
        const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        });
        expect(res.status).toBe(409);
    });
});
describe("POST /api/auth/login", () => {
    it("returns 401 for a non-existent user without leaking which field was wrong", async () => {
        prisma_1.prisma.user.findUnique.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).post("/api/auth/login").send({
            email: "nobody@example.com",
            password: "whatever123"
        });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Invalid email or password");
    });
});
