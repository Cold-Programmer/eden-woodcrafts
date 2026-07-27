import Link from "next/link";
import Image from "next/image";
import { apiFetchServer } from "@/lib/api";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
export default async function AdminProductsPage() {
    const res = await apiFetchServer("/api/admin/products");
    const { items: products } = res.ok ? await res.json() : { items: [] };
    return (<div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-warmwhite">
          + New Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-wood/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-wood/10 text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (<tr key={p.id} className="border-b border-wood/5">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-wood/5">
                    {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover"/>}
                  </div>
                  {p.name}
                </td>
                <td className="px-4 py-3">{p.category.name}</td>
                <td className="px-4 py-3">KSh {Number(p.price).toLocaleString()}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${p.isActive ? "bg-forest/10 text-forest" : "bg-red-100 text-red-600"}`}>
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-forest hover:underline">Edit</Link>
                    <DeleteProductButton id={p.id}/>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-charcoal/60">No products yet.</p>}
      </div>
    </div>);
}
