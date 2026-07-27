import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { apiFetchServer } from "@/lib/api";
export default async function CustomerOrdersPage() {
    const authUser = await getCurrentUser();
    if (!authUser)
        return null;
    const res = await apiFetchServer("/api/orders");
    const orders = res.ok ? await res.json() : [];
    return (<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">My Orders</h1>

      {orders.length === 0 ? (<p className="mt-6 text-charcoal/60">
          No orders yet. <Link href="/shop" className="text-forest underline">Start shopping</Link>
        </p>) : (<ul className="mt-8 space-y-3">
          {orders.map((o) => (<li key={o.id}>
              <Link href={`/dashboard/orders/${o.id}`} className="flex items-center justify-between rounded-xl border border-wood/10 bg-white px-5 py-4 hover:border-forest">
                <div>
                  <p className="font-medium text-charcoal">{o.orderNumber}</p>
                  <p className="text-sm text-charcoal/60">{o.items.length} item(s) · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-forest">KSh {Number(o.total).toLocaleString()}</p>
                  <p className="text-sm text-charcoal/60">{o.status.replaceAll("_", " ")}</p>
                </div>
              </Link>
            </li>))}
        </ul>)}
    </div>);
}
