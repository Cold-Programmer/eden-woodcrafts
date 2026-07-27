import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { apiFetchServer } from "@/lib/api";
export default async function CustomerOrderDetailPage({ params }) {
    const authUser = await getCurrentUser();
    if (!authUser)
        return null;
    const { id } = await params;
    const res = await apiFetchServer(`/api/orders/${id}`);
    if (res.status === 404)
        notFound();
    const order = res.ok ? await res.json() : null;
    if (!order)
        notFound();
    const STATUS_STEPS = [
        "PENDING_PAYMENT", "CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK",
        "PACKAGING", "OUT_FOR_DELIVERY", "DELIVERED"
    ];
    const STATUS_DESCRIPTIONS = {
        PENDING_PAYMENT: "Waiting for payment to be completed",
        CONFIRMED: "Payment received — order confirmed",
        IN_PRODUCTION: "Your piece is being built in the workshop",
        QUALITY_CHECK: "Undergoing quality inspection",
        PACKAGING: "Being packaged for delivery",
        OUT_FOR_DELIVERY: "On its way to you",
        DELIVERED: "Delivered"
    };
    const currentIndex = STATUS_STEPS.indexOf(order.status);
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Order {order.orderNumber}</h1>

      {order.status !== "CANCELLED" && (<ol aria-label="Order progress" className="mt-8 flex flex-wrap gap-2 text-xs">
          {STATUS_STEPS.map((s, i) => (<li key={s} title={STATUS_DESCRIPTIONS[s]} aria-current={i === currentIndex ? "step" : undefined} className={`rounded-full px-3 py-1 ${i <= currentIndex ? "bg-forest text-warmwhite" : "bg-wood/10 text-charcoal/50"} ${i === currentIndex ? "ring-2 ring-gold ring-offset-2" : ""}`}>
              {s.replaceAll("_", " ")}
            </li>))}
        </ol>)}

      <div className="mt-8 rounded-xl2 border border-wood/10 bg-white p-6">
        <h2 className="font-serif text-lg font-bold text-charcoal">Items</h2>
        <ul className="mt-3 divide-y divide-wood/10">
          {order.items.map((item) => (<li key={item.id} className="flex justify-between py-2 text-sm">
              <span>{item.product.name} × {item.quantity}</span>
              <span>KSh {(Number(item.unitPrice) * item.quantity).toLocaleString()}</span>
            </li>))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-wood/10 pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>KSh {Number(order.subtotal).toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>KSh {Number(order.deliveryFee).toLocaleString()}</span></div>
          <div className="flex justify-between font-semibold text-forest"><span>Total</span><span>KSh {Number(order.total).toLocaleString()}</span></div>
        </div>
      </div>

      {order.payments.length > 0 && (<div className="mt-6 rounded-xl2 border border-wood/10 bg-white p-6">
          <h2 className="font-serif text-lg font-bold text-charcoal">Payments</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.payments.map((p) => (<li key={p.id} className="flex justify-between">
                <span>{p.method} {p.mpesaReceipt ? `· ${p.mpesaReceipt}` : ""}</span>
                <span>{p.status}</span>
              </li>))}
          </ul>
        </div>)}
    </div>);
}
