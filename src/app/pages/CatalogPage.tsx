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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* WCAG Operabilidad: Breadcrumbs para orientación */}
      <Breadcrumb className="mb-6">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {searchQuery
              ? `Búsqueda: "${searchQuery}"`
              : categoryParam
              ? `Categoría: ${categoryParam}`
              : "Catálogo completo"}
          </h1>
          {/* Nielsen #1: Visibilidad del estado del sistema */}
          <p className="text-gray-600" aria-live="polite" aria-atomic="true">
            {filteredProducts.length} productos encontrados
          </p>
        </div>

        {/* View Controls - Nielsen #7: Flexibilidad */}
        <div className="flex gap-2" role="group" aria-label="Opciones de visualización">
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - WCAG Comprensibilidad: Controles agrupados lógicamente */}
        {showFilters && (
          <aside
            className="w-full md:w-64 flex-shrink-0"
            aria-label="Filtros de productos"
          >
            <Card className="p-4 border-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Filtros</h2>
                {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedGenders.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm underline"
                  >
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Gender Filters */}
              <div className="mb-6">
                <h3 className="font-bold mb-3">Género</h3>
                <div className="space-y-2">
                  {genders.map((gender) => (
                    <div key={gender} className="flex items-center">
                      <Checkbox
                        id={`gender-${gender}`}
                        checked={selectedGenders.includes(gender)}
                        onCheckedChange={() => toggleGender(gender)}
                        className="focus:ring-2 focus:ring-black"
                      />
                      <Label
                        htmlFor={`gender-${gender}`}
                        className="ml-2 cursor-pointer capitalize"
                      >
                        {gender}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filters */}
              <div className="mb-6">
                <h3 className="font-bold mb-3">Tallas</h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => toggleSize(size)}
                        className="focus:ring-2 focus:ring-black"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className="ml-2 cursor-pointer"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filters */}
              <div>
                <h3 className="font-bold mb-3">Colores</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <div key={color} className="flex items-center">
                      <Checkbox
                        id={`color-${color}`}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => toggleColor(color)}
                        className="focus:ring-2 focus:ring-black"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="ml-2 cursor-pointer"
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
            <Card className="p-12 text-center border-2">
              <p className="text-xl font-bold mb-2">No hay productos</p>
              <p className="text-gray-600 mb-4">
                No se encontraron productos con los filtros seleccionados
              </p>
              <Button onClick={clearFilters} variant="outline" className="border-2">
                Limpiar filtros
              </Button>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                    className={`border-2 hover:border-black transition-colors ${
                      viewMode === "list" ? "flex gap-4 p-4" : "p-4"
                    }`}
                  >
                    {/* WCAG Perceptibilidad: Imagen con texto alternativo */}
                    <div
                      className={`border-2 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden ${
                        viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "h-48 mb-4"
                      }`}
                    >
                      <img
                        src={getPublicUrlFromPath(product.image)}
                        alt={`${product.name} - ${product.color} - ${product.gender}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 capitalize">
                        {product.gender} • <span style={{ unicodeBidi: 'isolate' }}>{product.size}</span> • {product.color}
                      </p>
                      <p className="text-xl font-bold" aria-label={`Precio: ${product.price} dólares`}>
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
