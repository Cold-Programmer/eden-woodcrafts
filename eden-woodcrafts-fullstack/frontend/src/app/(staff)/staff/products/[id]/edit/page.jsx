import { notFound } from "next/navigation";
import { API_BASE_URL, apiFetchServer } from "@/lib/api";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function StaffEditProductPage({ params }) {
  const { id } = await params;
  const [productRes, categoriesRes] = await Promise.all([
    apiFetchServer(`/api/products/${id}`),
    fetch(`${API_BASE_URL}/api/categories`, { cache: "no-store" })
  ]);
  if (productRes.status === 404) notFound();
  const product = productRes.ok ? await productRes.json() : null;
  const categories = categoriesRes.ok ? await categoriesRes.json() : [];
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          productId={product.id}
          redirectTo="/staff/products"
          initial={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            material: product.material || "",
            price: String(product.price),
            discount: String(product.discount || 0),
            stock: String(product.stock),
            dimensions: product.dimensions || "",
            categoryId: product.categoryId,
            imageUrl: product.images[0]?.url || ""
          }}
        />
      </div>
    </div>
  );
}
