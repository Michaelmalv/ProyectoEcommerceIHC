import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreditCard, Lock, CheckCircle, Loader2 } from "lucide-react";
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
import { createOrder, getUserProfile } from "../../utils/api";
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");

  // Cargar datos del usuario autenticado para autocompletar o desde localStorage
  useEffect(() => {
    const loadData = async () => {
      // Primero intentar cargar desde localStorage (datos persistentes)
      const savedCheckout = localStorage.getItem('checkout-form');
      if (savedCheckout) {
        try {
          const data = JSON.parse(savedCheckout);
          setEmail(data.email || "");
          setName(data.name || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setCity(data.city || "");
          setPostal(data.postal || "");
          setCardNumber(data.cardNumber || "");
          setExpiryDate(data.expiryDate || "");
          setCvv(data.cvv || "");
          return; // Ya cargó desde localStorage, no cargar desde API
        } catch (err) {
          console.error('Error parsing localStorage checkout data:', err);
        }
      }
      
      // Si no hay datos en localStorage, cargar del perfil del usuario
      if (user?.id) {
        try {
          const profile = await getUserProfile(user.id);
          if (profile) {
            setEmail(user.email || "");
            setName(profile.name || "");
            setPhone(profile.phone || "");
            setAddress(profile.address || "");
            setCity(profile.city || "");
            setPostal(profile.postal || "");
          }
        } catch (err) {
          // Usuario logueado pero sin perfil lleno, usar lo que tenemos
          setEmail(user.email || "");
        }
      }
    };
    loadData();
  }, [user]);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    const checkoutData = {
      email,
      name,
      phone,
      address,
      city,
      postal,
      cardNumber,
      expiryDate,
      cvv
    };
    localStorage.setItem('checkout-form', JSON.stringify(checkoutData));
  }, [email, name, phone, address, city, postal, cardNumber, expiryDate, cvv]);

  // Limpiar localStorage después de procesar un pedido exitosamente
  const clearCheckoutForm = () => {
    localStorage.removeItem('checkout-form');
  };

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
    const newErrors: Record<string, string> = {};

    // Validar carrito no vacío
    if (cartItems.length === 0) {
      newErrors.general = "El carrito está vacío. Añade productos antes de continuar.";
    }

    // Email
    const emailTrim = email.trim();
    if (!emailTrim || !validateEmail(emailTrim)) {
      newErrors.email = "Email inválido (ej: usuario@ejemplo.com)";
    }

    // Nombre completo
    const nameTrim = name.trim();
    if (!nameTrim || !validateFullName(nameTrim)) {
      newErrors.name = "Nombre debe tener 2-100 caracteres (solo letras y espacios)";
    }

    // Teléfono (opcional)
    const phoneTrim = phone.trim();
    if (phoneTrim && !validatePhone(phoneTrim)) {
      newErrors.phone = "Teléfono debe ser: 0999999999 o +593999999999 (solo números, 10 dígitos)";
    }

    // Dirección
    const addressTrim = address.trim();
    if (!addressTrim || !validateAddress(addressTrim)) {
      newErrors.address = "Dirección debe tener 5-200 caracteres";
    }

    // Ciudad
    const cityTrim = city.trim();
    if (!cityTrim || !validateCity(cityTrim)) {
      newErrors.city = "Ciudad debe tener 2-50 caracteres (solo letras)";
    }

    // Código postal
    const postalTrim = postal.trim();
    if (!postalTrim || !validatePostalCode(postalTrim)) {
      newErrors.postal = "Código postal debe ser 6 dígitos (ej: 280011)";
    }

    // Tarjeta de crédito - validar con Luhn
    const cardNumberClean = cardNumber.replace(/\s/g, "");
    if (!cardNumberClean || !validateLuhn(cardNumberClean)) {
      newErrors.cardNumber = "Número de tarjeta inválido";
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
        name: nameTrim,
        email: emailTrim,
        address: addressTrim,
        phone: phoneTrim || "",
      },
      userId: user?.id, // Incluir el ID del usuario si está autenticado
    };

    createOrder(orderData)
      .then((response) => {
        clearCart();
        clearCheckoutForm(); // Limpiar datos del formulario de localStorage
        navigate("/confirmacion", {
          state: {
            orderId: response.orderId,
            email: emailTrim,
            name: nameTrim,
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
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <Breadcrumb>
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
      </div>

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,250,244,0.96),rgba(238,224,208,0.9))] p-6 shadow-[0_24px_70px_-42px_rgba(24,18,15,0.55)] md:p-8">
        <h1 className="font-display text-4xl tracking-tight">Finalizar compra</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Completa los siguientes datos para procesar tu pedido con una experiencia más cercana a una tienda real.
        </p>
      </section>

      {errors.general && (
        <Card className="border border-red-200 bg-red-50/90 p-4">
          <p className="text-red-800 text-sm font-bold" role="alert">
            ⚠️ {errors.general}
          </p>
        </Card>
      )}

      {/* WCAG Robustez: Formulario semántico */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {/* Step 1: Contact Info */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                  1
                </div>
                <h2 className="font-display text-2xl tracking-tight">Información de contacto</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="font-semibold">
                    Email <span className="text-red-600" aria-label="obligatorio">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="focus:ring-2 focus:ring-black"
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name" className="font-semibold">
                    Nombre completo <span className="text-red-600" aria-label="obligatorio">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : "name-help"}
                    className="focus:ring-2 focus:ring-black"
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
                  <Label htmlFor="phone" className="font-semibold">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      const maxLength = val.startsWith('+') ? 13 : 10;
                      if (val.length <= maxLength) {
                        setPhone(val);
                      }
                    }}
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                    className="focus:ring-2 focus:ring-black"
                    placeholder="0999999999"
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        e.preventDefault();
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
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                  2
                </div>
                <h2 className="font-display text-2xl tracking-tight">Dirección de envío</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" className="font-semibold">
                    Dirección <span className="text-red-600" aria-label="obligatorio">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.address ? "true" : "false"}
                    aria-describedby={errors.address ? "address-error" : "address-help"}
                    className="focus:ring-2 focus:ring-black"
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
                    <Label htmlFor="city" className="font-semibold">Ciudad *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onKeyDown={(e) => {
                        if (!/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      aria-required="true"
                      aria-invalid={errors.city ? "true" : "false"}
                      aria-describedby={errors.city ? "city-error" : "city-help"}
                      className="focus:ring-2 focus:ring-black"
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
                    <Label htmlFor="postal" className="font-semibold">Código postal *</Label>
                    <Input
                      id="postal"
                      name="postal"
                      type="text"
                      required
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      aria-required="true"
                      aria-invalid={errors.postal ? "true" : "false"}
                      aria-describedby={errors.postal ? "postal-error" : "postal-help"}
                      className="focus:ring-2 focus:ring-black"
                      placeholder="280011"
                      inputMode="numeric"
                      maxLength={6}
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
                        6 dígitos (ej: 280011)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3: Payment Method */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                  3
                </div>
                <h2 className="font-display text-2xl tracking-tight">Método de pago</h2>
              </div>

              <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(241,231,219,0.85))] p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} aria-hidden="true" />
                  <span className="font-semibold">Tarjeta de crédito/débito</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="font-semibold">
                      Número de tarjeta *
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="focus:ring-2 focus:ring-black"
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
                      <Label htmlFor="expiry" className="font-semibold">
                        Fecha de expiración *
                      </Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        type="text"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        className="focus:ring-2 focus:ring-black"
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
                      <Label htmlFor="cvv" className="font-semibold">
                        CVV *
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        placeholder="123"
                        className="focus:ring-2 focus:ring-black"
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
            <Card className="sticky top-28 p-6">
              <h2 className="font-display text-2xl mb-4 tracking-tight">Resumen del pedido</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `${shipping.toFixed(2)}$`
                    )}
                  </span>
                </div>
                {subtotal < 50 && subtotal > 0 && (
                  <p className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    ℹ️ Añade {(50 - subtotal).toFixed(2)}$ más para envío gratis
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg mb-6">
                <span className="font-bold">Total:</span>
                <span className="font-semibold text-3xl">{orderTotal.toFixed(2)}$</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={processing}
                aria-label={processing ? "Procesando pedido" : "Confirmar y pagar"}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} aria-hidden="true" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2" size={20} aria-hidden="true" />
                    Confirmar y pagar
                  </>
                )}
              </Button>

              <div className="mt-6 space-y-2 border-t pt-6 text-sm text-muted-foreground">
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
