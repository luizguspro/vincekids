import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Menu,
  X,
  Home as HomeIcon,
  Shirt,
  Settings,
  Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof HomeIcon;
}

const NAV: NavItem[] = [
  { href: "/", label: "Início", icon: HomeIcon },
  { href: "/colecao", label: "Coleção", icon: Shirt },
];

const INSTAGRAM_URL = "https://instagram.com/vince_kids";

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const cart = useCart();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary shrink-0"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group min-w-0">
              <img
                src="/images/boy-blocks-icon.png"
                alt="Vince Kids Icon"
                className="h-8 sm:h-10 w-auto transition-transform group-hover:rotate-3 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-primary leading-none truncate">
                  Vince Kids
                </h1>
                <span className="hidden sm:inline text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase font-sans font-bold">
                  Moda para Meninos
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                <span
                  className={cn(
                    "font-semibold transition-colors cursor-pointer",
                    location === n.href
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {n.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={cart.open}
              className="relative p-2 text-primary hover:bg-primary/10 rounded-full"
              aria-label={`Carrinho com ${cart.count} ${cart.count === 1 ? "item" : "itens"}`}
            >
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              {cart.count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                  {cart.count > 99 ? "99+" : cart.count}
                </span>
              )}
            </button>
            <Link href="/colecao" className="hidden md:block">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full px-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Ver Coleção
              </Button>
            </Link>
          </div>
        </div>

        {/* Drawer mobile */}
        <div
          className={cn(
            "md:hidden fixed inset-0 z-50 transition-opacity",
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className={cn(
              "absolute top-0 left-0 h-full w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out",
              menuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Header com logo */}
            <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent p-5 pb-6 relative">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-foreground/70 hover:text-foreground shadow-sm"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <img
                  src="/images/boy-blocks-icon.png"
                  alt="Vince Kids"
                  className="h-12 w-auto"
                />
                <div className="flex flex-col">
                  <span className="font-display text-2xl text-primary leading-none">
                    Vince Kids
                  </span>
                  <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold mt-1">
                    Moda para Meninos
                  </span>
                </div>
              </div>
            </div>

            {/* Navegação principal */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70 px-3 mb-2">
                Loja
              </p>
              <ul className="space-y-1">
                {NAV.map((n) => {
                  const active = location === n.href;
                  const Icon = n.icon;
                  return (
                    <li key={n.href}>
                      <Link href={n.href}>
                        <span
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-base cursor-pointer transition-colors",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {n.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => {
                      cart.open();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-base text-foreground hover:bg-muted transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5 shrink-0" />
                    Carrinho
                    {cart.count > 0 && (
                      <span className="ml-auto bg-secondary text-secondary-foreground text-xs font-bold rounded-full px-2 py-0.5">
                        {cart.count}
                      </span>
                    )}
                  </button>
                </li>
              </ul>

              <div className="my-4 border-t border-border/40" />

              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70 px-3 mb-2">
                Gestão
              </p>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin">
                    <span
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-base cursor-pointer transition-colors",
                        location === "/admin"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Settings className="h-5 w-5 shrink-0" />
                      Sistema
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Rodapé do drawer */}
            <div className="p-4 border-t border-border/40 space-y-3 bg-[#FDFDFD]">
              <Link href="/colecao">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-xl h-11">
                  Ver Coleção
                </Button>
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary font-bold"
              >
                <Instagram className="h-4 w-4" />
                @vince_kids
              </a>
            </div>
          </aside>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="bg-white border-t border-border/60 pt-12 sm:pt-16 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-10 sm:mb-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <img src="/images/boy-blocks-icon.png" alt="Vince Kids" className="h-10 sm:h-12 w-auto" />
                <span className="font-display text-xl sm:text-2xl text-primary">Vince Kids</span>
              </div>
              <p className="text-muted-foreground text-sm mb-5 sm:mb-6 leading-relaxed">
                Moda, qualidade e carinho para meninos do 1 ao 10. Vestindo momentos de felicidade.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground hover:bg-secondary/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-bold text-foreground mb-4 sm:mb-6">Navegação</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm text-muted-foreground">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href}>
                      <span className="hover:text-primary transition-colors cursor-pointer">{n.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/admin">
                    <span className="hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1">
                      <Settings className="h-3 w-3" /> Sistema
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-bold text-foreground mb-4 sm:mb-6">Política de Troca</h4>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800 font-bold mb-1">Atenção</p>
                <p className="text-xs text-amber-700/80 leading-snug">
                  Troca somente com a etiqueta Vince Kids fixada na peça.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Vince Kids | Moda para meninos.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-foreground">Termos de Uso</a>
              <a href="#" className="hover:text-foreground">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
