export const dynamic = "force-dynamic";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const query = new URLSearchParams();
    if (params.q)
        query.set("q", params.q);
    if (params.category)
        query.set("category", params.category);
    if (params.sort)
        query.set("sort", params.sort);
    if (params.page)
        query.set("page", params.page);
    const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products?${query.toString()}`, { next: { revalidate: 15 } }),
        fetch(`${API_BASE_URL}/api/categories`, { next: { revalidate: 60 } })
    ]);
    const { items: products, page, totalPages } = productsRes.ok
        ? await productsRes.json()
        : { items: [], page: 1, totalPages: 1 };
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Shop</h1>

      <form className="mt-6 flex flex-wrap gap-3" action="/shop" method="get">
        <input type="text" name="q" defaultValue={params.q} placeholder="Search furniture..." className="min-w-[220px] flex-1 rounded-full border border-wood/20 px-4 py-2 text-sm focus:border-forest focus:outline-none"/>
        <select name="category" defaultValue={params.category || ""} className="rounded-full border border-wood/20 px-4 py-2 text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => (<option key={c.id} value={c.slug}>{c.name}</option>))}
        </select>
        <select name="sort" defaultValue={params.sort || "newest"} className="rounded-full border border-wood/20 px-4 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-warmwhite">Filter</button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p}/>)}
      </div>

      {products.length === 0 && <p className="mt-10 text-center text-charcoal/60">No products match your search.</p>}

      {totalPages > 1 && (<div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<Link key={p} href={`/shop?${new URLSearchParams({ ...params, page: String(p) }).toString()}`} className={`rounded-full px-3 py-1 text-sm ${p === page ? "bg-forest text-warmwhite" : "border border-wood/20 text-charcoal"}`}>
              {p}
            </Link>))}
        </div>)}
    </div>);
}
