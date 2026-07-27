import { API_BASE_URL } from "@/lib/api";
import { ProductForm } from "@/components/admin/ProductForm";
export default async function NewProductPage() {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { cache: "no-store" });
    const categories = res.ok ? await res.json() : [];
    return (<div>
      <h1 className="font-serif text-2xl font-bold text-charcoal">New Product</h1>
      <div className="mt-6">
        <ProductForm categories={categories}/>
      </div>
    </div>);
}
