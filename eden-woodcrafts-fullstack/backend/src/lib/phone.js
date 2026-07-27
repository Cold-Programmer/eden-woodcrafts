"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeKenyanPhone = normalizeKenyanPhone;
exports.isValidKenyanPhone = isValidKenyanPhone;
// Kenyan phone number normalization for M-Pesa. Daraja requires the
// 2547XXXXXXXX format regardless of how the customer typed it in
// (07XXXXXXXX, +254..., 254..., or just 7XXXXXXXX).
function normalizeKenyanPhone(raw) {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("254"))
        return digits;
    if (digits.startsWith("0"))
        return `254${digits.slice(1)}`;
    if (digits.startsWith("7") || digits.startsWith("1"))
        return `254${digits}`;
    return digits;
}
function isValidKenyanPhone(raw) {
    return /^(?:\+?254|0)7\d{8}$/.test(raw);
}
