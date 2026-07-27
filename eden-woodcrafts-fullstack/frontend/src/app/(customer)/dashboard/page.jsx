import Link from "next/link";
import { apiFetchServer } from "@/lib/api";
export default async function CustomerDashboardPage() {
    const [meRes, ordersRes, customOrdersRes] = await Promise.all([
        apiFetchServer("/api/auth/me"),
        apiFetchServer("/api/orders"),
        apiFetchServer("/api/custom-orders")
    ]);
    const { user } = meRes.ok ? await meRes.json() : { user: null };
    if (!user)
        return null;
    const orders = ordersRes.ok ? await ordersRes.json() : [];
    const customOrders = customOrdersRes.ok ? await customOrdersRes.json() : [];
    const recentOrders = orders.slice(0, 5);
    const recentCustomOrders = customOrders.slice(0, 3);
    return (<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Welcome back, {user?.name}</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl2 border border-wood/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-charcoal">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-forest hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (<p className="mt-3 text-sm text-charcoal/60">No orders yet.</p>) : (<ul className="mt-4 space-y-3">
              {recentOrders.map((o) => (<li key={o.id}>
                  <Link href={`/dashboard/orders/${o.id}`} className="flex items-center justify-between rounded-lg border border-wood/10 px-3 py-2 text-sm hover:border-forest">
                    <span>{o.orderNumber}</span>
                    <span className="text-charcoal/60">{o.status.replaceAll("_", " ")}</span>
                  </Link>
                </li>))}
            </ul>)}
        </section>

        <section className="rounded-xl2 border border-wood/10 bg-white p-6">
          <h2 className="font-serif text-lg font-bold text-charcoal">Custom Order Requests</h2>
          {recentCustomOrders.length === 0 ? (<p className="mt-3 text-sm text-charcoal/60">
              No requests yet. <Link href="/custom-order" className="text-forest underline">Start one →</Link>
            </p>) : (<ul className="mt-4 space-y-3">
              {recentCustomOrders.map((c) => (<li key={c.id} className="rounded-lg border border-wood/10 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>{c.material}</span>
                    <span className="text-charcoal/60">{c.status.replaceAll("_", " ")}</span>
                  </div>
                  {c.quotedPrice && (<p className="mt-1 text-forest">Quoted: KSh {Number(c.quotedPrice).toLocaleString()}</p>)}
                </li>))}
            </ul>)}
        </section>
      </div>
    </div>);
}
