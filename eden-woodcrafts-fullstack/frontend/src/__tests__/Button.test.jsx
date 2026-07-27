import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
describe("Button", () => {
    it("renders its children", () => {
        render(<Button>Add to Cart</Button>);
        expect(screen.getByRole("button", { name: "Add to Cart" })).toBeInTheDocument();
    });
    it("calls onClick when clicked", () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Save Product</Button>);
        fireEvent.click(screen.getByRole("button", { name: "Save Product" }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it("is disabled when the disabled prop is set", () => {
        render(<Button disabled>Out of Stock</Button>);
        expect(screen.getByRole("button", { name: "Out of Stock" })).toBeDisabled();
    });
});
