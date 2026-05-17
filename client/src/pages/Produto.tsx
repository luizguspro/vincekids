import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import SizeGuideModal from "@/components/SizeGuideModal";
import { useProduct } from "@/hooks/useProducts";
import { categories } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { setPageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

function formatPrice(n: number) {
  return "R$ " + n.toFixed(2).replace(".", ",");
}

async function shareProduct(productName: string, url: string) {
  const text = `Olha esse produto da Vince Kids:\n${productName}\n${url}`;

  // 1. Mobile: tenta share sheet nativa
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: productName, text: productName, url });
      return "shared";
    } catch {
      // user cancelou ou falhou — segue pro plan B
    }
  }

  // 2. Copia link no clipboard
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    // 3. Último recurso: abre WhatsApp Web sem número (deixa escolher o contato)
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    return "whatsapp";
  }
}

export default function Produto() {
  const params = useParams<{ id: string }>();
  const product = useProduct(params.id);
  const cart = useCart();

  const gallery = useMemo(
    () => (product ? [product.image, ...(product.gallery ?? [])] : []),
    [product]
  );
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // SEO dinâmico
  useEffect(() => {
    if (product) {
      setPageMeta(product.name, product.description);
    } else {
      setPageMeta();
    }
    return () => setPageMeta();
  }, [product]);

  // reseta ao trocar de produto
  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(null);
    setQty(1);
    setJustAdded(false);
    setShareFeedback(null);
  }, [params.id]);

  if (!product) {
    return (
      <Layout>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-primary mb-3">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Esse produto pode ter sido removido ou o link está incorreto.
          </p>
          <Link href="/colecao">
            <Button className="bg-primary hover:bg-primary/90 rounded-full">Ver coleção</Button>
          </Link>
        </section>
      </Layout>
    );
  }

  const category = categories.find((c) => c.slug === product.category);
  const selectedSizeInfo = product.sizes.find((s) => s.size === selectedSize);
  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
  const maxQty = selectedSizeInfo?.stock ?? 1;
  const canAdd = !!selectedSize && (selectedSizeInfo?.stock ?? 0) > 0;

  const handleAdd = () => {
    if (!selectedSize || !canAdd) return;
    cart.add({
      productId: product.id,
      name: product.name,
      image: product.image,
      size: selectedSize,
      price: product.price,
      qty,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const result = await shareProduct(product.name, url);
    if (result === "copied") {
      setShareFeedback("Link copiado!");
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-6 sm:pt-8">
        <nav className="flex items-center text-xs sm:text-sm text-muted-foreground gap-1 flex-wrap">
          <Link href="/">
            <span className="hover:text-primary cursor-pointer">Início</span>
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/colecao">
            <span className="hover:text-primary cursor-pointer">Coleção</span>
          </Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="hover:text-primary">{category.label}</span>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate max-w-[180px] sm:max-w-none">
            {product.name}
          </span>
        </nav>
      </div>

      <section className="container mx-auto px-4 py-6 sm:py-10">
        <Link href="/colecao">
          <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar pra coleção
          </button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* GALERIA */}
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden">
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Novo
                </span>
              )}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-md text-primary hover:text-primary/80 transition"
                aria-label="Compartilhar produto"
                title="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
              </button>
              {shareFeedback && (
                <div className="absolute top-16 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-fade-in-up">
                  {shareFeedback}
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border-2 transition",
                      activeImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={src} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            {category && (
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-foreground mb-2">
                {category.label}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.installments && (
                <span className="text-sm text-muted-foreground">ou {product.installments}</span>
              )}
            </div>

            <p className="mt-5 text-foreground/80 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            {/* TAMANHOS */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">
                  Tamanho{selectedSize ? `: ${selectedSize}` : ""}
                </h3>
                <SizeGuideModal />
              </div>
              {product.sizes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Tamanhos não cadastrados. Consulte pelo WhatsApp.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const out = s.stock <= 0;
                    const active = selectedSize === s.size;
                    return (
                      <button
                        key={s.size}
                        onClick={() => {
                          if (out) return;
                          setSelectedSize(s.size);
                          setQty(1);
                        }}
                        disabled={out}
                        className={cn(
                          "min-w-[52px] px-4 py-2 rounded-full border text-sm font-bold transition",
                          out
                            ? "bg-muted text-muted-foreground/50 border-border cursor-not-allowed line-through"
                            : active
                              ? "bg-primary text-white border-primary shadow"
                              : "bg-white text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                        )}
                        title={out ? "Esgotado" : `${s.stock} em estoque`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedSizeInfo && (
                <p
                  className={cn(
                    "mt-2 text-xs",
                    selectedSizeInfo.stock <= 2 ? "text-amber-700" : "text-muted-foreground"
                  )}
                >
                  {selectedSizeInfo.stock} em estoque
                </p>
              )}
              {!selectedSize && totalStock === 0 && (
                <p className="mt-2 text-xs text-destructive font-bold">Produto sem estoque</p>
              )}
            </div>

            {/* QTY + ADD */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <div className="inline-flex items-center border border-border rounded-full self-start">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="p-3 disabled:opacity-30 hover:text-primary"
                  aria-label="Diminuir"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={!canAdd || qty >= maxQty}
                  className="p-3 disabled:opacity-30 hover:text-primary"
                  aria-label="Aumentar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAdd}
                disabled={!canAdd}
                className={cn(
                  "flex-1 rounded-full h-12 font-bold text-base transition",
                  justAdded
                    ? "bg-emerald-600 hover:bg-emerald-600"
                    : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                )}
              >
                {justAdded ? (
                  <>
                    <Check className="h-5 w-5" />
                    Adicionado
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {selectedSize ? "Adicionar ao carrinho" : "Selecione um tamanho"}
                  </>
                )}
              </Button>
            </div>

            {/* COMPARTILHAR */}
            <button
              onClick={handleShare}
              className="mt-3 inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary font-bold"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar este produto
            </button>

            {/* DETALHES */}
            {product.details && product.details.length > 0 && (
              <div className="mt-8 border-t border-border/40 pt-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground mb-3">
                  Detalhes
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
