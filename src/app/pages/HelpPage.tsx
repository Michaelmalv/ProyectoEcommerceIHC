import { useEffect } from "react";
import { Search, HelpCircle, Truck, CreditCard, RefreshCw } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #10: Ayuda y documentación
 * - FAQs organizadas por categorías
 * - Buscador de ayuda disponible
 * - Información de contacto visible
 *
 * WCAG 2.2 - Comprensibilidad:
 * - Lenguaje claro y directo
 * - Respuestas estructuradas y fáciles de leer
 * - Accordion accesible por teclado
 */

export function HelpPage() {
  const categories = [
    {
      icon: Truck,
      title: "Envíos",
      description: "Información sobre entregas y plazos",
    },
    {
      icon: CreditCard,
      title: "Pagos",
      description: "Métodos de pago y facturación",
    },
    {
      icon: RefreshCw,
      title: "Devoluciones",
      description: "Política de devoluciones y cambios",
    },
    {
      icon: HelpCircle,
      title: "Cuenta",
      description: "Gestión de tu perfil",
    },
  ];

  const faqs = [
    {
      category: "envios",
      question: "¿Cuánto tarda el envío?",
      answer:
        "Los envíos estándar tardan entre 2-3 días laborables. Para pedidos superiores a $50, el envío es gratuito.",
    },
    {
      category: "envios",
      question: "¿Puedo rastrear mi pedido?",
      answer:
        "Sí, una vez que tu pedido sea enviado, recibirás un email con el número de seguimiento para rastrear tu envío.",
    },
    {
      category: "pagos",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express). Todos los pagos están protegidos con cifrado SSL.",
    },
    {
      category: "devoluciones",
      question: "¿Cuál es la política de devoluciones?",
      answer:
        "Tienes 30 días desde la recepción del pedido para devolver cualquier artículo. El producto debe estar sin usar y con las etiquetas originales. Las devoluciones son gratuitas.",
    },
    {
      category: "cuenta",
      question: "¿Cómo cambio mi contraseña?",
      answer:
        "Ve a Mi Perfil > Configuración > Cambiar contraseña. Necesitarás tu contraseña actual para establecer una nueva.",
    },
    {
      category: "tallas",
      question: "¿Cómo sé mi talla correcta?",
      answer:
        "En cada página de producto encontrarás un enlace a nuestra guía de tallas. Incluye medidas detalladas para cada prenda. Si tienes dudas, contacta con nuestro equipo de soporte.",
    },
  ];

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ayuda</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-2">Centro de ayuda</h1>
      <p className="text-gray-600 mb-8">
        Encuentra respuestas a tus preguntas o contacta con nuestro equipo
      </p>

      {/* Search - Nielsen #7: Flexibilidad */}
      <Card className="p-6 border-2 mb-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar en ayuda..."
              className="pl-10 border-2 focus:ring-2 focus:ring-black"
              aria-label="Buscar en el centro de ayuda"
            />
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">
            Buscar
          </Button>
        </div>
      </Card>

      {/* Categories - Nielsen #6: Reconocimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card
              key={index}
              className="p-6 border-2 hover:border-black transition-colors cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`Ver ayuda sobre ${category.title}`}
            >
              <Icon size={32} className="mb-3" aria-hidden="true" />
              <h3 className="font-bold mb-1">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </Card>
          );
        })}
      </div>

      {/* FAQs - WCAG Operabilidad: Accordion accesible */}
      <Card id="preguntas-frecuentes" className="p-6 border-2 mb-8">
        <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-bold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Contact - Nielsen #10 */}
      <Card className="p-8 border-2 text-center">
        <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
        <p className="text-gray-600 mb-6">
          Nuestro equipo de atención al cliente está disponible para ayudarte
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="text-left overflow-hidden">
            <p className="font-bold mb-1">Email</p>
            <a
              href="mailto:michael2230@gmail.com"
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-black break-all text-sm sm:text-base"
            >
              michael2230@gmail.com
            </a>
          </div>
          <div className="text-left overflow-hidden">
            <p className="font-bold mb-1">Teléfono</p>
            <a
              href="tel:+593979246567"
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-black whitespace-nowrap text-sm sm:text-base"
            >
              +593 0979246567
            </a>
          </div>
          <div className="text-left">
            <p className="font-bold mb-1">Horario</p>
            <p className="text-gray-600">L-V: 9:00 - 18:00</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
