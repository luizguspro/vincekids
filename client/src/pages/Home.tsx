import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ProductCarousel from "@/components/ProductCarousel";
import FAQSection from "@/components/FAQSection";
import { ArrowRight, Heart, Gift, Camera, Star, Sparkles } from "lucide-react";

const MIMOS = [
  {
    img: "/images/coloring-safari-jeep.jpg",
    tag: "Jipe Safari",
    title: "Desenhos Temáticos",
    desc: "Jipe Safari e Monster Truck prontos para colorir. Estimule a criatividade!",
    accent: "secondary" as const,
  },
  {
    img: "/images/kids-drawing-moment.jpg",
    tag: "Momentos",
    title: "Registre e Compartilhe",
    desc: "Registre esse momento artístico e compartilhe a aventura com a gente!",
    accent: "primary" as const,
  },
];

export default function Home() {
  return (
    <Layout>
      {/* 1. HERO */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#FDFDFD]">
        <div
          className="absolute inset-0 z-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage: 'url("/images/hero-bg-watercolor.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <img
          src="/images/toy-plane-watercolor.png"
          alt=""
          aria-hidden
          className="absolute top-[8%] right-[3%] w-24 sm:w-40 md:w-64 opacity-80 animate-float-slow z-10"
        />
        <img
          src="/images/toy-top-watercolor.png"
          alt=""
          aria-hidden
          className="absolute bottom-[12%] left-[3%] w-20 sm:w-32 md:w-48 opacity-70 animate-float-delayed z-10"
        />

        <div className="container relative z-20 px-4 py-10 sm:py-12 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm tracking-wide animate-fade-in-up">
              ✨ Nova Coleção Disponível
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-primary leading-tight drop-shadow-sm animate-fade-in-up delay-100">
              A sua loja online favorita para os looks do seu pequeno!
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Moda, qualidade e carinho para meninos do 1 ao 10.
            </p>

            <div className="pt-4 sm:pt-8 animate-fade-in-up delay-300">
              <Link href="/colecao">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base sm:text-lg px-6 sm:px-10 py-6 sm:py-8 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-bold group">
                  Ver Coleção Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-12 watercolor-edge z-20 bg-white"></div>
      </section>

      {/* 1.5 VITRINE */}
      <section className="py-14 sm:py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-secondary/10 text-secondary-foreground font-bold text-xs sm:text-sm tracking-wide mb-3 sm:mb-4">
              <Sparkles className="h-4 w-4" />
              Favoritos da Estação
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-primary mb-3 sm:mb-4">
              Looks que Amamos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Peças selecionadas com carinho para deixar seu pequeno estiloso e confortável.
            </p>
          </div>

          <ProductCarousel />

          <div className="text-center mt-10 sm:mt-12">
            <Link href="/colecao">
              <Button
                variant="link"
                className="text-primary font-bold text-base sm:text-lg hover:text-primary/80 underline-offset-4"
              >
                Ver toda a coleção &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EMBALADO COM CARINHO */}
      <section className="py-16 sm:py-24 bg-[#FDFDFD] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] sm:rounded-[3rem] rotate-3 transform scale-95 z-0"></div>
              <div className="relative bg-white p-3 sm:p-4 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl z-10 rotate-0 hover:rotate-1 transition-transform duration-500">
                <img
                  src="/images/boy-fashion-hero.jpg"
                  alt="Criança feliz com roupa Vince Kids"
                  className="w-full h-[320px] sm:h-[420px] md:h-[500px] object-cover rounded-[2rem] sm:rounded-[2.5rem]"
                />
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-2xl shadow-lg flex items-center gap-2 sm:gap-3 animate-bounce-slow">
                  <div className="bg-primary/20 p-2 sm:p-3 rounded-full text-primary">
                    <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase">Embalado com</p>
                    <p className="text-primary font-display text-lg sm:text-xl">Amor</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 text-secondary-foreground font-bold uppercase tracking-wider text-xs sm:text-sm">
                <span className="w-8 h-[2px] bg-secondary"></span>
                Experiência Unboxing
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-primary leading-tight">
                Receba um Look Embalado com Carinho
              </h2>

              <div className="bg-[#F9F9F9] p-6 sm:p-8 rounded-3xl border border-dashed border-primary/20 relative">
                <div className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground px-3 sm:px-4 py-1 rounded-full font-display text-base sm:text-lg shadow-md rotate-[-5deg]">
                  OBA!
                </div>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed italic">
                  "Você acaba de adquirir um produto de qualidade que foi embalado com todo carinho
                  que sua criança merece. Nossa missão é entregar não só moda, mas momentos de
                  felicidade e cuidado."
                </p>
              </div>

              <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
                <div className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-primary/5 rounded-2xl w-28 sm:w-32">
                  <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-primary fill-primary/20" />
                  <span className="text-xs sm:text-sm font-bold text-primary">Cuidado</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-secondary/10 rounded-2xl w-28 sm:w-32">
                  <Star className="h-7 w-7 sm:h-8 sm:w-8 text-secondary-foreground fill-secondary/20" />
                  <span className="text-xs sm:text-sm font-bold text-secondary-foreground">Qualidade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MIMOS */}
      <section className="py-16 sm:py-24 bg-[#FDFDFD] relative">
        <img
          src="/images/toy-scooter-watercolor.png"
          alt=""
          aria-hidden
          className="absolute top-10 left-0 w-32 sm:w-48 opacity-10 -scale-x-100 pointer-events-none"
        />

        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-primary mb-4 sm:mb-6">
            A Diversão Começa Antes de Vestir!
          </h2>

          <p className="text-base sm:text-xl text-muted-foreground mb-10 sm:mb-16 max-w-2xl mx-auto">
            Cada pedido Vince Kids é uma surpresa! Incluímos mimos especiais para o seu pequeno.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {MIMOS.map((c) => (
              <div
                key={c.title}
                className="group bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-secondary/50 relative overflow-hidden"
              >
                <div
                  className={
                    c.accent === "secondary"
                      ? "absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-secondary/10 rounded-bl-[100%] -mr-6 sm:-mr-10 -mt-6 sm:-mt-10 transition-transform group-hover:scale-110"
                      : "absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-primary/10 rounded-bl-[100%] -mr-6 sm:-mr-10 -mt-6 sm:-mt-10 transition-transform group-hover:scale-110"
                  }
                ></div>

                <div className="h-40 sm:h-48 bg-gray-100 rounded-2xl mb-5 sm:mb-6 overflow-hidden relative">
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                    <span className="bg-white/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                      {c.tag}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">{c.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF */}
      <section className="py-16 sm:py-24 bg-secondary/10 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-3 sm:p-4 bg-white rounded-full shadow-md mb-5 sm:mb-6 animate-bounce-slow">
            <Camera className="h-7 w-7 sm:h-8 sm:w-8 text-secondary-foreground" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display text-primary mb-4 sm:mb-6">
            Somos Família!
          </h2>

          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            "Muito obrigado pela sua compra. Esperamos que vocês tenham gostado! Registre esse
            momento e marque nosso Instagram, vamos amar repostar os looks do seu pequeno!"
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-10 sm:mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer bg-white p-2"
              >
                <img
                  src={"/images/social-proof-" + i + ".jpg"}
                  alt={"Cliente Vince Kids " + i}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="bg-white text-primary hover:bg-primary hover:text-white border-2 border-primary text-sm sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold transition-all shadow-sm hover:shadow-lg whitespace-normal text-center"
          >
            Siga-nos no Instagram @vince_kids
          </Button>
        </div>
      </section>

      {/* 5. FAQ */}
      <FAQSection />
    </Layout>
  );
}
