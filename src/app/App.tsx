import { RouterProvider } from "react-router";
import { router } from "./routes";

/**
 * CrowStore - E-commerce de Ropa
 *
 * PROTOTIPO DE BAJA FIDELIDAD FUNCIONAL
 *
 * Este prototipo integra obligatoriamente:
 * 1. Análisis heurístico basado en las 10 Heurísticas de Nielsen
 * 2. Matriz de cumplimiento de accesibilidad WCAG 2.2
 * 3. Diseño de interacción funcional
 *
 * Objetivo: Demostrar que el diseño NO es estético,
 * sino funcional, inclusivo y cognitivamente coherente.
 *
 * WCAG 2.2 - 4 Principios implementados:
 * - Perceptibilidad: Alt text, contraste, indicadores visuales
 * - Operabilidad: Navegación por teclado, foco visible, skip links
 * - Comprensibilidad: Lenguaje claro, mensajes de ayuda, labels
 * - Robustez: HTML semántico, roles ARIA, compatible con tecnologías asistidas
 *
 * Funcionalidades:
 * - Carrito funcional con estado global
 * - Filtros por género, talla y color
 * - Añadir/eliminar/modificar productos en carrito
 * - Cálculo dinámico de totales y envío
 */

export default function App() {
  return <RouterProvider router={router} />;
}