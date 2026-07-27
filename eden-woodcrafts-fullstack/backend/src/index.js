"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 4000;
const app = (0, app_1.createApp)();
function checkMpesaConfig() {
    const missing = [
        !process.env.MPESA_CONSUMER_KEY && "MPESA_CONSUMER_KEY",
        !process.env.MPESA_CONSUMER_SECRET && "MPESA_CONSUMER_SECRET",
        !process.env.MPESA_PASSKEY && "MPESA_PASSKEY",
        !process.env.MPESA_SHORTCODE && "MPESA_SHORTCODE",
        !process.env.MPESA_CALLBACK_URL && "MPESA_CALLBACK_URL"
    ].filter(Boolean);
    if (missing.length > 0) {
        console.warn(`\n⚠️  M-Pesa is NOT configured — missing: ${missing.join(", ")}\n` +
            `   Checkout will accept COD but M-Pesa STK Push will fail with a 502.\n` +
            `   Fix: cp .env.example .env, fill in your Consumer Key/Secret, and see\n` +
            `   MPESA_SETUP.md for the callback URL (ngrok) step.\n`);
    }
    else if (process.env.MPESA_CALLBACK_URL?.includes("your-domain-or-ngrok")) {
        console.warn(`\n⚠️  MPESA_CALLBACK_URL is still the placeholder value.\n` +
            `   STK Push will send the prompt, but payment confirmation will never\n` +
            `   arrive back. See MPESA_SETUP.md to point it at a real ngrok URL.\n`);
    }
    else {
        console.log("✔ M-Pesa env vars look configured.");
    }
}
checkMpesaConfig();
app.listen(PORT, () => {
    console.log(`Eden Woodcrafts API listening on http://localhost:${PORT}`);
});
