import { apiFetchServer } from "@/lib/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
const ACTIVE_STAGES = ["CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK", "PACKAGING", "OUT_FOR_DELIVERY"];
export default async function StaffQueuePage() {
    const results = await Promise.all(ACTIVE_STAGES.map((status) => apiFetchServer(`/api/admin/orders?status=${status}`)));
    const grouped = await Promise.all(results.map(async (res) => (res.ok ? (await res.json()).items : [])));
    const orders = ACTIVE_STAGES.map((status, i) => ({ status, orders: grouped[i] }));
    const totalActive = orders.reduce((sum, g) => sum + g.orders.length, 0);
    return (<div>
      <h1 className="font-serif text-2xl font-bold text-charcoal">Production Queue</h1>
      <p className="mt-1 text-sm text-charcoal/60">{totalActive} order(s) currently in progress</p>

      {totalActive === 0 ? (<div className="mt-8">
          <EmptyState title="Nothing in production right now" description="Confirmed orders will show up here as they move through the workshop."/>
        </div>) : (<div className="mt-8 space-y-8">
          {orders
                .filter((g) => g.orders.length > 0)
                .map((group) => (<section key={group.status}>
                <div className="mb-3 flex items-center gap-2">
                  <Badge tone={group.status === "OUT_FOR_DELIVERY" ? "success" : "neutral"}>
                    {group.status.replaceAll("_", " ")}
                  </Badge>
                  <span className="text-sm text-charcoal/50">{group.orders.length} order(s)</span>
                </div>
                <div className="overflow-x-auto rounded-xl2 border border-wood/10 bg-white">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-wood/10 text-charcoal/50">
                      <tr>
                        <th className="px-4 py-3">Order</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3">Update Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.orders.map((o) => (<tr key={o.id} className="border-b border-wood/5">
                          <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                          <td className="px-4 py-3">{o.user.name}</td>
                          <td className="px-4 py-3">{o.items.length}</td>
                          <td className="px-4 py-3"><OrderStatusSelect orderId={o.id} status={o.status}/></td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
              </section>))}
        </div>)}
    </div>);
}
