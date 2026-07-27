import Link from "next/link";
import Image from "next/image";
export function ProductCard({ product }) {
    const price = Number(product.price);
    const discount = Number(product.discount || 0);
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    const image = product.images[0]?.url;
    return (<Link href={`/product/${product.slug}`} className="group block overflow-hidden rounded-xl2 border border-wood/10 bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-wood/5">
        {image ? (<Image src={image} alt={product.name} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw"/>) : (<div className="flex h-full items-center justify-center text-wood/40">No image</div>)}
        {discount > 0 && (<span className="absolute left-3 top-3 rounded-full bg-gold px-2 py-1 text-xs font-semibold text-charcoal">
            -{discount}%
          </span>)}
      </div>
      <div className="p-4">
        {product.category && (<p className="text-xs uppercase tracking-wide text-wood">{product.category.name}</p>)}
        <h3 className="mt-1 font-serif text-base font-semibold text-charcoal">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-forest">
            KSh {finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          {discount > 0 && (<span className="text-sm text-charcoal/40 line-through">
              KSh {price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>)}
        </div>
      </div>
    </Link>);
}
