# Entregables obligatorios y criterios de evaluación

Este documento resume, de forma directa, cómo CrowStore cubre lo que normalmente se pide en la entrega académica, sin modificar la interfaz ya finalizada.

## Entregables obligatorios

### 1. Prototipo interactivo navegable

CrowStore ya dispone de navegación completa entre pantallas, flujo de compra y acceso a las secciones principales del sistema.

Evidencia en el proyecto:
- Rutas y navegación SPA en [src/app/routes.tsx](src/app/routes.tsx)
- Layout global y navegación principal en [src/app/components/RootLayout.tsx](src/app/components/RootLayout.tsx)
- Páginas funcionales en [src/app/pages/](src/app/pages)

### 2. Representación coherente de UI y UX

La interfaz mantiene consistencia visual y lógica de interacción en todo el recorrido del usuario.

Evidencia en el proyecto:
- Catálogo, detalle de producto, carrito y checkout con flujos coherentes en [src/app/pages/](src/app/pages)
- Componentes reutilizables en [src/app/components/ui/](src/app/components/ui)
- Definición de estilos globales y tema en [src/styles/](src/styles)

### 3. Conexión con datos

La aplicación ya consume datos estructurados para productos, carrito y estados de navegación. Si en la evaluación se exige conexión externa, el proyecto cuenta con base para integración con servicios backend existentes en [supabase/](supabase).

Evidencia en el proyecto:
- Datos de productos en [src/app/data/products.ts](src/app/data/products.ts)
- Persistencia y estado global en [src/app/context/CartContext.tsx](src/app/context/CartContext.tsx)
- Infraestructura backend en [supabase/](supabase)

### 4. Navegación completa

Todo el prototipo es navegable por teclado y por interacción directa, con rutas de respaldo y páginas de error controladas.

Evidencia en el proyecto:
- Página 404 en [src/app/pages/NotFoundPage.tsx](src/app/pages/NotFoundPage.tsx)
- Accesibilidad y navegación documentadas en [ANALISIS_HEURISTICO_WCAG.md](ANALISIS_HEURISTICO_WCAG.md)
- Flujo de compra y validaciones en [src/app/pages/CheckoutPage.tsx](src/app/pages/CheckoutPage.tsx)

## Criterios de evaluación

### Criterio 1: Calidad funcional

Cumplido. El prototipo permite explorar productos, filtrar, añadir al carrito, modificar cantidades y completar el checkout.

Evidencia:
- [src/app/pages/CatalogPage.tsx](src/app/pages/CatalogPage.tsx)
- [src/app/pages/ProductPage.tsx](src/app/pages/ProductPage.tsx)
- [src/app/pages/CartPage.tsx](src/app/pages/CartPage.tsx)
- [src/app/pages/CheckoutPage.tsx](src/app/pages/CheckoutPage.tsx)

### Criterio 2: Coherencia visual y de interacción

Cumplido. El sistema mantiene patrones repetibles de botones, tarjetas, formularios y navegación.

Evidencia:
- [src/app/components/RootLayout.tsx](src/app/components/RootLayout.tsx)
- [src/app/components/ui/](src/app/components/ui)
- [default_shadcn_theme.css](default_shadcn_theme.css)

### Criterio 3: Accesibilidad

Cumplido. El proyecto está documentado con criterios WCAG 2.2 y manejo de estados accesibles.

Evidencia:
- [ANALISIS_HEURISTICO_WCAG.md](ANALISIS_HEURISTICO_WCAG.md)
- [VALIDATION_AUDIT.md](VALIDATION_AUDIT.md)

### Criterio 4: Evidencia de análisis y documentación

Cumplido. Existe documentación técnica y de validación que respalda las decisiones de diseño.

Evidencia:
- [README.md](README.md)
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- [ANALISIS_HEURISTICO_WCAG.md](ANALISIS_HEURISTICO_WCAG.md)

### Criterio 5: Presentación final

Cumplido. El proyecto queda listo para revisión con una estructura ordenada, documentación de soporte y rutas definidas.

Evidencia:
- [README.md](README.md)
- [vercel.json](vercel.json)
- [vite.config.ts](vite.config.ts)

## Resumen para entregar

1. Prototipo navegable y funcional.
2. Documentación de heurísticas y accesibilidad.
3. Evidencia de implementación y validación.
4. Proyecto listo para revisión y demostración.
