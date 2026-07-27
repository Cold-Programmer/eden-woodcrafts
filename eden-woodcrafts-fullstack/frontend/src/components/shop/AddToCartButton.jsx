"use client";
import { apiFetchClient } from "@/lib/apiClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
export function AddToCartButton(props) {
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState("idle");
    const addLine = useCartStore((s) => s.addLine);
    const router = useRouter();
    const { showToast } = useToast();
    async function handleAdd() {
        setStatus("loading");
        const res = await apiFetchClient("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: props.productId, quantity })
        });
        if (res.status === 401) {
            router.push(`/login?redirect=/product/${props.slug}`);
            return;
        }
        if (!res.ok) {
            setStatus("idle");
            showToast("Couldn't add that to your cart — try again.", "error");
            return;
        }
        addLine({
            productId: props.productId,
            name: props.name,
            slug: props.slug,
            price: props.price,
            image: props.image,
            quantity,
            stock: props.stock
        });
        setStatus("idle");
        showToast(`Added ${props.name} to your cart.`, "success");
        router.push("/cart");
    }
    if (props.stock <= 0) {
        return <Button disabled>Out of Stock</Button>;
    }
    return (<div className="flex items-center gap-4">
      <div className="flex items-center rounded-full border border-wood/20">
        <button className="px-3 py-2 text-charcoal" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
          −
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button className="px-3 py-2 text-charcoal" onClick={() => setQuantity((q) => Math.min(props.stock, q + 1))} aria-label="Increase quantity">
          +
        </button>
      </div>
      <Button onClick={handleAdd} disabled={status === "loading"}>
        {status === "loading" ? "Adding..." : "Add to Cart"}
      </Button>
    </div>);
}
