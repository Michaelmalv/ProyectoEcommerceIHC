import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ShoppingCart, ArrowLeft, Info, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Alert, AlertDescription } from "../components/ui/alert";
import { products, sizes } from "../data/products";
import { useCart } from "../context/CartContext";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #1: Visibilidad del estado del sistema
 * - Feedback claro al seleccionar talla
 * - Confirmación al añadir al carrito
 *
 * Nielsen #5: Prevención de errores
 * - Botón deshabilitado si no hay talla seleccionada
 * - Advertencia de disponibilidad limitada
 */

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find((p) => p.id === parseInt(id || "0"));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-12 text-center border-2">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link to="/catalogo">
            <Button className="bg-black text-white hover:bg-gray-800">
              Volver al catálogo
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedSize && product) {
      addToCart(product, selectedSize, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const handleCloseNotification = () => {
    setAddedToCart(false);
  };

  const isLowStock = product.stock < 5;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalogo">Catálogo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 mb-6 hover:underline focus:outline-none focus:ring-2 focus:ring-black px-2 py-1"
      >
        <ArrowLeft size={20} aria-hidden="true" />
        <span>Volver al catálogo</span>
      </Link>

      {/* Notificación emergente */}
      {addedToCart && (
        <div
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="bg-green-100/90 backdrop-blur-sm border-2 border-green-300 text-green-800 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px] max-w-[90vw]">
            <span className="text-2xl text-green-600">✓</span>
            <span className="font-medium text-center flex-1">
              Producto añadido al carrito correctamente
            </span>
            <button
              onClick={handleCloseNotification}
              className="text-green-700 hover:text-green-900 focus:outline-none ml-2"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images - WCAG Perceptibilidad */}
        <div>
          <div className="border-2 border-gray-300 bg-gray-100 aspect-square flex items-center justify-center mb-4 overflow-hidden">
            <img
              src={product.image}
              alt={`${product.name} - ${product.color} para ${product.gender} - Vista principal`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className="border-2 border-gray-300 bg-gray-100 aspect-square flex items-center justify-center hover:border-black focus:outline-none focus:ring-2 focus:ring-black overflow-hidden"
                aria-label={`Ver imagen ${i} de ${product.name}`}
              >
                <img
                  src={product.image}
                  alt={`${product.name} - Vista ${i}`}
                  className="w-full h-full object-contain opacity-70"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold mb-4" aria-label={`Precio: ${product.price} dólares`}>
            {product.price.toFixed(2)}$
          </p>

          <p className="text-gray-700 mb-2 capitalize">
            <strong>Género:</strong> {product.gender}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Talla disponible:</strong> <span style={{ unicodeBidi: 'isolate' }}>{product.size}</span>
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Color:</strong> {product.color}
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Categoría:</strong> {product.category}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <Label className="text-lg font-bold mb-3 block">
              Selecciona tu talla
              {!selectedSize && (
                <span className="text-red-600 ml-2" aria-label="Campo requerido">
                  *
                </span>
              )}
            </Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex gap-2 flex-wrap"
              aria-required="true"
              aria-label="Selección de talla"
            >
              {sizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem
                    value={size}
                    id={`size-${size}`}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className={`
                      flex items-center justify-center w-16 h-16 border-2 cursor-pointer
                      peer-focus:ring-2 peer-focus:ring-black
                      ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }
                    `}
                    aria-label={`Talla ${size}`}
                    style={{ fontVariantNumeric: 'normal', textTransform: 'none' }}
                  >
                    <span style={{ unicodeBidi: 'isolate' }}>{size}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Link
              to="/ayuda"
              className="text-sm text-gray-600 hover:underline mt-2 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <Info size={16} aria-hidden="true" />
              <span>Guía de tallas</span>
            </Link>
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <Alert className="mb-4 border-2 border-yellow-600 bg-yellow-50">
              <AlertDescription>
                ⚠️ Solo quedan {product.stock} unidades disponibles
              </AlertDescription>
            </Alert>
          )}

          {product.stock === 0 && (
            <Alert className="mb-4 border-2 border-red-600 bg-red-50">
              <AlertDescription>✕ Producto agotado</AlertDescription>
            </Alert>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <Label htmlFor="quantity" className="font-bold mb-2 block">
              Cantidad
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                -
              </Button>
              <div
                id="quantity"
                className="w-20 text-center border-2 border-gray-300 p-2 bg-white font-bold"
                aria-label={`Cantidad de productos: ${quantity}`}
              >
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                aria-label="Aumentar cantidad"
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div>
            <Button
              size="lg"
              className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black h-20 sm:h-14 text-lg sm:text-base px-10 sm:px-8"
              onClick={handleAddToCart}
              disabled={!selectedSize || product.stock === 0}
              aria-label={
                selectedSize
                  ? "Añadir al carrito"
                  : "Selecciona una talla para añadir al carrito"
              }
            >
              <ShoppingCart className="mr-2" size={28} aria-hidden="true" />
              <span className="font-bold">Añadir al carrito</span>
            </Button>
          </div>

          {/* Product Details */}
          <Card className="mt-8 p-4 border-2">
            <h2 className="font-bold mb-3">Detalles del producto</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex">
                <dt className="font-bold w-24">Categoría:</dt>
                <dd className="capitalize">{product.category}</dd>
              </div>
              <div className="flex">
                <dt className="font-bold w-24">Género:</dt>
                <dd className="capitalize">{product.gender}</dd>
              </div>
              <div className="flex">
                <dt className="font-bold w-24">Color:</dt>
                <dd>{product.color}</dd>
              </div>
              <div className="flex">
                <dt className="font-bold w-24">Stock:</dt>
                <dd>{product.stock} unidades</dd>
              </div>
              <div className="flex">
                <dt className="font-bold w-24">Material:</dt>
                <dd>100% Algodón orgánico</dd>
              </div>
              <div className="flex">
                <dt className="font-bold w-24">Cuidados:</dt>
                <dd>Lavar a máquina máx. 30°C</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
