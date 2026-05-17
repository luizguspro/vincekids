import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Check,
  Copy,
  Instagram,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [copied, setCopied] = useState(false);
  const message = buildOrderMessage(items, total);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // reset estado ao fechar
  useEffect(() => {
    if (!showCheckout) setCopied(false);
  }, [showCheckout]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(message);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      // se nem o fallback funcionar, seleciona o texto pro usuário copiar manual
      textareaRef.current?.select();
    }
  };

  const handleOpenInstagram = async () => {
    // garante que copia antes de abrir
    await copyToClipboard(message);
    window.open(INSTAGRAM_DM_URL, "_blank", "noopener");
  };

  return (
    <>
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
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full h-12 font-bold text-base"
                >
                  Finalizar pedido
                  <ArrowRight className="h-4 w-4" />
                </Button>
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

      {/* Modal de checkout: mostra a mensagem pra copiar */}
      <div
        className={cn(
          "fixed inset-0 z-[80] flex items-end sm:items-center justify-center transition-opacity",
          showCheckout ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!showCheckout}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/60"
          onClick={() => setShowCheckout(false)}
          aria-label="Fechar"
        />
        <div
          className={cn(
            "relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300",
            showCheckout ? "translate-y-0" : "translate-y-full sm:translate-y-0"
          )}
        >
          <header className="flex items-center justify-between p-4 sm:p-6 border-b border-border/40 shrink-0">
            <div>
              <h2 className="font-display text-2xl text-primary">Finalizar no Instagram</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                2 passos: copiar a mensagem → colar no DM
              </p>
            </div>
            <button
              onClick={() => setShowCheckout(false)}
              className="p-2 rounded-full hover:bg-muted text-foreground/70"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Passo 1 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                  1
                </span>
                <span className="font-bold text-foreground">Copie a mensagem do pedido</span>
              </div>
              <textarea
                ref={textareaRef}
                readOnly
                value={message}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="w-full text-xs sm:text-sm font-mono bg-[#FDFDFD] border border-border rounded-xl p-3 h-44 sm:h-52 resize-none focus:outline-none focus:border-primary"
              />
              <Button
                onClick={handleCopy}
                className={cn(
                  "w-full mt-2 rounded-full h-11 font-bold transition",
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copiar mensagem
                  </>
                )}
              </Button>
            </div>

            {/* Passo 2 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                  2
                </span>
                <span className="font-bold text-foreground">Abra o Instagram e cole no chat</span>
              </div>
              <Button
                onClick={handleOpenInstagram}
                className="w-full rounded-full h-12 font-bold text-base bg-gradient-to-r from-[#E1306C] via-[#C13584] to-[#833AB4] text-white hover:opacity-90"
              >
                <Instagram className="h-5 w-5" />
                Abrir DM da Vince Kids
              </Button>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                No chat, toque longo no campo de texto e escolha <b>Colar</b>.
              </p>
            </div>
          </div>

          <footer className="p-4 sm:p-6 border-t border-border/40 shrink-0">
            <button
              onClick={() => setShowCheckout(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Voltar pro carrinho
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
