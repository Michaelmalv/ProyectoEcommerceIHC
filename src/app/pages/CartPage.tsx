import { Link } from "react-router";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { useCart } from "../context/CartContext";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #1: Visibilidad del estado del sistema
 * - Actualización en tiempo real del total
 * - Contador de artículos visible
 *
 * Nielsen #3: Control y libertad del usuario
 * - Opción de eliminar productos fácilmente
 * - Modificar cantidad sin salir de la página
 */

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;
  const itemCount = getCartCount();

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
            <BreadcrumbPage>Carrito</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Mi carrito</h1>

      {cartItems.length === 0 ? (
        // Empty State
        <Card className="p-12 text-center border-2">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" aria-hidden="true" />
          <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Añade productos para empezar tu compra</p>
          <Link to="/catalogo">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Ir al catálogo
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div role="list" aria-label="Productos en el carrito">
              {cartItems.map((item) => (
                <Card
                  key={`${item.id}-${item.selectedSize}`}
                  className="p-4 border-2 mb-4"
                  role="listitem"
                >
                  <div className="flex gap-3 relative">
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-gray-300 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={`${item.name} - ${item.color} - Talla ${item.selectedSize}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Delete button - Absolute position */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="absolute top-0 right-0 text-red-600 hover:text-red-800 hover:bg-red-50 focus:ring-2 focus:ring-red-600"
                      aria-label={`Eliminar ${item.name} del carrito`}
                    >
                      <Trash2 size={20} />
                    </Button>

                    <div className="flex-1 pr-8">
                      {/* Product info */}
                      <div className="mb-3">
                        <h3 className="font-bold text-sm sm:text-base mb-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 capitalize">
                          Talla: <span style={{ unicodeBidi: 'isolate' }}>{item.selectedSize}</span> • {item.gender}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">Color: {item.color}</p>
                      </div>

                      {/* Quantity and Price - Stacked on mobile */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold">Cantidad:</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.selectedSize, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label={`Disminuir cantidad de ${item.name}`}
                          >
                            -
                          </Button>
                          <span
                            className="w-12 text-center font-bold"
                            aria-label={`Cantidad: ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.selectedSize, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            aria-label={`Aumentar cantidad de ${item.name}`}
                          >
                            +
                          </Button>
                        </div>

                        {/* Price */}
                        <p
                          className="font-bold text-lg sm:text-xl"
                          aria-label={`Precio: ${(item.price * item.quantity).toFixed(2)} dólares`}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} artículos):</span>
                  <span className="font-bold">{subtotal.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `${shipping.toFixed(2)}$`
                    )}
                  </span>
                </div>
                {subtotal < 50 && subtotal > 0 && (
                  <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-300 p-2">
                    ℹ️ Añade {(50 - subtotal).toFixed(2)}$ más para envío gratis
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg mb-6">
                <span className="font-bold">Total:</span>
                <span
                  className="font-bold text-2xl"
                  aria-label={`Total a pagar: ${total.toFixed(2)} dólares`}
                >
                  {total.toFixed(2)}$
                </span>
              </div>

              <Link to="/checkout">
                <Button
                  size="lg"
                  className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Proceder al pago
                  <ArrowRight className="ml-2" size={20} aria-hidden="true" />
                </Button>
              </Link>

              <Link to="/catalogo" className="block mt-3">
                <Button variant="outline" size="lg" className="w-full border-2">
                  Seguir comprando
                </Button>
              </Link>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                <p>✓ Pago 100% seguro</p>
                <p>✓ Devoluciones gratuitas en 30 días</p>
                <p>✓ Envío en 2-3 días laborables</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
