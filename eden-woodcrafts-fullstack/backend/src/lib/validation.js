"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = exports.projectSchema = exports.appointmentSchema = exports.reviewSchema = exports.addressSchema = exports.customOrderSchema = exports.stkInitiateSchema = exports.productSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is too short").max(100),
    email: zod_1.z.string().email("Enter a valid email"),
    phone: zod_1.z
        .string()
        .regex(/^(?:\+?254|0)7\d{8}$/, "Enter a valid Kenyan phone number")
        .optional()
        .or(zod_1.z.literal("")),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters")
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, "Password is required")
});
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(150),
    slug: zod_1.z.string().min(2).max(150).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers and dashes only"),
    description: zod_1.z.string().min(10),
    material: zod_1.z.string().optional(),
    price: zod_1.z.number().positive(),
    discount: zod_1.z.number().min(0).max(100).optional(),
    stock: zod_1.z.number().int().min(0),
    dimensions: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().min(1, "Select a category"),
    images: zod_1.z.array(zod_1.z.string().url()).default([])
});
exports.stkInitiateSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1),
    phone: zod_1.z.string().regex(/^(?:\+?254|0)7\d{8}$/, "Enter a valid Kenyan phone number")
});
exports.customOrderSchema = zod_1.z.object({
    measurements: zod_1.z.string().min(3),
    material: zod_1.z.string().min(2),
    color: zod_1.z.string().optional(),
    finish: zod_1.z.string().optional(),
    budget: zod_1.z.number().positive().optional(),
    desiredDate: zod_1.z.string().optional(),
    designImages: zod_1.z.array(zod_1.z.string().url()).default([])
});
exports.addressSchema = zod_1.z.object({
    label: zod_1.z.string().min(2).max(50),
    line1: zod_1.z.string().min(3),
    line2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(2),
    county: zod_1.z.string().optional(),
    phone: zod_1.z.string().regex(/^(?:\+?254|0)7\d{8}$/, "Enter a valid Kenyan phone number"),
    isDefault: zod_1.z.boolean().optional()
});
exports.reviewSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1),
    orderId: zod_1.z.string().optional(),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().max(1000).optional(),
    images: zod_1.z.array(zod_1.z.string().url()).default([])
});
exports.appointmentSchema = zod_1.z.object({
    service: zod_1.z.enum(["CONSULTATION", "REPAIR", "RESTORATION", "DELIVERY_ASSEMBLY", "WORKSHOP_VISIT"]),
    preferredDate: zod_1.z.string().min(1, "Choose a date and time"),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().regex(/^(?:\+?254|0)7\d{8}$/, "Enter a valid Kenyan phone number"),
    notes: zod_1.z.string().max(1000).optional()
});
exports.projectSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(150),
    location: zod_1.z.string().min(2).max(150),
    description: zod_1.z.string().min(10),
    image: zod_1.z.string().url(),
    status: zod_1.z.enum(["IN_PROGRESS", "COMPLETED"]).default("IN_PROGRESS"),
    position: zod_1.z.number().int().default(0)
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    phone: zod_1.z
        .string()
        .regex(/^(?:\+?254|0)7\d{8}$/, "Enter a valid Kenyan phone number")
        .optional()
        .or(zod_1.z.literal("")),
    photoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal(""))
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Enter your current password"),
    newPassword: zod_1.z.string().min(8, "New password must be at least 8 characters")
});
