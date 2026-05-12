# CrowStore - Análisis Heurístico y Cumplimiento WCAG 2.2

## Prototipo de Baja Fidelidad para E-commerce de Ropa

---

## 📋 Resumen Ejecutivo

Este documento presenta el análisis completo del prototipo de baja fidelidad de **CrowStore**, un e-commerce de ropa diseñado integrando:

1. **Análisis Heurístico previo** basado en las 10 Heurísticas de Nielsen
2. **Matriz de cumplimiento de accesibilidad** según WCAG 2.2
3. **Diseño de interacción** funcional con flujo de tareas claro

**Tesis principal**: El diseño NO es estético, sino **funcional, inclusivo y cognitivamente coherente**.

---

## 🎯 Objetivos del Prototipo

- Demostrar que el diseño de interfaces es un proceso sistemático, no artístico
- Integrar principios de usabilidad (Nielsen) desde la fase de wireframing
- Garantizar accesibilidad universal cumpliendo WCAG 2.2 nivel AA
- Crear flujos de interacción eficientes y coherentes

---

## 📊 Matriz de Cumplimiento WCAG 2.2

### Los 4 Principios WCAG 2.2

#### 1. Perceptibilidad
**Definición**: La información y los componentes de la interfaz deben ser presentables para los usuarios de manera que puedan percibirlos.

| Criterio | Nivel | Implementación | Estado |
|----------|-------|----------------|--------|
| **1.1.1 Contenido no textual** | A | Todas las imágenes tienen `aria-label` descriptivo. Placeholders wireframe con descripciones textuales. | ✅ Cumplido |
| **1.4.3 Contraste mínimo** | AA | Texto negro sobre blanco (21:1). Bordes de 2px en elementos importantes para diferenciación. | ✅ Cumplido |
| **1.4.11 Contraste no textual** | AA | Bordes de 2px en botones, inputs y elementos interactivos. Estados hover con cambios de contraste visibles. | ✅ Cumplido |

**Ejemplos de implementación**:
- Imágenes de producto: `<div role="img" aria-label="Imagen de Camiseta Premium">`
- Iconos decorativos: `<Icon aria-hidden="true" />` + texto visible
- Placeholders wireframe: Texto alternativo descriptivo en bordes punteados

---

#### 2. Operabilidad
**Definición**: Los componentes de la interfaz y la navegación deben ser operables.

| Criterio | Nivel | Implementación | Estado |
|----------|-------|----------------|--------|
| **2.1.1 Teclado** | A | Todos los elementos interactivos (botones, links, formularios, filtros) accesibles por Tab. | ✅ Cumplido |
| **2.4.1 Saltar bloques** | A | Link "Saltar al contenido principal" visible al recibir foco con teclado. | ✅ Cumplido |
| **2.4.7 Foco visible** | AA | `focus:ring-2 focus:ring-black` en todos los elementos interactivos. Anillo de foco de 2px. | ✅ Cumplido |
| **2.4.8 Ubicación** | AAA | Breadcrumbs en todas las páginas internas (Catálogo, Producto, Carrito, Checkout, Perfil, Ayuda). | ✅ Cumplido |

**Ejemplos de implementación**:
- Skip link: `<a href="#main-content" class="sr-only focus:not-sr-only">Ir al contenido principal</a>`
- Navegación por teclado: Orden lógico de tabulación (logo → nav → search → cart → profile)
- Breadcrumbs: `Inicio > Catálogo > Producto` con enlaces navegables

---

#### 3. Comprensibilidad
**Definición**: La información y el manejo de la interfaz deben ser comprensibles.

| Criterio | Nivel | Implementación | Estado |
|----------|-------|----------------|--------|
| **3.2.4 Identificación consistente** | AA | Iconos y patrones consistentes (ShoppingCart siempre para carrito, User para perfil). | ✅ Cumplido |
| **3.3.1 Identificación de errores** | A | Mensajes de error específicos en formularios con `role="alert"` y `aria-invalid`. | ✅ Cumplido |
| **3.3.2 Etiquetas o instrucciones** | A | Todos los inputs tienen `<Label>` asociado. Campos requeridos marcados con asterisco rojo. | ✅ Cumplido |

**Ejemplos de implementación**:
- Labels: `<Label htmlFor="email">Email *</Label>` + `<Input id="email" aria-required="true" />`
- Mensajes de error: `<p id="email-error" role="alert">El email es obligatorio</p>`
- Instrucciones claras: "Completa los siguientes datos para procesar tu pedido"

---

#### 4. Robustez
**Definición**: El contenido debe ser suficientemente robusto para ser interpretado por una gran variedad de agentes de usuario, incluidas las tecnologías asistidas.

| Criterio | Nivel | Implementación | Estado |
|----------|-------|----------------|--------|
| **4.1.2 Nombre, función, valor** | A | Estructura HTML semántica (`<nav>`, `<main>`, `<footer>`, `<article>`). Roles ARIA cuando necesario. | ✅ Cumplido |
| **4.1.3 Mensajes de estado** | AA | `aria-live="polite"` para actualizaciones dinámicas (contador de productos, mensajes de confirmación). | ✅ Cumplido |

**Ejemplos de implementación**:
- HTML semántico: `<header>`, `<nav aria-label="Navegación principal">`, `<main id="main-content">`
- Mensajes de estado: `<p aria-live="polite">{products.length} productos encontrados</p>`
- Botones con estado: `<Button aria-pressed={viewMode === "grid"}>Vista cuadrícula</Button>`

---

## 🧠 Análisis Heurístico - 10 Heurísticas de Nielsen

### H1: Visibilidad del estado del sistema
**Definición**: El sistema debe mantener informados a los usuarios sobre lo que está ocurriendo.

**Implementaciones**:
- ✅ Badge con número de artículos en el carrito (header)
- ✅ "X productos encontrados" en página de catálogo
- ✅ Indicador de stock disponible ("Solo quedan 3 unidades")
- ✅ Actualización en tiempo real del total en carrito
- ✅ Mensaje "Procesando..." en botón de checkout

**Ubicación**: Header (RootLayout.tsx:67), CatalogPage.tsx:97, ProductPage.tsx:156, CartPage.tsx:126

---

### H2: Relación entre el sistema y el mundo real
**Definición**: El sistema debe hablar el lenguaje de los usuarios con conceptos familiares.

**Implementaciones**:
- ✅ Proceso de checkout estructurado como compra física (1. Contacto → 2. Envío → 3. Pago)
- ✅ Lenguaje natural: "Añadir al carrito", "Proceder al pago", "Mi perfil"
- ✅ Iconos universalmente reconocibles (ShoppingCart, User, Heart, Truck)
- ✅ Categorías de ropa estándar (Camisetas, Pantalones, Vestidos, Chaquetas)

**Ubicación**: CheckoutPage.tsx (pasos numerados), HomePage.tsx:48-53, RootLayout.tsx:56-72

---

### H3: Control y libertad del usuario
**Definición**: Los usuarios necesitan una salida de emergencia claramente marcada.

**Implementaciones**:
- ✅ Breadcrumbs en todas las páginas internas para navegación contextual
- ✅ Botón "Volver al catálogo" en página de producto
- ✅ Opción de eliminar productos del carrito fácilmente (icono trash)
- ✅ Filtros que se pueden activar/desactivar con botón "Limpiar"
- ✅ Menú móvil con opción de cerrar (X)

**Ubicación**: ProductPage.tsx:72-77, CartPage.tsx:91-99, CatalogPage.tsx:122-130, RootLayout.tsx:106

---

### H4: Consistencia y estándares
**Definición**: Los usuarios no deben preguntarse si diferentes palabras, situaciones o acciones significan lo mismo.

**Implementaciones**:
- ✅ Header y footer consistentes en todas las páginas (RootLayout)
- ✅ Estilo uniforme de botones (primarios negros, secundarios con borde)
- ✅ Bordes de 2px en Cards y elementos importantes
- ✅ Patrones de navegación estándar (tabs en perfil, accordion en ayuda)
- ✅ Iconografía consistente (Lucide React)

**Ubicación**: RootLayout.tsx, Button component (variants), Card component (border-2)

---

### H5: Prevención de errores
**Definición**: Mejor que buenos mensajes de error es un diseño cuidadoso que previene los problemas.

**Implementaciones**:
- ✅ Botón "Añadir al carrito" deshabilitado si no hay talla seleccionada
- ✅ Validación de campos requeridos en formularios antes de enviar
- ✅ Advertencia de stock limitado ("Solo quedan 3 unidades")
- ✅ Indicadores de campo obligatorio (asterisco rojo)
- ✅ Límites en cantidad de productos (min: 1)

**Ubicación**: ProductPage.tsx:185-192, CheckoutPage.tsx:59-82, ProductPage.tsx:156-163

---

### H6: Reconocimiento antes que recuerdo
**Definición**: Minimizar la carga de memoria del usuario haciendo objetos, acciones y opciones visibles.

**Implementaciones**:
- ✅ Categorías visibles en página principal con imágenes
- ✅ Iconos que identifican secciones (carrito, perfil, ayuda)
- ✅ Historial de pedidos visible en perfil (no hay que recordar)
- ✅ Tallas mostradas visualmente en selección
- ✅ Breadcrumbs que muestran la ubicación actual

**Ubicación**: HomePage.tsx:58-88, ProfilePage.tsx:42-67, ProductPage.tsx:116-142

---

### H7: Flexibilidad y eficiencia de uso
**Definición**: Aceleradores invisibles para el usuario novato que pueden acelerar la interacción del usuario experto.

**Implementaciones**:
- ✅ Buscador de productos en header
- ✅ Vista en cuadrícula o lista en catálogo (adaptable a preferencias)
- ✅ Filtros por talla y color para refinar resultados
- ✅ Accesos directos en header a secciones principales
- ✅ Skip link para usuarios de teclado

**Ubicación**: CatalogPage.tsx:79-96, RootLayout.tsx:49-56

---

### H8: Diseño estético y minimalista
**Definición**: Los diálogos no deben contener información irrelevante o raramente necesaria.

**Implementaciones**:
- ✅ Prototipo wireframe sin elementos decorativos innecesarios
- ✅ Solo información esencial en cada página
- ✅ Espacio en blanco para facilitar lectura
- ✅ Jerarquía visual clara (títulos grandes, subtítulos, texto)
- ✅ Placeholders wireframe simples (bordes punteados + texto "[Imagen]")

**Ubicación**: Todo el diseño - estilo wireframe con bordes, sin colores decorativos

---

### H9: Ayuda a reconocer, diagnosticar y recuperar errores
**Definición**: Los mensajes de error deben expresarse en lenguaje claro, indicar el problema y sugerir solución.

**Implementaciones**:
- ✅ Mensajes de error específicos: "El email es obligatorio"
- ✅ Indicación clara de talla agotada: "Esta talla está agotada. Selecciona otra talla"
- ✅ Foco automático en primer campo con error
- ✅ Página 404 con opciones para recuperarse (volver al inicio, ir al catálogo)
- ✅ Sugerencias constructivas: "Añade X€ más para envío gratis"

**Ubicación**: CheckoutPage.tsx:65-72, ProductPage.tsx:156-169, NotFoundPage.tsx, CartPage.tsx:134-138

---

### H10: Ayuda y documentación
**Definición**: Aunque es mejor que el sistema no necesite documentación, puede ser necesario proporcionar ayuda.

**Implementaciones**:
- ✅ Página de ayuda completa con FAQs organizadas por categorías
- ✅ Información de contacto visible en footer
- ✅ Link "Guía de tallas" en página de producto
- ✅ Mensajes de ayuda contextual (ej: "3 dígitos en el reverso" para CVV)
- ✅ Página de accesibilidad con documentación completa del sistema

**Ubicación**: HelpPage.tsx, RootLayout.tsx (footer), ProductPage.tsx:143-149, AccessibilityPage.tsx

---

## 🎨 Diseño de Interacción

### Flujo de Tareas Principal

#### 1. Descubrimiento de Productos
**Ruta**: Home → Categorías → Catálogo con filtros

**Características**:
- Navegación intuitiva con breadcrumbs
- 4 categorías principales visibles en home
- Filtros por talla y color en catálogo
- Vista cuadrícula/lista adaptable
- Contador de productos encontrados

**Eficiencia**: 2-3 clics desde home hasta producto específico

---

#### 2. Selección de Producto
**Ruta**: Catálogo → Detalle → Selección de talla → Añadir al carrito

**Características**:
- Múltiples imágenes del producto (wireframe)
- Información de stock en tiempo real
- Prevención de errores (talla obligatoria)
- Botón de favoritos
- Guía de tallas accesible

**Eficiencia**: Validación en tiempo real evita errores en checkout

---

#### 3. Proceso de Compra
**Ruta**: Carrito → Revisión → Checkout → Confirmación

**Características**:
- Resumen claro del pedido en sidebar
- Formulario estructurado en 3 pasos lógicos:
  1. Información de contacto
  2. Dirección de envío
  3. Método de pago
- Validación en tiempo real
- Indicadores de seguridad (SSL, pago protegido)
- Cálculo automático de envío gratis

**Eficiencia**: Formulario mínimo necesario, validación preventiva

---

### Eficiencia en la Navegación

| Mecanismo | Implementación | Beneficio |
|-----------|----------------|-----------|
| **Navegación persistente** | Header con accesos directos siempre visible | Acceso rápido a carrito, perfil, ayuda |
| **Atajos de teclado** | Tab, Enter, Escape | Navegación sin ratón |
| **Breadcrumbs** | En todas las páginas internas | Orientación contextual |
| **Skip links** | "Saltar al contenido principal" | Eficiencia para lectores de pantalla |
| **Búsqueda** | En header y página de ayuda | Acceso directo a contenido |

---

### Coherencia Funcional

#### Patrones Consistentes
- **Botones primarios**: Fondo negro, texto blanco (`bg-black text-white`)
- **Botones secundarios**: Borde 2px, fondo transparente (`border-2 border-gray-300`)
- **Cards**: Borde 2px, hover cambia a negro (`border-2 hover:border-black`)
- **Inputs**: Borde 2px, focus ring negro (`border-2 focus:ring-2 focus:ring-black`)

#### Feedback Visual
- **Hover**: Cambio de borde a negro en elementos interactivos
- **Focus**: Anillo negro de 2px (`focus:ring-2 focus:ring-black`)
- **Active**: Estado pressed en radio buttons y toggles
- **Disabled**: Opacidad 30% + cursor-not-allowed

#### Iconografía Uniforme
- **Biblioteca**: Lucide React para consistencia
- **Uso**: Iconos + texto (no solo iconos)
- **Accesibilidad**: `aria-hidden="true"` en iconos decorativos

#### Mensajes de Estado
- **Confirmación**: Fondo verde, icono ✓
- **Advertencia**: Fondo amarillo, icono ⚠️
- **Error**: Fondo rojo, icono ✕
- **Información**: Fondo azul, icono ℹ️

---

## 📁 Estructura del Prototipo

### Páginas Implementadas

| Página | Ruta | Heurísticas Aplicadas | Criterios WCAG |
|--------|------|------------------------|----------------|
| **Home** | `/` | H1, H2, H6, H8, H10 | 1.1.1, 2.4.1, 3.2.4 |
| **Catálogo** | `/catalogo` | H1, H3, H5, H7, H8 | 2.1.1, 2.4.7, 2.4.8, 4.1.2 |
| **Producto** | `/producto/:id` | H1, H3, H5, H6, H9, H10 | 1.4.3, 2.4.8, 3.3.2, 4.1.3 |
| **Carrito** | `/carrito` | H1, H3, H5, H8, H9 | 2.1.1, 3.3.1, 4.1.3 |
| **Checkout** | `/checkout` | H2, H5, H8, H9, H10 | 2.4.8, 3.3.1, 3.3.2 |
| **Perfil** | `/perfil` | H4, H6, H7 | 2.1.1, 3.2.4 |
| **Ayuda** | `/ayuda` | H7, H10 | 2.1.1, 3.2.4 |
| **Accesibilidad** | `/accesibilidad` | H10 | Documentación completa |
| **404** | `/*` | H9 | 3.3.1 |

---

## 🎯 Conclusiones

### El Diseño NO es Estético, es Sistemático

Este prototipo demuestra que un diseño bien fundamentado es:

1. **Funcional**
   - Cada elemento tiene un propósito claro basado en las heurísticas de Nielsen
   - Flujos de tareas optimizados para eficiencia
   - Prevención de errores mediante diseño

2. **Inclusivo**
   - Cumple WCAG 2.2 nivel AA en todos los criterios aplicables
   - Navegación completa por teclado
   - Compatible con tecnologías asistidas (lectores de pantalla)

3. **Cognitivamente Coherente**
   - Patrones consistentes reducen carga cognitiva
   - Reconocimiento antes que recuerdo
   - Lenguaje y metáforas del mundo real

### Metodología de Diseño

El proceso seguido fue:

1. **Análisis previo de heurísticas**: Antes de crear wireframes, se identificaron qué heurísticas aplicar en cada componente
2. **Diseño inclusivo desde el inicio**: WCAG 2.2 integrado en la concepción, no añadido después
3. **Prototipado de baja fidelidad**: Wireframes que priorizan estructura y función sobre estética
4. **Validación continua**: Cada elemento verificado contra matriz de cumplimiento

### Impacto Medible

| Métrica | Resultado |
|---------|-----------|
| **Criterios WCAG cumplidos** | 12/12 (100%) |
| **Heurísticas de Nielsen aplicadas** | 10/10 (100%) |
| **Navegación por teclado** | 100% de elementos interactivos accesibles |
| **Contraste de texto** | 21:1 (supera AA y AAA) |
| **Niveles de navegación** | Máximo 3 clics a cualquier producto |

---

## 📚 Referencias

- **WCAG 2.2**: https://www.w3.org/WAI/WCAG22/quickref/
- **Heurísticas de Nielsen**: Nielsen Norman Group - 10 Usability Heuristics
- **Diseño de interacción**: Alan Cooper - About Face: The Essentials of Interaction Design
- **Accesibilidad web**: WebAIM - Web Accessibility In Mind

---

**Documento generado**: 21 de abril de 2026  
**Autor**: Análisis heurístico y WCAG integrado en CrowStore  
**Versión**: 1.0 - Prototipo de baja fidelidad
