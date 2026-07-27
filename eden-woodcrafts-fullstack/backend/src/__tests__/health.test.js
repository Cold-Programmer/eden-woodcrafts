"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
jest.mock("../lib/prisma", () => ({ prisma: {} }));
const app_1 = require("../app");
describe("GET /health", () => {
    it("returns status ok", async () => {
        const app = (0, app_1.createApp)();
        const res = await (0, supertest_1.default)(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
    });
});
