import { useEffect, useMemo, useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryCard, setActiveCategoryCard] = useState<string | null>(null);

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

  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const filteredFaqs = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return faqs;

    return faqs.filter((faq) => {
      const haystack = normalizeText(`${faq.category} ${faq.question} ${faq.answer}`);
      return haystack.includes(query);
    });
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return categories;

    return categories.filter((category) => {
      const haystack = normalizeText(`${category.title} ${category.description}`);
      return haystack.includes(query);
    });
  }, [searchQuery]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = normalizeText(searchQuery);
    if (!query) return;

    const categoryMatch = categories.find((category) =>
      normalizeText(category.title).includes(query)
    );

    if (categoryMatch) {
      setActiveCategoryCard(normalizeText(categoryMatch.title));
      scrollToSection(normalizeText(categoryMatch.title));
      return;
    }

    const faqMatch = filteredFaqs[0];
    if (faqMatch) {
      scrollToSection("preguntas-frecuentes");
    }
  };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogBody, setDialogBody] = useState("");

    const openFullText = (title: string, body: string) => {
      setDialogTitle(title);
      setDialogBody(body);
      setDialogOpen(true);
    };

  const categorySections = [
    {
      id: "envios",
      title: "Envíos",
      summary: "Pedidos estándar en 2-3 días laborables. En pedidos superiores a $50, el envío es gratuito.",
      details: "Si tu pedido supera el monto mínimo, el envío se activa automáticamente sin costo adicional. Siempre enviamos confirmación y seguimiento por correo.",
      highlights: ["Seguimiento por email", "Entregas 2-3 días", "Envío gratis desde $50"],
    },
    {
      id: "pagos",
      title: "Pagos",
      summary: "Aceptamos tarjetas de crédito y débito. Todos los pagos están protegidos con cifrado SSL.",
      details: "El cobro se procesa con pasarela segura. Aceptamos las principales tarjetas y no almacenamos los datos sensibles en texto plano.",
      highlights: ["Visa", "Mastercard", "American Express"],
    },
    {
      id: "devoluciones",
      title: "Devoluciones",
      summary: "Tienes 30 días para devolver artículos sin usar y con etiquetas originales.",
      details: "Las devoluciones aplican únicamente a productos en buen estado. Puedes solicitar un cambio o reembolso dentro del plazo establecido.",
      highlights: ["30 días", "Producto sin uso", "Devolución gratuita"],
    },
    {
      id: "cuenta",
      title: "Cuenta",
      summary: "Gestiona tu perfil, contraseña y datos personales desde tu cuenta.",
      details: "Desde tu cuenta puedes actualizar datos de contacto, revisar pedidos y cambiar tu contraseña cuando lo necesites.",
      highlights: ["Cambiar contraseña", "Editar perfil", "Datos de contacto"],
    },
  ];

  const toggleCategoryCard = (sectionId: string) => {
    setActiveCategoryCard((current) => (current === sectionId ? null : sectionId));
    scrollToSection(sectionId);
  };

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

      {searchQuery.trim() && (
        <p className="mb-4 text-sm text-gray-600">
          Mostrando resultados para <span className="font-bold">{searchQuery}</span>: {filteredFaqs.length} preguntas y {filteredCategories.length} categorías.
        </p>
      )}

      {/* Guía de tallas: accesible desde páginas de producto */}
      <Card className="p-6 border-2 mb-8">
        <h2 className="text-2xl font-bold mb-3">Guía de tallas</h2>
        <p className="text-gray-700">
          Las guías de tallas completas están disponibles en cada página de producto (pulsa "Guía de tallas").
        </p>
      </Card>

      {/* Secciones principales de ayuda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const section = categorySections.find((item) => item.id === normalizeText(category.title));

          return (
            <Card
              key={category.title}
              className="group h-56 cursor-pointer border-2 border-gray-300 bg-transparent p-0 [perspective:1200px] scroll-mt-24"
              tabIndex={0}
              role="button"
              aria-label={`Abrir la tarjeta de ${category.title}`}
              aria-pressed={activeCategoryCard === normalizeText(category.title)}
              onClick={() => toggleCategoryCard(normalizeText(category.title))}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleCategoryCard(normalizeText(category.title));
                }
              }}
            >
              <div
                className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  activeCategoryCard === normalizeText(category.title) ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <div className="absolute inset-0 rounded-xl border-2 border-gray-300 bg-white p-6 [backface-visibility:hidden]">
                  <Icon size={32} className="mb-3" aria-hidden="true" />
                  <h3 className="font-bold mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600">
                    {category.description.length > 60 ? `${category.description.slice(0,60)}` : category.description}
                    {category.description.length > 60 && (
                      <button
                        onClick={() => openFullText(category.title, category.description)}
                        className="ml-2 text-xs font-semibold text-primary underline"
                        aria-label={`Ver más sobre ${category.title}`}
                      >
                        Ver más
                      </button>
                    )}
                  </p>
                </div>

                <div className="absolute inset-0 rounded-xl border-2 border-black bg-black p-6 text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <h3 className="font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-100 mb-3">
                    {section?.details ? (section.details.length > 100 ? `${section.details.slice(0,100)}` : section.details) : category.description}
                    {section?.details && section.details.length > 100 && (
                      <button
                        onClick={() => openFullText(section.title || category.title, section.details)}
                        className="ml-2 text-xs font-semibold underline"
                        aria-label={`Ver más detalles de ${category.title}`}
                      >
                        Ver más
                      </button>
                    )}
                  </p>
                  <ul className="text-sm space-y-1 text-gray-100">
                    {(section?.highlights || [category.description]).slice(0,3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search - Nielsen #7: Flexibilidad */}
      <Card className="p-6 border-2 mb-8">
        <form className="flex gap-2" onSubmit={handleSearchSubmit}>
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar en ayuda..."
              className="pl-10"
              aria-label="Buscar en el centro de ayuda"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            Buscar
          </Button>
        </form>
      </Card>

      {searchQuery.trim() && filteredFaqs.length === 0 && filteredCategories.length === 0 && (
        <Card className="p-6 border-2 mb-8">
          <p className="text-gray-700">No encontramos coincidencias para tu búsqueda.</p>
        </Card>
      )}

      {/* FAQs - WCAG Operabilidad: Accordion accesible */}
      <Card id="preguntas-frecuentes" className="p-6 border-2 mb-8">
        <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="text-gray-700 whitespace-pre-line">{dialogBody}</p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
