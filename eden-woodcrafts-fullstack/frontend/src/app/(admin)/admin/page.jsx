import { apiFetchServer } from "@/lib/api";
export default async function AdminDashboardPage() {
    const res = await apiFetchServer("/api/admin/stats");
    const stats = res.ok
        ? await res.json()
        : { productCount: 0, orderCount: 0, customerCount: 0, pendingOrders: 0, revenue: 0 };
    const cards = [
        { label: "Active Products", value: stats.productCount },
        { label: "Total Orders", value: stats.orderCount },
        { label: "Customers", value: stats.customerCount },
        { label: "Awaiting Payment", value: stats.pendingOrders },
        { label: "Confirmed Revenue", value: `KSh ${Number(stats.revenue).toLocaleString()}` }
    ];
    return (<div>
      <h1 className="font-serif text-2xl font-bold text-charcoal">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((c) => (<div key={c.label} className="rounded-xl2 border border-wood/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal/50">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-forest">{c.value}</p>
          </div>))}
      </div>
    </div>);
}
