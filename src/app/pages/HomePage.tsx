import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Shield, Truck, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../components/ui/carousel";
import { categories } from "../data/products";
import { brandLogoUrl, categoryImageUrls, heroBannerUrl } from "../data/brandAssets";

/**
 * ANÁLISIS HEURÍSTICO APLICADO:
 *
 * Nielsen #1: Visibilidad del estado del sistema
 * - Indicadores claros de categorías disponibles
 * - Feedback visual en hover de elementos interactivos
 *
 * Nielsen #8: Diseño estético y minimalista
 * - Prototipo de baja fidelidad: wireframe con estructura clara
 * - Sin elementos decorativos innecesarios
 *
 * WCAG 2.2 - Comprensibilidad:
 * - Lenguaje claro y directo
 * - Jerarquía visual mediante tamaños de texto
 */

export function HomePage() {
  const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi>();
  const [heroCurrentSlide, setHeroCurrentSlide] = useState(0);

  const heroSlides = [
    {
      src: "https://hggvambaspxwfekileaz.supabase.co/storage/v1/object/public/products/branding/outfit1.png",
      alt: "Banner promocional de CrowStore",
    },
    {
      src: "https://hggvambaspxwfekileaz.supabase.co/storage/v1/object/public/products/branding/outfit2.png",
      alt: "Colección destacada de camisetas",
    },
    {
      src: "https://hggvambaspxwfekileaz.supabase.co/storage/v1/object/public/products/branding/outfit3.png",
      alt: "Colección destacada de pantalones",
    },
    {
      src: "https://hggvambaspxwfekileaz.supabase.co/storage/v1/object/public/products/branding/outfit4.png",
      alt: "Colección destacada de vestidos",
    },
  ];

  useEffect(() => {
    if (!heroCarouselApi) return;

    const onSelect = () => {
      setHeroCurrentSlide(heroCarouselApi.selectedScrollSnap());
    };

    onSelect();
    heroCarouselApi.on("select", onSelect);
    heroCarouselApi.on("reInit", onSelect);

    return () => {
      heroCarouselApi.off("select", onSelect);
      heroCarouselApi.off("reInit", onSelect);
    };
  }, [heroCarouselApi]);

  useEffect(() => {
    if (!heroCarouselApi) return;

    const interval = setInterval(() => {
      heroCarouselApi.scrollNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [heroCarouselApi]);

  const features = [
    {
      icon: Truck,
      title: "Envío gratis",
      description: "En pedidos superiores a 50€",
    },
    {
      icon: Clock,
      title: "Entrega rápida",
      description: "2-3 días laborables",
    },
    {
      icon: Shield,
      title: "Compra segura",
      description: "Pago 100% protegido",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section - Nielsen #2: Relación sistema-mundo real */}
      <section
        className="relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,250,244,0.96),rgba(235,218,198,0.92))] p-6 shadow-[0_30px_80px_-48px_rgba(24,18,15,0.6)] md:p-10"
        aria-labelledby="hero-heading"
      >
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(168,111,67,0.18),transparent_70%)] blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground shadow-sm">
              Editorial fashion store
            </div>
            <h1 id="hero-heading" className="font-display text-4xl leading-[0.95] tracking-tight text-foreground md:text-6xl">
              Explora una tienda con presencia de marca real.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              CrowStore combina un catálogo navegable, flujos claros y una estética más finalista para parecer un producto listo para revisión.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/catalogo">
                <Button
                  size="lg"
                  aria-label="Ver catálogo completo de productos"
                >
                  Ver catálogo
                  <ArrowRight className="ml-2" size={20} aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/ayuda">
                <Button variant="outline" size="lg">
                  Ver guía de tallas
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="font-semibold text-foreground">{feature.title}</p>
                  <p className="mt-1 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 top-8 z-10 rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-2 text-sm font-semibold shadow-lg">
              Nueva colección
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white shadow-[0_24px_70px_-36px_rgba(24,18,15,0.6)]">
              <Carousel
                setApi={setHeroCarouselApi}
                opts={{ loop: true }}
                className="w-full"
                aria-label="Carrusel de imágenes destacadas"
              >
                <CarouselContent className="-ml-0">
                  {heroSlides.map((slide) => (
                    <CarouselItem key={slide.alt} className="pl-0">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="h-[28rem] w-full object-cover"
                        loading={slide.alt === heroSlides[0].alt ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={slide.alt === heroSlides[0].alt ? "high" : "auto"}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 border-[color:var(--border)] bg-white/90" />
                <CarouselNext className="right-3 border-[color:var(--border)] bg-white/90" />
              </Carousel>
            </div>
            <div className="mt-4 flex justify-center gap-2" aria-label="Indicadores del carrusel">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.alt}
                  type="button"
                  onClick={() => heroCarouselApi?.scrollTo(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    heroCurrentSlide === index
                      ? "bg-foreground"
                      : "bg-[color:var(--border)] hover:bg-muted-foreground"
                  }`}
                  aria-label={`Ir a la imagen ${index + 1}`}
                  aria-current={heroCurrentSlide === index}
                />
              ))}
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-[1.5rem] border border-[color:var(--border)] bg-white/92 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Look destacado</p>
                  <p className="font-semibold text-foreground">Texturas neutras, cortes limpios y navegación rápida.</p>
                </div>
                <img
                  src={brandLogoUrl}
                  alt="Logo de CrowStore"
                  className="h-14 w-14 rounded-full border border-[color:var(--border)] object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Nielsen #6: Reconocimiento antes que recuerdo */}
      <section aria-labelledby="categories-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="categories-heading" className="font-display text-3xl tracking-tight">
              Categorías
            </h2>
            <p className="mt-2 text-muted-foreground">Accesos directos con jerarquía visual clara y tarjetas más refinadas.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/catalogo?categoria=${category.slug}`}
              className="group focus:outline-none focus:ring-2 focus:ring-black"
              aria-label={`Ver ${category.name}, ${category.count} productos disponibles`}
            >
              <Card className="overflow-hidden p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-40px_rgba(24,18,15,0.55)]">
                {/* WCAG Perceptibilidad: Imagen con texto alternativo */}
                <div className="mb-4 h-40 overflow-hidden rounded-[1.25rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(243,232,219,0.95))]">
                  <img
                    src={categoryImageUrls[category.slug as keyof typeof categoryImageUrls]}
                    alt={`Categoría de ${category.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl tracking-tight">{category.name}</h3>
                    <p className="text-sm text-muted-foreground" aria-label={`${category.count} productos`}>
                      {category.count} productos
                    </p>
                  </div>
                  <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Explorar
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features - Nielsen #10: Ayuda y documentación visible */}
      <section
        aria-labelledby="features-heading"
        className="rounded-[2rem] border border-[color:var(--border)] bg-white/85 p-6 shadow-[0_20px_60px_-42px_rgba(24,18,15,0.5)] md:p-8"
      >
        <h2 id="features-heading" className="font-display text-3xl text-center tracking-tight">
          ¿Por qué comprar en CrowStore?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="rounded-[1.5rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,236,226,0.82))] p-6 text-center shadow-sm">
                {/* WCAG Perceptibilidad: Iconos decorativos con aria-hidden */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--border)] bg-white shadow-sm">
                    <Icon size={32} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="font-display text-2xl mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section - Nielsen #7: Flexibilidad y eficiencia */}
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(24,18,15,0.96),rgba(77,55,40,0.92))] p-8 text-center text-white shadow-[0_28px_80px_-46px_rgba(24,18,15,0.75)] md:p-10">
        <h2 className="font-display text-3xl mb-4 tracking-tight text-white">
          ¿Necesitas ayuda para elegir?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-white/80">
          Consulta nuestra guía de tallas o contacta con nuestro equipo de soporte.
        </p>
        <Link to="/ayuda">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            Ver ayuda
          </Button>
        </Link>
      </section>
    </div>
  );
}
