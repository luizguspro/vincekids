import { useState } from "react";
import { Link } from "wouter";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const INSTAGRAM_DM_URL = "https://www.instagram.com/direct/t/17842232904650748/";

function formatPrice(n: number) {
  return "R$ " + n.toFixed(2).replace(".", ",");
}

function buildOrderMessage(items: CartItem[], total: number) {
  const blocks = items.map((i) =>
    [
      `Produto: ${i.name} (ID: ${i.productId})`,
      `Valor unitário: ${formatPrice(i.price)}`,
      `Tamanho: ${i.size}`,
      `Quantidade: ${i.qty}`,
      `Total: ${formatPrice(i.price * i.qty)}`,
    ].join("\n")
  );

  return [
    "Olá! Vim pelo site da Vince Kids e gostaria de fazer um pedido:",
    "",
    blocks.join("\n\n"),
    "",
    `Total do pedido: ${formatPrice(total)}`,
    "",
    "Aguardo confirmação de disponibilidade. Obrigado!",
  ].join("\n");
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close, items, total, setQty, remove, clear } = cart;
  const [copied, setCopied] = useState(false);

  const handleCheckout = async () => {
    const msg = buildOrderMessage(items, total);

    // 1. copia a mensagem (tanto no mobile quanto no desktop)
    const ok = await copyToClipboard(msg);
    if (!ok) {
      window.prompt("Copie a mensagem abaixo e cole no DM:", msg);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }

    // 2. abre o DM da Vince Kids
    //    no mobile com app do Insta instalado, abre o app direto na thread
    //    no desktop / sem app, abre instagram.com/direct/...
    window.open(INSTAGRAM_DM_URL, "_blank", "noopener");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] transition-opacity",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Fechar carrinho"
        className="absolute inset-0 bg-black/50"
        onClick={close}
      />
      <aside
        className={cn(
          "absolute top-0 right-0 h-full w-full sm:w-[420px] max-w-full bg-white shadow-2xl flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Carrinho"
      >
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-display text-xl text-primary">Carrinho</span>
            <span className="text-sm text-muted-foreground">({cart.count})</span>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-muted text-foreground/70"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Link href="/colecao">
              <Button onClick={close} className="bg-primary hover:bg-primary/90 rounded-full">
                Ver coleção
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {items.map((i) => (
                <li
                  key={i.productId + "-" + i.size}
                  className="flex gap-3 bg-[#FDFDFD] border border-border/40 rounded-2xl p-3"
                >
                  <img
                    src={i.image}
                    alt={i.name}
                    className="w-20 h-20 object-cover rounded-xl bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-bold text-sm sm:text-base line-clamp-2">{i.name}</p>
                      <button
                        onClick={() => remove(i.productId, i.size)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Tamanho {i.size}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 border border-border rounded-full">
                        <button
                          onClick={() => setQty(i.productId, i.size, i.qty - 1)}
                          disabled={i.qty <= 1}
                          className="p-1.5 disabled:opacity-30 hover:text-primary"
                          aria-label="Diminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.productId, i.size, i.qty + 1)}
                          className="p-1.5 hover:text-primary"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-bold text-primary text-sm sm:text-base">
                        {formatPrice(i.price * i.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border/40 p-4 sm:p-6 space-y-3 shrink-0 bg-white">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-display text-primary">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                className={cn(
                  "w-full rounded-full h-12 font-bold text-base transition",
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                    : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    Mensagem copiada · cole no DM
                  </>
                ) : (
                  "Finalizar no Instagram"
                )}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                A mensagem é copiada e o DM da Vince Kids abre numa nova aba. Cole no chat.
              </p>
              <button
                onClick={clear}
                className="w-full text-xs text-muted-foreground hover:text-destructive"
              >
                Limpar carrinho
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
