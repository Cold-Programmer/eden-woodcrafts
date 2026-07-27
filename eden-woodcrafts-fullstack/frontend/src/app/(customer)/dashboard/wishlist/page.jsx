import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { apiFetchServer } from "@/lib/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { WishlistRemoveButton } from "@/components/shop/WishlistRemoveButton";
export default async function WishlistPage() {
    const authUser = await getCurrentUser();
    if (!authUser)
        return null;
    const res = await apiFetchServer("/api/wishlist");
    const items = res.ok ? await res.json() : [];
    return (<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">My Wishlist</h1>

      {items.length === 0 ? (<div className="mt-8">
          <EmptyState title="Your wishlist is empty" description="Save pieces you're considering so you can find them again later." action={<Link href="/shop" className="text-sm font-medium text-forest hover:underline">Browse the shop →</Link>}/>
        </div>) : (<ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (<li key={item.id} className="flex items-center gap-4 rounded-xl2 border border-wood/10 bg-white p-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-wood/5">
                {item.product.images[0] && (<Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover"/>)}
              </div>
              <div className="flex-1">
                <Link href={`/product/${item.product.slug}`} className="font-medium text-charcoal hover:text-forest">
                  {item.product.name}
                </Link>
                <p className="text-sm text-charcoal/60">KSh {Number(item.product.price).toLocaleString()}</p>
              </div>
              <WishlistRemoveButton productId={item.productId}/>
            </li>))}
        </ul>)}
    </div>);
}
