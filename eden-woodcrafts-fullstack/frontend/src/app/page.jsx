export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
async function getHomeData() {
    const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products?sort=newest`, { next: { revalidate: 30 } }),
        fetch(`${API_BASE_URL}/api/categories`, { next: { revalidate: 60 } })
    ]);
    const productsData = productsRes.ok ? await productsRes.json() : { items: [] };
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    return { featured: productsData.items.slice(0, 8), categories: categories.slice(0, 8) };
}
export default async function HomePage() {
    const { featured, categories } = await getHomeData();
    return (<div>
      <section className="relative overflow-hidden bg-forest text-warmwhite">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-3 text-sm uppercase tracking-widest text-gold">Nairobi · Kasarani Carwash</p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
              Handcrafted furniture, built to live in your home for generations.
            </h1>
            <p className="mt-4 max-w-md text-warmwhite/80">
              Eden Woodcrafts is a carpentry workshop turning solid timber into beds, sofas,
              dining sets and bespoke pieces — made to order, made to last.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop"><Button variant="secondary">Shop the Collection</Button></Link>
              <Link href="/custom-order">
                <Button variant="outline" className="border-warmwhite text-warmwhite hover:bg-warmwhite/10">
                  Request Custom Piece
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2">
            <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80" alt="Handcrafted wooden furniture in a workshop" fill className="object-cover" priority/>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-serif text-2xl font-bold text-charcoal">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => (<Link key={c.id} href={`/shop?category=${c.slug}`} className="rounded-xl2 border border-wood/10 bg-white p-5 text-center shadow-sm transition hover:shadow-md">
              <span className="font-medium text-charcoal">{c.name}</span>
            </Link>))}
          {categories.length === 0 && (<p className="col-span-full text-charcoal/60">
              Categories will appear here once seeded — run <code>npm run seed</code> in the backend.
            </p>)}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-charcoal">Latest Pieces</h2>
            <Link href="/shop" className="text-sm font-medium text-forest hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (<ProductCard key={p.id} product={p}/>))}
          </div>
          {featured.length === 0 && (<p className="mt-6 text-charcoal/60">
              No products yet — run <code>npm run seed</code> in the backend to load sample furniture.
            </p>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Why Choose Eden Woodcrafts</h2>
            <ul className="mt-4 space-y-3 text-charcoal/80">
              <li>✔ Solid timber, hand-finished joinery</li>
              <li>✔ Custom sizing and finishes on every order</li>
              <li>✔ Transparent quotations before you commit</li>
              <li>✔ Delivery and assembly across Nairobi</li>
            </ul>
            <Link href="/about" className="mt-4 inline-block text-sm font-medium text-forest hover:underline">
              Read our full story →
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Custom Furniture Process</h2>
            <ol className="mt-4 space-y-2 text-charcoal/80">
              <li>1. Share your design, measurements and budget</li>
              <li>2. We send a quotation for your approval</li>
              <li>3. Production begins once you approve and pay</li>
              <li>4. Track progress until delivery to your door</li>
            </ol>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/custom-order"><Button>Start a Custom Order</Button></Link>
              <Link href="/portfolio" className="inline-flex items-center text-sm font-medium text-forest hover:underline">
                See completed projects →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>);
}
