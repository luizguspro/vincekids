import { useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

function formatPrice(n: number) {
  return "R$ " + n.toFixed(2).replace(".", ",");
}

export default function ProductCarousel() {
  const products = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum produto cadastrado ainda. Cadastre em{" "}
        <Link href="/admin">
          <code className="bg-muted px-2 py-1 rounded hover:bg-primary/10 cursor-pointer">/admin</code>
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        onClick={() => scroll("left")}
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        onClick={() => scroll("right")}
        aria-label="Próximo"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-8 px-1 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => {
          const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
          const out = totalStock === 0 && product.sizes.length > 0;
          return (
            <Link key={product.id} href={`/produto/${product.id}`}>
              <article className="min-w-[220px] sm:min-w-[260px] md:min-w-[300px] bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 snap-center group/card border border-border/40 cursor-pointer overflow-hidden flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                  />
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm">
                      Novo
                    </span>
                  )}
                  {out && (
                    <span className="absolute bottom-3 left-3 bg-white/95 text-destructive text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow">
                      Esgotado
                    </span>
                  )}
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg sm:text-xl text-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <span className="text-base sm:text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.installments && (
                    <p className="text-[11px] sm:text-xs text-muted-foreground mb-3">
                      {product.installments}
                    </p>
                  )}
                  <Button
                    asChild
                    className="mt-auto w-full bg-secondary/10 text-secondary-foreground hover:bg-secondary hover:text-white font-bold rounded-xl transition-colors text-sm sm:text-base"
                  >
                    <span>Ver detalhes</span>
                  </Button>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
