import { Eye, Keyboard, Volume2, FileText, CheckCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

/**
 * PÁGINA DE DOCUMENTACIÓN:
 * Análisis Heurístico y Matriz de Cumplimiento WCAG 2.2
 *
 * Esta página documenta el cumplimiento del prototipo con:
 * - 10 Heurísticas de Nielsen
 * - 4 Principios WCAG 2.2 (Perceptibilidad, Operabilidad, Comprensibilidad, Robustez)
 * - Diseño de interacción funcional
 */

export function AccessibilityPage() {
  const wcagCompliance = [
    {
      principle: "Perceptibilidad",
      criterion: "1.1.1 Contenido no textual",
      implementation: "Todas las imágenes tienen texto alternativo descriptivo (aria-label)",
      status: "Cumplido",
    },
    {
      principle: "Perceptibilidad",
      criterion: "1.4.3 Contraste mínimo",
      implementation: "Contraste de texto negro sobre blanco (21:1), bordes de 2px para elementos importantes",
      status: "Cumplido",
    },
    {
      principle: "Perceptibilidad",
      criterion: "1.4.11 Contraste no textual",
      implementation: "Bordes de 2px en elementos interactivos, estados hover claramente visibles",
      status: "Cumplido",
    },
    {
      principle: "Operabilidad",
      criterion: "2.1.1 Teclado",
      implementation: "Todos los elementos interactivos accesibles por teclado (botones, links, formularios)",
      status: "Cumplido",
    },
    {
      principle: "Operabilidad",
      criterion: "2.4.1 Saltar bloques",
      implementation: "Link 'Saltar al contenido principal' visible al recibir foco",
      status: "Cumplido",
    },
    {
      principle: "Operabilidad",
      criterion: "2.4.7 Foco visible",
      implementation: "Anillo de foco visible (focus:ring-2) en todos los elementos interactivos",
      status: "Cumplido",
    },
    {
      principle: "Operabilidad",
      criterion: "2.4.8 Ubicación",
      implementation: "Breadcrumbs en todas las páginas internas para orientación",
      status: "Cumplido",
    },
    {
      principle: "Comprensibilidad",
      criterion: "3.2.4 Identificación consistente",
      implementation: "Iconos y patrones consistentes en toda la aplicación",
      status: "Cumplido",
    },
    {
      principle: "Comprensibilidad",
      criterion: "3.3.1 Identificación de errores",
      implementation: "Mensajes de error claros y específicos en formularios con role='alert'",
      status: "Cumplido",
    },
    {
      principle: "Comprensibilidad",
      criterion: "3.3.2 Etiquetas o instrucciones",
      implementation: "Labels asociados a todos los inputs, instrucciones claras en formularios",
      status: "Cumplido",
    },
    {
      principle: "Robustez",
      criterion: "4.1.2 Nombre, función, valor",
      implementation: "Estructura HTML semántica (nav, main, footer, article), roles ARIA apropiados",
      status: "Cumplido",
    },
    {
      principle: "Robustez",
      criterion: "4.1.3 Mensajes de estado",
      implementation: "aria-live='polite' para actualizaciones dinámicas (contador de productos, mensajes de confirmación)",
      status: "Cumplido",
    },
  ];

  const nielsenHeuristics = [
    {
      number: 1,
      name: "Visibilidad del estado del sistema",
      examples: [
        "Contador de artículos en el carrito (badge)",
        "Número de productos encontrados en catálogo",
        "Indicador de stock disponible en productos",
        "Actualización en tiempo real del total en carrito",
      ],
    },
    {
      number: 2,
      name: "Relación sistema-mundo real",
      examples: [
        "Proceso de checkout estructurado como compra física (contacto → envío → pago)",
        "Lenguaje natural y comprensible",
        "Iconos universalmente reconocibles",
      ],
    },
    {
      number: 3,
      name: "Control y libertad del usuario",
      examples: [
        "Breadcrumbs para navegación contextual",
        "Botón 'Volver al catálogo' en página de producto",
        "Opción de eliminar productos del carrito fácilmente",
        "Filtros que se pueden activar/desactivar",
      ],
    },
    {
      number: 4,
      name: "Consistencia y estándares",
      examples: [
        "Header y footer consistentes en todas las páginas",
        "Estilo uniforme de botones y tarjetas",
        "Patrones de navegación estándar (tabs, breadcrumbs)",
      ],
    },
    {
      number: 5,
      name: "Prevención de errores",
      examples: [
        "Botón 'Añadir al carrito' deshabilitado si no hay talla seleccionada",
        "Validación de campos requeridos en formularios",
        "Advertencia de stock limitado antes de comprar",
        "Indicadores de campos obligatorios (*)",
      ],
    },
    {
      number: 6,
      name: "Reconocimiento antes que recuerdo",
      examples: [
        "Categorías visibles en página principal",
        "Iconos que identifican secciones (carrito, perfil, ayuda)",
        "Historial de pedidos visible en perfil",
      ],
    },
    {
      number: 7,
      name: "Flexibilidad y eficiencia de uso",
      examples: [
        "Buscador de productos disponible",
        "Vista en cuadrícula o lista en catálogo",
        "Filtros para refinar resultados",
        "Accesos directos a secciones principales",
      ],
    },
    {
      number: 8,
      name: "Diseño estético y minimalista",
      examples: [
        "Prototipo wireframe sin elementos decorativos innecesarios",
        "Solo información esencial en cada página",
        "Espacio en blanco para facilitar lectura",
        "Jerarquía visual clara",
      ],
    },
    {
      number: 9,
      name: "Ayuda a reconocer y recuperar errores",
      examples: [
        "Mensajes de error específicos en formularios",
        "Indicación clara de talla agotada",
        "Sugerencias para corregir problemas (ej: falta seleccionar talla)",
      ],
    },
    {
      number: 10,
      name: "Ayuda y documentación",
      examples: [
        "Página de ayuda con FAQs organizadas",
        "Información de contacto visible en footer",
        "Guía de tallas enlazada en página de producto",
        "Mensajes de ayuda contextual (ej: CVV en checkout)",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Accesibilidad y Análisis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-2">
        Documentación de Accesibilidad y Análisis Heurístico
      </h1>
      <p className="text-gray-600 mb-8">
        CrowStore - Prototipo de baja fidelidad con cumplimiento WCAG 2.2 y análisis
        heurístico de Nielsen
      </p>

      {/* Introducción */}
      <Card className="p-6 border-2 mb-8 bg-blue-50">
        <h2 className="text-2xl font-bold mb-4">Resumen Ejecutivo</h2>
        <p className="mb-4">
          Este prototipo de baja fidelidad para CrowStore demuestra que el diseño de
          interfaces <strong>no es puramente estético</strong>, sino{" "}
          <strong>funcional, inclusivo y cognitivamente coherente</strong>.
        </p>
        <p className="mb-4">
          El prototipo integra obligatoriamente:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Análisis heurístico previo</strong> basado en las 10 Heurísticas de
            Nielsen
          </li>
          <li>
            <strong>Matriz de cumplimiento de accesibilidad</strong> según WCAG 2.2
          </li>
          <li>
            <strong>Diseño de interacción</strong> con flujo de tareas claro y
            navegación eficiente
          </li>
        </ul>
      </Card>

      {/* WCAG 2.2 Compliance Matrix */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Eye size={32} aria-hidden="true" />
          <h2 className="text-2xl font-bold">
            Matriz de Cumplimiento WCAG 2.2
          </h2>
        </div>

        <Card className="p-6 border-2 mb-6">
          <h3 className="text-xl font-bold mb-4">Los 4 Principios WCAG 2.2</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border-2 p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                1. Perceptibilidad
              </h4>
              <p className="text-sm text-gray-700">
                Alternativas textuales para iconos, imágenes con aria-label, contraste
                conceptual mediante bordes de 2px en elementos importantes.
              </p>
            </div>

            <div className="border-2 p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Keyboard className="text-green-600" size={20} />
                2. Operabilidad
              </h4>
              <p className="text-sm text-gray-700">
                Navegación completa por teclado, foco visible (focus:ring-2), skip
                links, breadcrumbs para orientación.
              </p>
            </div>

            <div className="border-2 p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <FileText className="text-green-600" size={20} />
                3. Comprensibilidad
              </h4>
              <p className="text-sm text-gray-700">
                Mensajes de ayuda claros, lenguaje sencillo, labels asociados a
                inputs, mensajes de error específicos.
              </p>
            </div>

            <div className="border-2 p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Volume2 className="text-green-600" size={20} />
                4. Robustez
              </h4>
              <p className="text-sm text-gray-700">
                Estructura semántica HTML5 (nav, main, footer), roles ARIA,
                compatible con tecnologías asistidas.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Criterios de Conformidad Implementados</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Principio</TableHead>
                  <TableHead className="font-bold">Criterio</TableHead>
                  <TableHead className="font-bold">Implementación</TableHead>
                  <TableHead className="font-bold">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wcagCompliance.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-bold">{item.principle}</TableCell>
                    <TableCell>{item.criterion}</TableCell>
                    <TableCell className="text-sm">{item.implementation}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-green-600 font-bold">
                        <CheckCircle size={16} />
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>

      {/* Nielsen Heuristics */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={32} aria-hidden="true" />
          <h2 className="text-2xl font-bold">
            Análisis Heurístico - 10 Heurísticas de Nielsen
          </h2>
        </div>

        <div className="space-y-4">
          {nielsenHeuristics.map((heuristic) => (
            <Card key={heuristic.number} className="p-6 border-2">
              <h3 className="text-lg font-bold mb-3">
                #{heuristic.number}: {heuristic.name}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {heuristic.examples.map((example, idx) => (
                  <li key={idx} className="text-sm">
                    {example}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Interaction Design */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Diseño de Interacción</h2>

        <Card className="p-6 border-2">
          <h3 className="text-xl font-bold mb-4">Flujo de Tareas Principal</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-2">1. Descubrimiento de productos</h4>
              <p className="text-sm text-gray-700 mb-2">
                Home → Categorías → Catálogo con filtros
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                <li>Navegación intuitiva con breadcrumbs</li>
                <li>Filtros por talla y color</li>
                <li>Vista cuadrícula/lista</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2">2. Selección de producto</h4>
              <p className="text-sm text-gray-700 mb-2">
                Catálogo → Detalle de producto → Selección de talla → Añadir al carrito
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                <li>Imágenes múltiples del producto</li>
                <li>Información de stock en tiempo real</li>
                <li>Prevención de errores (talla obligatoria)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2">3. Proceso de compra</h4>
              <p className="text-sm text-gray-700 mb-2">
                Carrito → Revisión → Checkout → Confirmación
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                <li>Resumen claro del pedido</li>
                <li>Formulario en 3 pasos lógicos</li>
                <li>Validación en tiempo real</li>
                <li>Indicadores de seguridad</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 mt-4">
          <h3 className="text-xl font-bold mb-4">Eficiencia en la Navegación</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Navegación persistente:</strong> Header con accesos directos
              siempre visible
            </li>
            <li>
              <strong>Atajos de teclado:</strong> Tab para navegar, Enter para
              activar, Escape para cerrar
            </li>
            <li>
              <strong>Breadcrumbs:</strong> Orientación contextual en todas las páginas
              internas
            </li>
            <li>
              <strong>Skip links:</strong> Saltar al contenido principal para lectores
              de pantalla
            </li>
            <li>
              <strong>Búsqueda:</strong> Disponible en header y página de ayuda
            </li>
          </ul>
        </Card>

        <Card className="p-6 border-2 mt-4">
          <h3 className="text-xl font-bold mb-4">Coherencia Funcional</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Patrones consistentes:</strong> Botones primarios siempre
              negros, secundarios con borde
            </li>
            <li>
              <strong>Feedback visual:</strong> Estados hover, focus y active claramente
              diferenciados
            </li>
            <li>
              <strong>Iconografía uniforme:</strong> Lucide React para consistencia
              visual
            </li>
            <li>
              <strong>Mensajes de estado:</strong> Confirmaciones, advertencias y
              errores con códigos de color estándar
            </li>
          </ul>
        </Card>
      </section>

      {/* Conclusion */}
      <Card className="p-6 border-2 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Conclusión</h2>
        <p className="mb-4">
          Este prototipo de baja fidelidad de <strong>CrowStore</strong> demuestra que
          un diseño bien fundamentado es:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
          <li>
            <strong>Funcional:</strong> Cada elemento tiene un propósito claro basado
            en las heurísticas de Nielsen
          </li>
          <li>
            <strong>Inclusivo:</strong> Cumple con WCAG 2.2 para garantizar
            accesibilidad universal
          </li>
          <li>
            <strong>Cognitivamente coherente:</strong> Flujo de tareas intuitivo,
            navegación eficiente y feedback claro
          </li>
        </ul>
        <p className="text-sm text-gray-600">
          El diseño NO es estético, es una solución sistemática a problemas de
          usabilidad y accesibilidad.
        </p>
      </Card>
    </div>
  );
}
