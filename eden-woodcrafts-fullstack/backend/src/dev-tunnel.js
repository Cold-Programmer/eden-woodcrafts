"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Dev convenience: auto-configures ngrok's authtoken (from NGROK_AUTHTOKEN
// in .env), starts a tunnel on your static domain (NGROK_STATIC_DOMAIN),
// reads the public URL, sets MPESA_CALLBACK_URL, and starts the server —
// all in one command, zero manual ngrok commands needed.
//
// Deliberately shells out to the ngrok CLI rather than depending on the
// `ngrok` npm package: that package downloads a binary during install,
// and if that download is ever blocked (firewall, restricted CI, etc.)
// it fails your ENTIRE `npm install`, not just this one feature. This
// approach can't break your setup — worst case, this specific command
// doesn't work and everything else is unaffected. Requires the ngrok CLI
// itself to be installed and on your PATH (`npm install -g ngrok`, or
// the apt/brew/direct-download install from ngrok.com).
require("dotenv/config");
const child_process_1 = require("child_process");
const PORT = Number(process.env.PORT) || 4000;
let ngrokProcess = null;
// --url= flag overrides NGROK_STATIC_DOMAIN from .env, which overrides
// falling back to a random (non-static) tunnel URL.
const urlArg = process.argv.find((a) => a.startsWith("--url="));
const staticDomain = urlArg ? urlArg.split("=")[1] : process.env.NGROK_STATIC_DOMAIN || null;
function configureAuthtoken() {
    const token = process.env.NGROK_AUTHTOKEN;
    if (!token) {
        console.log("No NGROK_AUTHTOKEN in .env — assuming ngrok is already authenticated.");
        return;
    }
    console.log("Configuring ngrok authtoken from .env...");
    const result = (0, child_process_1.spawnSync)("ngrok", ["config", "add-authtoken", token], { stdio: "inherit" });
    if (result.status !== 0) {
        console.warn("⚠️  Couldn't auto-configure the authtoken — continuing anyway in case it's already set.");
    }
}
async function waitForNgrokUrl(retries = 20) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch("http://127.0.0.1:4040/api/tunnels");
            if (res.ok) {
                const data = (await res.json());
                const httpsTunnel = data.tunnels.find((t) => t.proto === "https");
                if (httpsTunnel)
                    return httpsTunnel.public_url;
            }
        }
        catch {
            // ngrok's local API isn't up yet — keep retrying
        }
        await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error("Timed out waiting for ngrok to report a public URL.");
}
async function main() {
    configureAuthtoken();
    console.log(staticDomain
        ? `Starting ngrok tunnel to port ${PORT} using static domain ${staticDomain}...`
        : `Starting ngrok tunnel to port ${PORT} (no static domain set — URL will change next run)...`);
    const ngrokArgs = staticDomain
        ? ["http", `--url=${staticDomain}`, String(PORT), "--log", "stdout"]
        : ["http", String(PORT), "--log", "stdout"];
    ngrokProcess = (0, child_process_1.spawn)("ngrok", ngrokArgs, { stdio: "ignore" });
    ngrokProcess.on("error", (err) => {
        console.error("\n❌ Couldn't start ngrok — is it installed and on your PATH?");
        console.error("   Install via npm: npm install -g ngrok");
        console.error("   Or via apt (Debian/Ubuntu):");
        console.error("     curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null");
        console.error("     echo \"deb https://ngrok-agent.s3.amazonaws.com bookworm main\" | sudo tee /etc/apt/sources.list.d/ngrok.list");
        console.error("     sudo apt update && sudo apt install ngrok");
        console.error("   Raw error:", err.message);
        process.exit(1);
    });
    let url;
    try {
        url = await waitForNgrokUrl();
    }
    catch (err) {
        console.error("\n❌ ngrok didn't report a public URL in time.");
        console.error("If auto-configuring the authtoken above failed, run this once manually:\n" +
            "  ngrok config add-authtoken <token from https://dashboard.ngrok.com/get-started/your-authtoken>\n" +
            "Then re-run `npm run dev:tunnel`.\n");
        ngrokProcess?.kill();
        process.exit(1);
    }
    const callbackUrl = `${url}/api/payments/mpesa/callback`;
    process.env.MPESA_CALLBACK_URL = callbackUrl;
    console.log(`\n✔ Tunnel live: ${url}`);
    console.log(`✔ MPESA_CALLBACK_URL set to: ${callbackUrl}`);
    console.log("  (set for THIS run only — .env on disk is untouched)\n");
    process.on("exit", () => ngrokProcess?.kill());
    process.on("SIGINT", () => {
        ngrokProcess?.kill();
        process.exit(0);
    });
    // Import after setting process.env so app.ts's dotenv/config call (which
    // never overwrites already-set vars) picks up our tunnel URL instead of
    // the placeholder in .env.
    await Promise.resolve().then(() => __importStar(require("./index")));
}
main();
