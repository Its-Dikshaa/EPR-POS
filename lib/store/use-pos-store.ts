import { create } from "zustand";
import { CartItem, ProductItem } from "@/types";

interface PosStoreState {
  cart: CartItem[];
  search: string;
  selectedCategory: string;
  customer: string;
  paymentMethod: string;
  discount: number;
  heldBills: any[];
  setSearch: (search: string) => void;
  setSelectedCategory: (cat: string) => void;
  setCustomer: (customer: string) => void;
  setPaymentMethod: (method: string) => void;
  setDiscount: (discount: number) => void;
  addToCart: (product: ProductItem) => void;
  updateQty: (id: number | string, delta: number) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  holdCurrentBill: () => void;
  resumeHeldBill: (held: any) => void;
}

export const usePosStore = create<PosStoreState>((set, get) => ({
  cart: [],
  search: "",
  selectedCategory: "All",
  customer: "Walk-in",
  paymentMethod: "Cash",
  discount: 0,
  heldBills: [],

  setSearch: (search) => set({ search }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setCustomer: (customer) => set({ customer }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setDiscount: (discount) => set({ discount }),

  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, qty: 1 }] });
    }
  },

  updateQty: (id, delta) => {
    const { cart } = get();
    set({
      cart: cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    });
  },

  removeFromCart: (id) => {
    const { cart } = get();
    set({ cart: cart.filter((item) => item.id !== id) });
  },

  clearCart: () => set({ cart: [] }),

  holdCurrentBill: () => {
    const { cart, customer, heldBills } = get();
    if (cart.length === 0) return;
    const newHeld = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString(),
      cart: [...cart],
      customer,
    };
    set({ heldBills: [...heldBills, newHeld], cart: [] });
  },

  resumeHeldBill: (held) => {
    const { heldBills } = get();
    set({
      cart: held.cart,
      customer: held.customer,
      heldBills: heldBills.filter((b) => b.id !== held.id),
    });
  },
}));
