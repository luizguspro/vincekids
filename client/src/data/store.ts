/**
 * Camada de armazenamento dos produtos.
 *
 * - Em runtime: lê de localStorage (draft do admin), fallback DEFAULT_PRODUCTS
 * - Pra publicar: admin exporta JSON e cola em DEFAULT_PRODUCTS de products.ts
 */
import { DEFAULT_PRODUCTS, type Product } from "./products";

const STORAGE_KEY = "vk_products_draft";
const UPDATE_EVENT = "vk:products-updated";

export function getProducts(): Product[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Product[];
    }
  } catch {
    // JSON inválido, cai pro default
  }
  return DEFAULT_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function resetProducts() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function hasDraft(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}

export function exportProductsJSON(products: Product[]) {
  const blob = new Blob([JSON.stringify(products, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `products-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importProductsJSON(file: File): Promise<Product[]> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("JSON deve ser um array de produtos");
  return parsed as Product[];
}

export const PRODUCTS_UPDATE_EVENT = UPDATE_EVENT;
