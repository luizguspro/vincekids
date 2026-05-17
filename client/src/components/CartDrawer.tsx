import { Link } from "wouter";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/context/CartContext";
import { cn } from "@/lib/utils";

// WhatsApp da Vince Kids. Formato internacional sem + ou espaços.
// 55 (Brasil) + 48 (Florianópolis) + 991794625
const WHATSAPP_NUMBER = "5548991794625";

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

function buildWhatsappUrl(items: CartItem[], total: number) {
  const text = encodeURIComponent(buildOrderMessage(items, total));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Ícone do WhatsApp como SVG inline (lucide não tem)
function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  );
}

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close, items, total, setQty, remove, clear } = cart;

  const handleCheckout = () => {
    if (items.length === 0) return;
    window.open(buildWhatsappUrl(items, total), "_blank", "noopener");
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
                className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full h-12 font-bold text-base shadow-md hover:shadow-lg transition"
              >
                <WhatsappIcon className="h-5 w-5" />
                Finalizar pedido no WhatsApp
              </Button>
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Abre o WhatsApp na conversa com a Vince Kids com a mensagem pronta. Você só clica em
                enviar.
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
