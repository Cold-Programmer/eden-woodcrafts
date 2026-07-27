"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
export default function CartPage() {
    const [items, setItems] = useState(null);
    const [error, setError] = useState(null);
    async function load() {
        const res = await apiFetchClient("/api/cart");
        if (res.status === 401) {
            setError("auth");
            return;
        }
        const data = await res.json();
        setItems(data);
    }
    useEffect(() => {
        load();
    }, []);
    async function updateQty(productId, quantity) {
        if (quantity < 1)
            return;
        await apiFetchClient("/api/cart", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity })
        });
        load();
    }
    async function remove(productId) {
        await apiFetchClient(`/api/cart?productId=${productId}`, { method: "DELETE" });
        load();
    }
    if (error === "auth") {
        return (<div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Log in to view your cart</h1>
        <Link href="/login?redirect=/cart" className="mt-6 inline-block">
          <Button>Log In</Button>
        </Link>
      </div>);
    }
    if (!items) {
        return <div className="mx-auto max-w-3xl px-4 py-16 text-charcoal/60">Loading your cart...</div>;
    }
    const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Your Cart</h1>

      {items.length === 0 ? (<div className="mt-10 text-center text-charcoal/60">
          Your cart is empty. <Link href="/shop" className="text-forest underline">Browse the shop</Link>
        </div>) : (<>
          <ul className="mt-8 divide-y divide-wood/10">
            {items.map((item) => (<li key={item.productId} className="flex items-center gap-4 py-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-wood/5">
                  {item.product.images[0] && (<Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover"/>)}
                </div>
                <div className="flex-1">
                  <Link href={`/product/${item.product.slug}`} className="font-medium text-charcoal hover:text-forest">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-charcoal/60">
                    KSh {Number(item.product.price).toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-wood/20">
                      <button className="px-2 py-1" onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button className="px-2 py-1" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => remove(item.productId)} className="text-sm text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-medium text-charcoal">
                  KSh {(Number(item.product.price) * item.quantity).toLocaleString()}
                </div>
              </li>))}
          </ul>

          <div className="mt-8 flex items-center justify-between border-t border-wood/10 pt-6">
            <span className="text-lg font-semibold text-charcoal">Subtotal</span>
            <span className="text-lg font-semibold text-forest">KSh {subtotal.toLocaleString()}</span>
          </div>

          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </>)}
    </div>);
}
