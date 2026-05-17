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
import {
  validateEmail,
  validateFullName,
  validatePhone,
  validateAddress,
  validateCity,
  validatePostalCode,
  validateLuhn,
  validateCVV,
  validateExpiryDate,
  formatCardNumber,
  formatExpiryDate,
  formatCVV,
} from "../utils/validators";

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
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value);
    setCvv(formatted);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    // Validar carrito no vacío
    if (cartItems.length === 0) {
      newErrors.general = "El carrito está vacío. Añade productos antes de continuar.";
    }

    // Email
    const email = (formData.get("email") as string)?.trim();
    if (!email || !validateEmail(email)) {
      newErrors.email = "Email inválido (ej: usuario@ejemplo.com)";
    }

    // Nombre completo
    const name = (formData.get("name") as string)?.trim();
    if (!name || !validateFullName(name)) {
      newErrors.name = "Nombre debe tener 2-100 caracteres (solo letras y espacios)";
    }

    // Teléfono (opcional)
    const phone = (formData.get("phone") as string)?.trim();
    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Teléfono debe ser: 0999999999 o +593999999999 (solo números, 10 dígitos)";
    }

    // Dirección
    const address = (formData.get("address") as string)?.trim();
    if (!address || !validateAddress(address)) {
      newErrors.address = "Dirección debe tener 5-200 caracteres";
    }

    // Ciudad
    const city = (formData.get("city") as string)?.trim();
    if (!city || !validateCity(city)) {
      newErrors.city = "Ciudad debe tener 2-50 caracteres (solo letras)";
    }

    // Código postal
    const postal = (formData.get("postal") as string)?.trim();
    if (!postal || !validatePostalCode(postal)) {
      newErrors.postal = "Código postal debe ser 5 dígitos (ej: 28001)";
    }

    // Tarjeta de crédito - validar con Luhn
    const cardNumberClean = cardNumber.replace(/\s/g, "");
    if (!cardNumberClean || !validateLuhn(cardNumberClean)) {
      newErrors.cardNumber = "Número de tarjeta inválido (falla validación Luhn)";
    }

    // Fecha de expiración
    if (!expiryDate || !validateExpiryDate(expiryDate)) {
      newErrors.expiry = "Fecha de expiración debe ser válida y futura (MM/AA)";
    }

    // CVV
    if (!cvv || !validateCVV(cvv)) {
      newErrors.cvv = "CVV debe ser exactamente 3 dígitos";
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
        name: name,
        email: email,
        address: address,
        phone: phone || "",
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
                    aria-describedby={errors.name ? "name-error" : "name-help"}
                    className="border-2 focus:ring-2 focus:ring-black"
                    placeholder="Juan Pérez"
                                      onKeyDown={(e) => {
                                        if (!/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.name}
                    </p>
                  )}
                  {!errors.name && (
                    <p id="name-help" className="text-xs text-gray-600 mt-1">
                      2-50 caracteres (solo letras y espacios)
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="font-bold">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                    className="border-2 focus:ring-2 focus:ring-black"
                    placeholder="0999999999"
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const maxLength = e.target.value.startsWith('+') ? 13 : 10;
                      if (e.target.value.length > maxLength) {
                        e.target.value = e.target.value.slice(0, maxLength);
                      }
                    }}
                  />
                  {errors.phone ? (
                    <p id="phone-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.phone}
                    </p>
                  ) : (
                    <p id="phone-help" className="text-xs text-gray-600 mt-1">
                      10 dígitos (ej: 0999999999)
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
                    aria-describedby={errors.address ? "address-error" : "address-help"}
                    className="border-2 focus:ring-2 focus:ring-black"
                    placeholder="Calle Principal 123"
                  />
                  {errors.address && (
                    <p id="address-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.address}
                    </p>
                  )}
                  {!errors.address && (
                    <p id="address-help" className="text-xs text-gray-600 mt-1">
                      5-100 caracteres
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
                      aria-describedby={errors.city ? "city-error" : "city-help"}
                      className="border-2 focus:ring-2 focus:ring-black"
                      placeholder="Quito"
                    />
                    {errors.city && (
                      <p id="city-error" className="text-sm text-red-600 mt-1" role="alert">
                        {errors.city}
                      </p>
                    )}
                    {!errors.city && (
                      <p id="city-help" className="text-xs text-gray-600 mt-1">
                        2-20 caracteres, solo letras
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
                      aria-describedby={errors.postal ? "postal-error" : "postal-help"}
                      className="border-2 focus:ring-2 focus:ring-black"
                      placeholder="28001"
                      inputMode="numeric"
                      maxLength={5}
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.postal && (
                      <p id="postal-error" className="text-sm text-red-600 mt-1" role="alert">
                        {errors.postal}
                      </p>
                    )}
                    {!errors.postal && (
                      <p id="postal-help" className="text-xs text-gray-600 mt-1">
                        5 dígitos (ej: 28001)
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
                      aria-describedby={errors.cardNumber ? "cardNumber-error" : "cardNumber-help"}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.cardNumber && (
                      <p id="cardNumber-error" className="text-sm text-red-600 mt-1" role="alert">
                        {errors.cardNumber}
                      </p>
                    )}
                    {!errors.cardNumber && (
                      <p id="cardNumber-help" className="text-xs text-gray-600 mt-1">
                        16 dígitos, se formatea automáticamente
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
                        aria-describedby={errors.expiry ? "expiry-error" : "expiry-help"}
                        required
                        inputMode="numeric"
                        onKeyDown={(e) => {
                          if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.expiry && (
                        <p id="expiry-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.expiry}
                        </p>
                      )}
                      {!errors.expiry && (
                        <p id="expiry-help" className="text-xs text-gray-600 mt-1">
                          MM/AA
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
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        onKeyDown={(e) => {
                          if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.cvv ? (
                        <p id="cvv-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.cvv}
                        </p>
                      ) : (
                        <p id="cvv-help" className="text-xs text-gray-600 mt-1">
                          Exactamente 3 dígitos en el reverso
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
