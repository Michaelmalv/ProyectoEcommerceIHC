import { Link } from "react-router";
import { ArrowRight, Shield, Truck, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { categories } from "../data/products";

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section - Nielsen #2: Relación sistema-mundo real */}
      <section
        className="bg-white border-2 border-gray-300 p-8 md:p-12 mb-12"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-2xl">
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenido a CrowStore
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Descubre nuestra colección de ropa. Moda accesible, cómoda y para todos.
          </p>
          <Link to="/catalogo">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
              aria-label="Ver catálogo completo de productos"
            >
              Ver catálogo
              <ArrowRight className="ml-2" size={20} aria-hidden="true" />
            </Button>
          </Link>
        </div>
        {/* Wireframe placeholder para imagen */}
        <div
          className="mt-8 border-2 border-dashed border-gray-400 h-48 flex items-center justify-center bg-gray-100"
          role="img"
          aria-label="Imagen promocional de productos destacados"
        >
          <span className="text-gray-500">[Imagen hero - 1200x400px]</span>
        </div>
      </section>

      {/* Categories - Nielsen #6: Reconocimiento antes que recuerdo */}
      <section aria-labelledby="categories-heading" className="mb-12">
        <h2 id="categories-heading" className="text-2xl font-bold mb-6">
          Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/catalogo?categoria=${category.slug}`}
              className="focus:outline-none focus:ring-2 focus:ring-black"
              aria-label={`Ver ${category.name}, ${category.count} productos disponibles`}
            >
              <Card className="p-6 hover:border-black transition-colors cursor-pointer border-2">
                {/* WCAG Perceptibilidad: Imagen con texto alternativo */}
                <div className="border-2 border-gray-300 h-32 mb-4 flex items-center justify-center bg-gray-50 overflow-hidden">
                  <img
                    src={
                      category.slug === "camisetas"
                        ? "https://placehold.co/300x200/2a2a2a/ffffff?text=Camisetas"
                        : category.slug === "pantalones"
                        ? "https://placehold.co/300x200/2E5090/ffffff?text=Pantalones"
                        : category.slug === "vestidos"
                        ? "https://placehold.co/300x200/87CEEB/1a1a1a?text=Vestidos"
                        : "https://placehold.co/300x200/4682B4/ffffff?text=Chaquetas"
                    }
                    alt={`Categoría de ${category.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-600" aria-label={`${category.count} productos`}>
                  {category.count} productos
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features - Nielsen #10: Ayuda y documentación visible */}
      <section
        aria-labelledby="features-heading"
        className="bg-white border-2 border-gray-300 p-8"
      >
        <h2 id="features-heading" className="text-2xl font-bold mb-6 text-center">
          ¿Por qué comprar en CrowStore?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                {/* WCAG Perceptibilidad: Iconos decorativos con aria-hidden */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
                    <Icon size={32} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section - Nielsen #7: Flexibilidad y eficiencia */}
      <section className="mt-12 text-center bg-gray-100 border-2 border-gray-300 p-8">
        <h2 className="text-2xl font-bold mb-4">
          ¿Necesitas ayuda para elegir?
        </h2>
        <p className="text-gray-700 mb-6">
          Consulta nuestra guía de tallas o contacta con nuestro equipo de soporte.
        </p>
        <Link to="/ayuda">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-black hover:bg-black hover:text-white focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Ver ayuda
          </Button>
        </Link>
      </section>
    </div>
  );
}
