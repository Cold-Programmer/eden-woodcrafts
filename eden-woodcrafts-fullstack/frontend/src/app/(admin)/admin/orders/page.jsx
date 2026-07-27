import { apiFetchServer } from "@/lib/api";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
export default async function AdminOrdersPage() {
    const res = await apiFetchServer("/api/admin/orders");
    const { items: orders } = res.ok ? await res.json() : { items: [] };
    return (<div>
      <h1 className="font-serif text-2xl font-bold text-charcoal">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-xl2 border border-wood/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-wood/10 text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (<tr key={o.id} className="border-b border-wood/5">
                <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.user.name}<br /><span className="text-charcoal/50">{o.user.email}</span></td>
                <td className="px-4 py-3">{o.items.length}</td>
                <td className="px-4 py-3">KSh {Number(o.total).toLocaleString()}</td>
                <td className="px-4 py-3"><OrderStatusSelect orderId={o.id} status={o.status}/></td>
              </tr>))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-center text-charcoal/60">No orders yet.</p>}
      </div>
    </div>);
}
