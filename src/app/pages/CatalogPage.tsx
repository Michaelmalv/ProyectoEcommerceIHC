import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { products, sizes, colors, genders } from "../data/products";
import { getPublicUrlFromPath } from "../../utils/storage";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #3: Control y libertad del usuario
 * - Filtros que se pueden activar/desactivar fácilmente
 * - Breadcrumbs para navegación contextual
 *
 * Nielsen #5: Prevención de errores
 * - Número de resultados visible antes de filtrar
 * - Opción de limpiar filtros disponible
 *
 * WCAG 2.2 - Operabilidad:
 * - Controles de filtro accesibles por teclado
 * - Checkboxes con labels asociados
 * - Foco visible en todos los elementos interactivos
 */

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  const searchQuery = searchParams.get("busqueda");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedGenders([]);
  };

  // Filtrado funcional
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtro por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.color.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Filtro por categoría
      if (categoryParam && product.category !== categoryParam) return false;

      // Filtro por talla
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
        return false;
      }

      // Filtro por color
      if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
        return false;
      }

      // Filtro por género
      if (selectedGenders.length > 0 && !selectedGenders.includes(product.gender)) {
        return false;
      }

      return true;
    });
  }, [categoryParam, searchQuery, selectedSizes, selectedColors, selectedGenders]);

  return (
    <div className="space-y-8">
      {/* WCAG Operabilidad: Breadcrumbs para orientación */}
      <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Catálogo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,250,244,0.96),rgba(238,224,208,0.9))] p-6 shadow-[0_24px_70px_-42px_rgba(24,18,15,0.55)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Catálogo interactivo
            </p>
            <h1 className="font-display text-4xl tracking-tight md:text-5xl">
              {searchQuery
                ? `Búsqueda: "${searchQuery}"`
                : categoryParam
                ? `Categoría: ${categoryParam}`
                : "Catálogo completo"}
            </h1>
            {/* Nielsen #1: Visibilidad del estado del sistema */}
            <p className="mt-3 text-lg text-muted-foreground" aria-live="polite" aria-atomic="true">
              {filteredProducts.length} productos encontrados
            </p>
          </div>

          {/* View Controls - Nielsen #7: Flexibilidad */}
          <div className="flex flex-wrap gap-2 rounded-full border border-[color:var(--border)] bg-white/80 p-2" role="group" aria-label="Opciones de visualización">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Vista en cuadrícula"
            aria-pressed={viewMode === "grid"}
          >
            <Grid size={20} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="Vista en lista"
            aria-pressed={viewMode === "list"}
          >
            <List size={20} />
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
            aria-label={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            aria-expanded={showFilters}
          >
            <Filter size={20} className="mr-2" />
            Filtros
          </Button>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters Sidebar - WCAG Comprensibilidad: Controles agrupados lógicamente */}
        {showFilters && (
          <aside
            className="w-full flex-shrink-0 lg:w-80"
            aria-label="Filtros de productos"
            translate="no"
          >
            <Card className="sticky top-28 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl tracking-tight">Filtros</h2>
                {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedGenders.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Gender Filters */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Género</h3>
                <div className="space-y-2">
                  {genders.map((gender) => (
                    <div key={gender} className="flex items-center rounded-2xl border border-transparent px-2 py-1 hover:border-[color:var(--border)] hover:bg-accent/30">
                      <Checkbox
                        id={`gender-${gender}`}
                        checked={selectedGenders.includes(gender)}
                        onCheckedChange={() => toggleGender(gender)}
                        className="focus:ring-2 focus:ring-black"
                      />
                      <Label
                        htmlFor={`gender-${gender}`}
                        className="ml-2 cursor-pointer capitalize"
                        translate="no"
                      >
                        {gender}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filters */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tallas</h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center rounded-2xl border border-transparent px-2 py-1 hover:border-[color:var(--border)] hover:bg-accent/30">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => toggleSize(size)}
                        className="focus:ring-2 focus:ring-black"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className="ml-2 cursor-pointer"
                        translate="no"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filters */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Colores</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <div key={color} className="flex items-center rounded-2xl border border-transparent px-2 py-1 hover:border-[color:var(--border)] hover:bg-accent/30">
                      <Checkbox
                        id={`color-${color}`}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => toggleColor(color)}
                        className="focus:ring-2 focus:ring-black"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="ml-2 cursor-pointer"
                        translate="no"
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </aside>
        )}

        {/* Products Grid/List - Nielsen #8: Diseño minimalista */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="font-display text-3xl mb-2 tracking-tight">No hay productos</p>
              <p className="text-muted-foreground mb-4">
                No se encontraron productos con los filtros seleccionados
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar filtros
              </Button>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/producto/${product.id}`}
                  className="focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <Card
                    className={`overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-42px_rgba(24,18,15,0.58)] ${
                      viewMode === "list" ? "flex gap-4 p-4" : "p-4"
                    }`}
                  >
                    {/* WCAG Perceptibilidad: Imagen con texto alternativo */}
                    <div
                      className={`overflow-hidden rounded-[1.25rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(241,229,216,0.94))] flex items-center justify-center ${
                        viewMode === "list" ? "h-36 w-36 flex-shrink-0" : "mb-4 h-56"
                      }`}
                    >
                      {product.images && product.images.length > 1 ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <img
                            src={getPublicUrlFromPath(product.image)}
                            alt={`${product.name} - ${product.color} - ${product.gender}`}
                            className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full p-4 bg-[rgba(248,241,233,0.6)]">
                          <img
                            src={getPublicUrlFromPath(product.image)}
                            alt={`${product.name} - ${product.color} - ${product.gender}`}
                            className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {product.category}
                        </span>
                        {product.stock < 5 && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900">
                            Stock bajo
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl mb-2 tracking-tight">{product.name}</h3>
                      <p className="mb-2 text-sm capitalize text-muted-foreground">
                        {product.gender} • <span style={{ unicodeBidi: 'isolate' }}>{product.size}</span> • {product.color}
                      </p>
                      <p className="text-2xl font-semibold" aria-label={`Precio: ${product.price} dólares`}>
                        {product.price.toFixed(2)}$
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
