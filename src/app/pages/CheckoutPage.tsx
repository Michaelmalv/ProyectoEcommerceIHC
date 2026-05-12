import { useState } from "react";
import { useNavigate } from "react-router";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../../utils/api";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #2: Relación entre sistema y mundo real
 * - Formulario estructurado como un proceso de compra real
 * - Pasos numerados que reflejan el flujo natural
 *
 * Nielsen #5: Prevención de errores
 * - Validación de campos requeridos
 * - Formato de tarjeta de crédito visible
 * - Indicadores de campo obligatorio
 *
 * Nielsen #8: Estética minimalista
 * - Solo información esencial solicitada
 * - Agrupación lógica de campos relacionados
 *
 * WCAG 2.2 - Comprensibilidad:
 * - Labels asociados a todos los inputs
 * - Instrucciones claras para cada sección
 * - Mensajes de error específicos
 *
 * WCAG 2.2 - Operabilidad:
 * - Orden lógico de tabulación
 * - Campos de formulario completamente accesibles por teclado
 */

export function CheckoutPage() {
  const navigate = useNavigate();
  const { getCartTotal, clearCart, cartItems } = useCart();
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    setExpiryDate(value);
  };

  const validateExpiryDate = (expiry: string): boolean => {
    if (!expiry || expiry.length !== 5) return false;

    const [month, year] = expiry.split("/");
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) return false;

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    // Validar carrito no vacío
    if (cartItems.length === 0) {
      newErrors.general = "El carrito está vacío. Añade productos antes de continuar.";
    }

    // Nielsen #9: Mensajes de error claros
    if (!formData.get("email")) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("email") as string)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.get("name")) {
      newErrors.name = "El nombre completo es obligatorio";
    }

    if (!formData.get("phone")) {
      newErrors.phone = "El teléfono es obligatorio (para confirmación por SMS)";
    } else {
      const phone = (formData.get("phone") as string).trim();
      // Validar formato: +593999999999 o 0999999999 o +593 999 999 999
      if (!/^(\+593|0)[0-9\s\-()]{6,}$/.test(phone)) {
        newErrors.phone = "Teléfono inválido. Ejemplo: +593999999999 o 0999999999";
      }
    }

    if (!formData.get("address")) {
      newErrors.address = "La dirección es obligatoria";
    }

    if (!formData.get("city")) {
      newErrors.city = "La ciudad es obligatoria";
    }

    if (!formData.get("postal")) {
      newErrors.postal = "El código postal es obligatorio";
    }

    const cardNumber = (formData.get("cardNumber") as string)?.replace(/\s/g, "");
    if (!cardNumber || cardNumber.length < 13) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }

    if (!validateExpiryDate(expiryDate)) {
      newErrors.expiry = "La fecha de expiración debe ser válida y futura";
    }

    const cvv = formData.get("cvv") as string;
    if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      newErrors.cvv = "CVV debe ser de 3 dígitos";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // WCAG Operabilidad: Mover foco al primer error
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setProcessing(true);

    // Crear pedido en la base de datos
    const orderData = {
      items: cartItems,
      total: orderTotal,
      customerInfo: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string || "",
      },
      userId: user?.id, // Incluir el ID del usuario si está autenticado
    };

    createOrder(orderData)
      .then((response) => {
        clearCart();
        navigate("/confirmacion", {
          state: {
            orderId: response.orderId,
            email: formData.get("email"),
            name: formData.get("name"),
            total: orderTotal
          }
        });
      })
      .catch((error) => {
        console.error("Error al crear pedido:", error);
        setErrors({ general: "Error al procesar el pedido. Por favor, inténtalo de nuevo." });
        setProcessing(false);
      });
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 4.99;
  const orderTotal = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/carrito">Carrito</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Checkout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-2">Finalizar compra</h1>
      <p className="text-gray-600 mb-6">
        Completa los siguientes datos para procesar tu pedido
      </p>

      {errors.general && (
        <Card className="p-4 bg-red-50 border-2 border-red-300 mb-6">
          <p className="text-red-800 text-sm font-bold" role="alert">
            ⚠️ {errors.general}
          </p>
        </Card>
      )}

      {/* WCAG Robustez: Formulario semántico */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Contact Info */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl font-bold">Información de contacto</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="font-bold">
                    Email <span className="text-red-600" aria-label="obligatorio">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="border-2 focus:ring-2 focus:ring-black"
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name" className="font-bold">
                    Nombre completo <span className="text-red-600" aria-label="obligatorio">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="border-2 focus:ring-2 focus:ring-black"
                    placeholder="Juan Pérez"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="font-bold">
                    Teléfono <span className="text-red-600" aria-label="obligatorio">*</span>
                    <span className="text-sm text-gray-600 font-normal ml-1">(para confirmación por SMS)</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    aria-required="true"
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                    className="border-2 focus:ring-2 focus:ring-black"
                    placeholder="+593 999 999 999"
                  />
                  {errors.phone ? (
                    <p id="phone-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.phone}
                    </p>
                  ) : (
                    <p id="phone-help" className="text-xs text-gray-600 mt-1">
                      Formato: +593 o 0 (ej: +593999999999 o 0999999999)
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Step 2: Shipping Address */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl font-bold">Dirección de envío</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" className="font-bold">
                    Dirección <span className="text-red-600" aria-label="obligatorio">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={errors.address ? "true" : "false"}
                    className="border-2 focus:ring-2 focus:ring-black"
                    placeholder="Calle Principal 123"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1" role="alert">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="font-bold">Ciudad *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      aria-required="true"
                      aria-invalid={errors.city ? "true" : "false"}
                      aria-describedby={errors.city ? "city-error" : undefined}
                      className="border-2 focus:ring-2 focus:ring-black"
                      placeholder="Madrid"
                    />
                    {errors.city && (
                      <p id="city-error" className="text-sm text-red-600 mt-1" role="alert">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postal" className="font-bold">Código postal *</Label>
                    <Input
                      id="postal"
                      name="postal"
                      type="text"
                      required
                      aria-required="true"
                      aria-invalid={errors.postal ? "true" : "false"}
                      aria-describedby={errors.postal ? "postal-error" : undefined}
                      className="border-2 focus:ring-2 focus:ring-black"
                      placeholder="28001"
                    />
                    {errors.postal && (
                      <p id="postal-error" className="text-sm text-red-600 mt-1" role="alert">
                        {errors.postal}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3: Payment Method */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl font-bold">Método de pago</h2>
              </div>

              <div className="border-2 p-4 rounded bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} aria-hidden="true" />
                  <span className="font-bold">Tarjeta de crédito/débito</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="font-bold">
                      Número de tarjeta *
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="border-2 focus:ring-2 focus:ring-black"
                      maxLength={19}
                      required
                      aria-required="true"
                      aria-invalid={errors.cardNumber ? "true" : "false"}
                      aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                    />
                    {errors.cardNumber && (
                      <p id="cardNumber-error" className="text-sm text-red-600 mt-1" role="alert">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="font-bold">
                        Fecha de expiración *
                      </Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        type="text"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        className="border-2 focus:ring-2 focus:ring-black"
                        maxLength={5}
                        aria-invalid={errors.expiry ? "true" : "false"}
                        aria-describedby={errors.expiry ? "expiry-error" : undefined}
                        required
                      />
                      {errors.expiry && (
                        <p id="expiry-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.expiry}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="font-bold">
                        CVV *
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        placeholder="123"
                        className="border-2 focus:ring-2 focus:ring-black"
                        maxLength={3}
                        aria-required="true"
                        aria-invalid={errors.cvv ? "true" : "false"}
                        aria-describedby={errors.cvv ? "cvv-error" : "cvv-help"}
                        required
                      />
                      {errors.cvv ? (
                        <p id="cvv-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.cvv}
                        </p>
                      ) : (
                        <p id="cvv-help" className="text-xs text-gray-600 mt-1">
                          3 dígitos en el reverso
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-bold">{subtotal.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `${shipping.toFixed(2)}$`
                    )}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg mb-6">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-2xl">{orderTotal.toFixed(2)}$</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                disabled={processing}
                aria-label={processing ? "Procesando pedido" : "Confirmar y pagar"}
              >
                {processing ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <Lock className="mr-2" size={20} aria-hidden="true" />
                    Confirmar y pagar
                  </>
                )}
              </Button>

              <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" aria-hidden="true" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" aria-hidden="true" />
                  <span>Cifrado SSL</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
