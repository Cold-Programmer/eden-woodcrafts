"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
export default function CheckoutPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [showStkModal, setShowStkModal] = useState(false);
    const [step, setStep] = useState("address");
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [saveNewAddress, setSaveNewAddress] = useState(true);
    const [address, setAddress] = useState({ label: "Home", line1: "", city: "Nairobi", phone: "" });
    const [orderId, setOrderId] = useState(null);
    const [orderTotal, setOrderTotal] = useState(null);
    const [mpesaPhone, setMpesaPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("MPESA");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState(null);
    useEffect(() => {
        apiFetchClient("/api/addresses").then(async (res) => {
            if (!res.ok)
                return;
            const data = await res.json();
            setSavedAddresses(data);
            const defaultAddr = data.find((a) => a.isDefault) || data[0];
            if (defaultAddr)
                setSelectedAddressId(defaultAddr.id);
            else
                setUseNewAddress(true);
        });
    }, []);
    async function placeOrder() {
        setStatus("loading");
        setMessage(null);
        let addressId = selectedAddressId;
        if (useNewAddress) {
            if (saveNewAddress) {
                const res = await apiFetchClient("/api/addresses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(address)
                });
                if (res.ok) {
                    const saved = await res.json();
                    addressId = saved.id;
                }
            }
        }
        const res = await apiFetchClient("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                addressId: addressId || undefined,
                notes: useNewAddress ? `Delivery: ${address.line1}, ${address.city}` : undefined
            })
        });
        const data = await res.json();
        if (!res.ok) {
            setStatus("error");
            setMessage(data.error || "Could not place order");
            return;
        }
        setOrderId(data.id);
        setOrderTotal(Number(data.total));
        setStatus("idle");
        setStep("payment");
    }
    async function payWithMpesa() {
        if (!orderId)
            return;
        setStatus("loading");
        setMessage(null);
        const res = await apiFetchClient("/api/payments/mpesa/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, phone: mpesaPhone })
        });
        const data = await res.json();
        if (!res.ok) {
            setStatus("error");
            // Show the REAL error the backend/Daraja returned. Only fall back
            // to the generic credentials hint if the backend explicitly says
            // an env var is missing — otherwise this was masking the actual
            // Safaricom rejection reason, which is what you need to debug it.
            const missingEnvVar = typeof data.error === "string" && data.error.includes("Missing required env var");
            const friendly = missingEnvVar
                ? data.error
                : data.error || "M-Pesa payment could not be started — see the backend terminal for details.";
            setMessage(friendly);
            showToast(friendly, "error");
            return;
        }
        setStatus("idle");
        setMessage(data.message);
        showToast("M-Pesa prompt sent — check your phone", "success");
        setShowStkModal(true);
        setStep("done");
    }
    const canContinue = useNewAddress ? Boolean(address.line1 && address.phone) : Boolean(selectedAddressId);
    return (<div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Checkout</h1>

      <ol className="mt-6 flex gap-4 text-sm text-charcoal/50">
        <li className={step === "address" ? "font-semibold text-forest" : ""}>1. Address</li>
        <li className={step === "review" ? "font-semibold text-forest" : ""}>2. Review</li>
        <li className={step === "payment" || step === "done" ? "font-semibold text-forest" : ""}>3. Payment</li>
      </ol>

      {step === "address" && (<div className="mt-8 space-y-4">
          {savedAddresses.length > 0 && !useNewAddress && (<div className="space-y-2">
              {savedAddresses.map((a) => (<label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${selectedAddressId === a.id ? "border-forest bg-forest/5" : "border-wood/20"}`}>
                  <input type="radio" name="address" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} className="mt-1"/>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-charcoal">{a.label}</span>
                      {a.isDefault && <Badge tone="gold">Default</Badge>}
                    </div>
                    <p className="text-sm text-charcoal/70">{a.line1}, {a.city}</p>
                    <p className="text-sm text-charcoal/50">{a.phone}</p>
                  </div>
                </label>))}
              <button onClick={() => setUseNewAddress(true)} className="text-sm text-forest hover:underline">
                + Use a different address
              </button>
            </div>)}

          {(useNewAddress || savedAddresses.length === 0) && (<div className="space-y-4">
              {savedAddresses.length > 0 && (<button onClick={() => setUseNewAddress(false)} className="text-sm text-forest hover:underline">
                  ← Use a saved address
                </button>)}
              <div>
                <label className="mb-1 block text-sm font-medium text-charcoal">Delivery Address</label>
                <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Street, building, house number" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-charcoal">City</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-charcoal">Contact Phone</label>
                <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="07XXXXXXXX" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
              </div>
              <label className="flex items-center gap-2 text-sm text-charcoal/70">
                <input type="checkbox" checked={saveNewAddress} onChange={(e) => setSaveNewAddress(e.target.checked)}/>
                Save this address for next time
              </label>
            </div>)}

          <Button onClick={() => setStep("review")} disabled={!canContinue} className="w-full">
            Continue to Review
          </Button>
        </div>)}

      {step === "review" && (<div className="mt-8 space-y-4">
          <div className="rounded-xl border border-wood/10 bg-white p-4">
            <p className="text-sm text-charcoal/60">Delivering to</p>
            {useNewAddress ? (<>
                <p className="font-medium text-charcoal">{address.line1}, {address.city}</p>
                <p className="text-sm text-charcoal/60">{address.phone}</p>
              </>) : ((() => {
                const a = savedAddresses.find((x) => x.id === selectedAddressId);
                return a ? (<>
                    <p className="font-medium text-charcoal">{a.label} — {a.line1}, {a.city}</p>
                    <p className="text-sm text-charcoal/60">{a.phone}</p>
                  </>) : null;
            })())}
          </div>
          {message && <p className="text-sm text-red-600">{message}</p>}
          <Button onClick={placeOrder} disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Placing order..." : "Place Order"}
          </Button>
        </div>)}

      {step === "payment" && orderTotal !== null && (<div className="mt-8 space-y-4">
          <p className="text-charcoal">
            Order total: <span className="font-semibold text-forest">KSh {orderTotal.toLocaleString()}</span>
          </p>

          <div className="flex gap-3">
            <button onClick={() => setPaymentMethod("MPESA")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${paymentMethod === "MPESA" ? "border-forest bg-forest/5 text-forest" : "border-wood/20 text-charcoal"}`}>
              M-Pesa
            </button>
            <button onClick={() => setPaymentMethod("COD")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${paymentMethod === "COD" ? "border-forest bg-forest/5 text-forest" : "border-wood/20 text-charcoal"}`}>
              Cash on Delivery
            </button>
          </div>

          {paymentMethod === "MPESA" ? (<div className="space-y-3">
              <input value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} placeholder="M-Pesa phone e.g. 0712345678" className="w-full rounded-lg border border-wood/20 px-4 py-2"/>
              <p className="text-xs text-charcoal/50">
                Running in sandbox mode: use Safaricom's test number
                <button type="button" onClick={() => setMpesaPhone("0708374149")} className="mx-1 font-medium text-forest underline">
                  0708374149
                </button>
                with any 4-digit PIN — sandbox can't prompt a real phone.
              </p>
              {message && <p className="text-sm text-forest">{message}</p>}
              <Button onClick={payWithMpesa} disabled={status === "loading" || !mpesaPhone} className="w-full">
                {status === "loading" ? "Sending STK push..." : "Pay with M-Pesa"}
              </Button>
            </div>) : (<Button onClick={() => {
                    setStep("done");
                    setMessage("Order confirmed — pay in cash when it's delivered.");
                }} className="w-full">
              Confirm Cash on Delivery
            </Button>)}
        </div>)}

      {step === "done" && (<div className="mt-8 rounded-xl border border-forest/20 bg-forest/5 p-6 text-center">
          <h2 className="font-serif text-xl font-bold text-forest">Thank you!</h2>
          <p className="mt-2 text-charcoal/80">{message}</p>
          <Button onClick={() => router.push("/dashboard/orders")} className="mt-6">
            View My Orders
          </Button>
        </div>)}

      <Modal open={showStkModal} onClose={() => setShowStkModal(false)} title="M-Pesa prompt sent">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-2xl">
            📱
          </div>
          <p className="mt-4 text-charcoal/80">
            A payment prompt was sent to <strong>{mpesaPhone}</strong>. Enter your M-Pesa PIN on
            your phone to complete the payment.
          </p>
          <p className="mt-3 text-xs text-charcoal/50">
            In sandbox mode, use test number 0708374149 with any 4-digit PIN — this won't ring a
            real personal phone.
          </p>
          <Button onClick={() => setShowStkModal(false)} className="mt-5 w-full">
            Got it
          </Button>
        </div>
      </Modal>
    </div>);
}
