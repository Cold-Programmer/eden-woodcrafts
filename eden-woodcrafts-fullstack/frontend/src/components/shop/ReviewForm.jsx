"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
export function ReviewForm({ productId, onSubmitted }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const res = await apiFetchClient("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId,
                rating,
                comment: comment || undefined,
                images: imageUrl ? [imageUrl] : []
            })
        });
        setLoading(false);
        if (res.status === 401) {
            router.push("/login?redirect=/product");
            return;
        }
        if (!res.ok) {
            const data = await res.json().catch(() => null);
            showToast(data?.error || "Couldn't submit your review.", "error");
            return;
        }
        showToast("Thanks for your review!", "success");
        setComment("");
        setImageUrl("");
        router.refresh();
        onSubmitted?.();
    }
    return (<form onSubmit={handleSubmit} className="rounded-xl border border-wood/10 bg-white p-5">
      <h3 className="font-serif text-base font-semibold text-charcoal">Leave a review</h3>
      <p className="mt-1 text-xs text-charcoal/50">
        Only available for products from a delivered order.
      </p>

      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (<button key={n} type="button" role="radio" aria-checked={rating === n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? "text-gold" : "text-charcoal/20"}`}>
            ★
          </button>))}
      </div>

      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was it?" rows={3} className="mt-3 w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"/>
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Photo URL (optional)" className="mt-2 w-full rounded-lg border border-wood/20 px-3 py-2 text-sm"/>

      <Button type="submit" disabled={loading} className="mt-3">
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>);
}
