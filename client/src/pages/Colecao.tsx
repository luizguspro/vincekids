import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SlidersHorizontal } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { categories, type CategorySlug } from "@/data/products";
import { cn } from "@/lib/utils";

type Filter = "all" | CategorySlug;

function formatPrice(n: number) {
  return "R$ " + n.toFixed(2).replace(".", ",");
}

export default function Colecao() {
  const products = useProducts();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter, products]
  );

  const chips: { value: Filter; label: string }[] = [
    { value: "all", label: "Todos" },
    ...categories.map((c) => ({ value: c.slug as Filter, label: c.label })),
  ];

  return (
    <Layout>
      <section className="bg-[#FDFDFD] py-10 md:py-16 border-b border-border/40">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary leading-tight">
            Nossa Coleção
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-base sm:text-lg">
            Todas as peças num lugar só. Filtre por categoria pra achar mais rápido.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-start gap-3 flex-wrap">
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-sm font-bold pt-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrar:
            </div>
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => {
                const active = filter === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setFilter(c.value)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold border transition-all",
                      active
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
          </p>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              Nenhum produto nessa categoria ainda.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((product) => {
                const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
                const out = totalStock === 0 && product.sizes.length > 0;
                return (
                  <Link key={product.id} href={`/produto/${product.id}`}>
                    <article className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group/card border border-border/40 overflow-hidden flex flex-col cursor-pointer h-full">
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

                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <h3 className="font-display text-base sm:text-lg text-foreground mb-1 line-clamp-2">
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
                          size="sm"
                          className="mt-auto w-full bg-secondary/10 text-secondary-foreground hover:bg-secondary hover:text-white font-bold rounded-xl"
                        >
                          <span>Ver detalhes</span>
                        </Button>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
