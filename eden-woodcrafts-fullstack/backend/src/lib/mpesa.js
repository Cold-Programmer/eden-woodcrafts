"use strict";
// M-Pesa Daraja API integration (STK Push / Lipa Na M-Pesa Online)
// Sandbox base URL — swap to api.safaricom.co.ke for production.
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeKenyanPhone = void 0;
exports.getMpesaToken = getMpesaToken;
exports.initiateStkPush = initiateStkPush;
exports.parseStkCallback = parseStkCallback;
const BASE_URL = process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
let cachedToken = null;
async function getMpesaToken() {
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
        return cachedToken.token;
    }
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    if (!key || !secret) {
        throw new Error("MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET are not set");
    }
    const credentials = Buffer.from(`${key}:${secret}`).toString("base64");
    const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${credentials}` }
    });
    if (!res.ok) {
        throw new Error(`Failed to get M-Pesa token: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json());
    cachedToken = {
        token: data.access_token,
        // refresh a minute early
        expiresAt: Date.now() + (parseInt(data.expires_in, 10) - 60) * 1000
    };
    return cachedToken.token;
}
function timestampNow() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return (d.getFullYear().toString() +
        pad(d.getMonth() + 1) +
        pad(d.getDate()) +
        pad(d.getHours()) +
        pad(d.getMinutes()) +
        pad(d.getSeconds()));
}
async function initiateStkPush(input) {
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    if (!shortcode || !passkey || !callbackUrl) {
        const missing = [
            !shortcode && "MPESA_SHORTCODE",
            !passkey && "MPESA_PASSKEY",
            !callbackUrl && "MPESA_CALLBACK_URL"
        ].filter(Boolean);
        throw new Error(`Missing required env var(s): ${missing.join(", ")}. Check backend/.env.`);
    }
    const token = await getMpesaToken();
    const timestamp = timestampNow();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const body = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(input.amount),
        PartyA: input.phone,
        PartyB: shortcode,
        PhoneNumber: input.phone,
        CallBackURL: callbackUrl,
        AccountReference: input.accountReference,
        TransactionDesc: input.transactionDesc
    };
    const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(`STK push failed: ${JSON.stringify(data)}`);
    }
    return data;
}
var phone_1 = require("./phone");
Object.defineProperty(exports, "normalizeKenyanPhone", { enumerable: true, get: function () { return phone_1.normalizeKenyanPhone; } });
function parseStkCallback(payload) {
    const cb = payload.Body.stkCallback;
    const items = cb.CallbackMetadata?.Item ?? [];
    const get = (name) => items.find((i) => i.Name === name)?.Value;
    return {
        checkoutRequestId: cb.CheckoutRequestID,
        success: cb.ResultCode === 0,
        resultDesc: cb.ResultDesc,
        amount: get("Amount"),
        mpesaReceipt: get("MpesaReceiptNumber"),
        phoneNumber: get("PhoneNumber")?.toString(),
        transactionDate: get("TransactionDate")?.toString()
    };
}
