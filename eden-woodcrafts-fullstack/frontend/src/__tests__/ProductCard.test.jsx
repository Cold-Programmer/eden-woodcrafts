import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/shop/ProductCard";
const baseProduct = {
    id: "p1",
    name: "Oak Dining Table",
    slug: "oak-dining-table",
    price: "50000",
    discount: "10",
    images: [{ url: "https://images.unsplash.com/photo-1.jpg" }],
    category: { name: "Dining Tables" }
};
describe("ProductCard", () => {
    it("shows the discounted price and the struck-through original price", () => {
        render(<ProductCard product={baseProduct}/>);
        expect(screen.getByText("Oak Dining Table")).toBeInTheDocument();
        expect(screen.getByText("KSh 45,000")).toBeInTheDocument();
        expect(screen.getByText("KSh 50,000")).toBeInTheDocument();
    });
    it("links to the product detail page", () => {
        render(<ProductCard product={baseProduct}/>);
        expect(screen.getByRole("link")).toHaveAttribute("href", "/product/oak-dining-table");
    });
});
