import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; productId: string; size: string }
  | { type: "qty"; productId: string; size: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "vk_cart";

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const idx = state.items.findIndex(
        (i) => i.productId === action.item.productId && i.size === action.item.size
      );
      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = { ...next[idx], qty: next[idx].qty + action.item.qty };
        return { items: next };
      }
      return { items: [...state.items, action.item] };
    }
    case "remove":
      return {
        items: state.items.filter(
          (i) => !(i.productId === action.productId && i.size === action.size)
        ),
      };
    case "qty":
      return {
        items: state.items
          .map((i) =>
            i.productId === action.productId && i.size === action.size
              ? { ...i, qty: Math.max(1, action.qty) }
              : i
          ),
      };
    case "clear":
      return { items: [] };
  }
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: CartItem) => void;
  remove: (productId: string, size: string) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", items: parsed });
      }
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const value = useMemo<CartCtx>(() => {
    const count = state.items.reduce((acc, i) => acc + i.qty, 0);
    const total = state.items.reduce((acc, i) => acc + i.qty * i.price, 0);
    return {
      items: state.items,
      count,
      total,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      add: (item) => {
        dispatch({ type: "add", item });
        setIsOpen(true);
      },
      remove: (productId, size) => dispatch({ type: "remove", productId, size }),
      setQty: (productId, size, qty) => dispatch({ type: "qty", productId, size, qty }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
