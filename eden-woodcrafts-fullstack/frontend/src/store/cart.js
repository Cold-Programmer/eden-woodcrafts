import { create } from "zustand";
export const useCartStore = create((set, get) => ({
    lines: [],
    isLoaded: false,
    setLines: (lines) => set({ lines, isLoaded: true }),
    addLine: (line) => set((state) => {
        const existing = state.lines.find((l) => l.productId === line.productId);
        if (existing) {
            return {
                lines: state.lines.map((l) => l.productId === line.productId
                    ? { ...l, quantity: Math.min(l.stock, l.quantity + line.quantity) }
                    : l)
            };
        }
        return { lines: [...state.lines, line] };
    }),
    removeLine: (productId) => set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
    updateQuantity: (productId, quantity) => set((state) => ({
        lines: state.lines.map((l) => l.productId === productId ? { ...l, quantity: Math.max(1, Math.min(l.stock, quantity)) } : l)
    })),
    clear: () => set({ lines: [] }),
    subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0)
}));
