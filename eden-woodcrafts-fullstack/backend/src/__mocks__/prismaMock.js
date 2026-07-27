"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
// A lightweight in-memory-ish mock of the Prisma client used across route
// tests. Each test file resets/overrides the specific methods it needs via
// jest.mock("../lib/prisma", ...) — this file just provides the shared shape
// so TypeScript knows what's mockable.
exports.prismaMock = {
    user: { findUnique: jest.fn(), create: jest.fn(), count: jest.fn() },
    product: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
    category: { findMany: jest.fn() },
    order: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
    cartItem: { findMany: jest.fn(), upsert: jest.fn(), updateMany: jest.fn(), deleteMany: jest.fn() },
    address: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
    wishlistItem: { findMany: jest.fn(), upsert: jest.fn(), deleteMany: jest.fn() },
    review: { findFirst: jest.fn(), create: jest.fn() },
    $transaction: jest.fn()
};
