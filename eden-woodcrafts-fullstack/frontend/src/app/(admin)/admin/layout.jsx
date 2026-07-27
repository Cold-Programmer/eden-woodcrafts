import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AdminLayout({ children }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN")
        redirect("/login?redirect=/admin");
    return (<div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:gap-8 md:py-10">
      <aside className="w-full flex-shrink-0 md:w-48">
        <nav className="flex gap-1 overflow-x-auto pb-2 text-sm md:flex-col md:space-y-1 md:overflow-visible md:pb-0">
          <Link href="/admin" className="whitespace-nowrap rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-forest/5">Dashboard</Link>
          <Link href="/admin/products" className="whitespace-nowrap rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-forest/5">Products</Link>
          <Link href="/admin/orders" className="whitespace-nowrap rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-forest/5">Orders</Link>
          <Link href="/admin/portfolio" className="whitespace-nowrap rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-forest/5">Portfolio</Link>
          <Link href="/dashboard/settings" className="whitespace-nowrap rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-forest/5">Settings</Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>);
}
