export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { ReviewForm } from "@/components/shop/ReviewForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { API_BASE_URL } from "@/lib/api";
async function getProduct(slug) {
    const res = await fetch(`${API_BASE_URL}/api/products/${slug}`, { next: { revalidate: 15 } });
    if (!res.ok)
        return null;
    return res.json();
}
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product)
        return {};
    return { title: product.name, description: product.description.slice(0, 155) };
}
export default async function ProductDetailPage({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product || !product.isActive)
        notFound();
    const price = Number(product.price);
    const discount = Number(product.discount || 0);
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
        : null;
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl2 bg-wood/5">
            {product.images[0] ? (<Image src={product.images[0].url} alt={product.images[0].altText || product.name} fill className="object-cover" priority/>) : (<div className="flex h-full items-center justify-center text-wood/40">No image</div>)}
          </div>
          {product.images.length > 1 && (<div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img) => (<div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-wood/5">
                  <Image src={img.url} alt={img.altText || product.name} fill className="object-cover"/>
                </div>))}
            </div>)}
        </div>

        <div>
          {product.category && <p className="text-xs uppercase tracking-wide text-wood">{product.category.name}</p>}
          <h1 className="mt-1 font-serif text-3xl font-bold text-charcoal">{product.name}</h1>

          {avgRating !== null && (<p className="mt-2 text-sm text-charcoal/70">★ {avgRating.toFixed(1)} ({product.reviews.length} reviews)</p>)}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-forest">
              KSh {finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            {discount > 0 && (<span className="text-charcoal/40 line-through">
                KSh {price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>)}
          </div>

          <p className="mt-4 whitespace-pre-line text-charcoal/80">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {product.material && (<div><dt className="text-charcoal/50">Material</dt><dd className="font-medium">{product.material}</dd></div>)}
            {product.dimensions && (<div><dt className="text-charcoal/50">Dimensions</dt><dd className="font-medium">{product.dimensions}</dd></div>)}
            <div>
              <dt className="text-charcoal/50">Availability</dt>
              <dd className="font-medium">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-center gap-3">
            <AddToCartButton productId={product.id} name={product.name} slug={product.slug} price={finalPrice} image={product.images[0]?.url} stock={product.stock}/>
            <WishlistButton productId={product.id}/>
          </div>
        </div>
      </div>

      <section className="mt-16 grid gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal">Reviews</h2>
          {product.reviews.length === 0 ? (<div className="mt-4">
              <EmptyState title="No reviews yet" description="Be the first to review this piece after your order is delivered."/>
            </div>) : (<ul className="mt-4 space-y-4">
              {product.reviews.map((r) => (<li key={r.id} className="rounded-xl border border-wood/10 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-charcoal">{r.user.name}</span>
                    <span className="text-gold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-charcoal/70">{r.comment}</p>}
                  {r.images?.length > 0 && (<div className="mt-3 flex gap-2">
                      {r.images.map((url) => (<div key={url} className="relative h-16 w-16 overflow-hidden rounded-lg bg-wood/5">
                          <Image src={url} alt="Review photo" fill className="object-cover"/>
                        </div>))}
                    </div>)}
                </li>))}
            </ul>)}
        </div>
        <div>
          <ReviewForm productId={product.id}/>
        </div>
      </section>
    </div>);
}
