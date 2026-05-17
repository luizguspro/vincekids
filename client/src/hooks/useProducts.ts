import { useEffect, useState } from "react";
import { getProducts, PRODUCTS_UPDATE_EVENT } from "@/data/store";
import type { Product } from "@/data/products";

export function useProducts(): Product[] {
  const [items, setItems] = useState<Product[]>(getProducts);

  useEffect(() => {
    const refresh = () => setItems(getProducts());
    window.addEventListener(PRODUCTS_UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PRODUCTS_UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return items;
}

export function useProduct(id: string | undefined): Product | undefined {
  const products = useProducts();
  return id ? products.find((p) => p.id === id) : undefined;
}
