import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #1: Visibilidad del estado del sistema
 * - Confirmación clara del pedido realizado
 * - Número de pedido visible
 * - Estado del seguimiento en tiempo real
 *
 * Nielsen #10: Ayuda y documentación
 * - Información clara de qué hacer después
 * - Opciones para continuar comprando o ver perfil
 */

export function ConfirmationPage() {
  const location = useLocation();
  const { orderId, email, name, total } = location.state || {};
  const [trackingStatus, setTrackingStatus] = useState("procesando");

  useEffect(() => {
    // Simulación de cambio de estado
    const timer1 = setTimeout(() => setTrackingStatus("confirmado"), 3000);
    const timer2 = setTimeout(() => setTrackingStatus("preparando"), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!orderId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="p-12 text-center border-2">
          <h1 className="text-2xl font-bold mb-4">No hay pedido para confirmar</h1>
          <Link to="/catalogo">
            <Button className="bg-black text-white hover:bg-gray-800">
              Ir al catálogo
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (trackingStatus) {
      case "procesando":
        return {
          text: "Procesando pago",
          color: "text-yellow-600",
          icon: "⏳",
        };
      case "confirmado":
        return {
          text: "Pago confirmado",
          color: "text-blue-600",
          icon: "✓",
        };
      case "preparando":
        return {
          text: "Preparando envío",
          color: "text-green-600",
          icon: "📦",
        };
      default:
        return {
          text: "Procesando",
          color: "text-gray-600",
          icon: "⏳",
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border border-green-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.98))] p-8 text-center shadow-[0_24px_70px_-42px_rgba(24,18,15,0.55)]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-600 shadow-lg">
            <CheckCircle size={48} className="text-white" aria-hidden="true" />
          </div>
          <p className="mb-3 inline-flex rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-green-700">
            Confirmación final
          </p>
          <h1 className="font-display text-4xl tracking-tight mb-2">¡Pedido confirmado!</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Gracias por tu compra, {name || "cliente"}
          </p>
          <div className="rounded-[1.5rem] border border-green-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Número de pedido</p>
            <p className="font-display text-3xl tracking-tight">{orderId}</p>
          </div>
        </div>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl mb-4 tracking-tight">Detalles del pedido</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total pagado</p>
              <p className="text-3xl font-semibold">{total?.toFixed(2) || "0.00"}$</p>
            </div>
            <Separator />
            <div className="overflow-hidden">
              <p className="text-sm text-muted-foreground">Email de confirmación</p>
              <p className="break-all text-sm font-semibold sm:text-base">{email || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha del pedido</p>
              <p className="font-semibold">{new Date().toLocaleDateString("es-ES")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl mb-4 tracking-tight">Información de envío</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Destinatario</p>
              <p className="font-semibold">{name || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-semibold">Calle Principal 12 de Octubre</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tiempo estimado</p>
              <p className="font-semibold">2-3 días laborables</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tracking Simulation */}
      <Card className="p-6">
        <h2 className="font-display mb-6 flex items-center gap-2 text-2xl tracking-tight">
          <Truck size={24} aria-hidden="true" />
          Seguimiento del pedido
        </h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                trackingStatus === "procesando" ||
                trackingStatus === "confirmado" ||
                trackingStatus === "preparando"
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-gray-300"
              }`}
            >
              <span className="text-xl">
                {trackingStatus === "procesando" ? "⏳" : "✓"}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold">Pedido recibido</p>
              <p className="text-sm text-gray-600">Tu pedido ha sido registrado</p>
              {trackingStatus === "procesando" && (
                <p className={`text-sm font-bold ${status.color} mt-1`}>
                  {status.icon} {status.text}
                </p>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                trackingStatus === "confirmado" || trackingStatus === "preparando"
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-gray-300"
              }`}
            >
              <Package size={24} />
            </div>
            <div className="flex-1">
              <p className="font-bold">Pago confirmado</p>
              <p className="text-sm text-gray-600">El pago ha sido procesado exitosamente</p>
              {trackingStatus === "confirmado" && (
                <p className={`text-sm font-bold ${status.color} mt-1`}>
                  {status.icon} {status.text}
                </p>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                trackingStatus === "preparando"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-300"
              }`}
            >
              <Truck size={24} />
            </div>
            <div className="flex-1">
              <p className="font-bold">Preparando envío</p>
              <p className="text-sm text-gray-600">
                Estamos preparando tu pedido para el envío
              </p>
              {trackingStatus === "preparando" && (
                <p className={`text-sm font-bold ${status.color} mt-1`}>
                  {status.icon} {status.text} (actualización en tiempo real)
                </p>
              )}
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
              <Home size={24} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-400">En camino</p>
              <p className="text-sm text-gray-600">
                Recibirás un email cuando tu pedido sea enviado
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link to="/catalogo">
          <Button size="lg" className="w-full sm:w-auto">
            Seguir comprando
          </Button>
        </Link>
        <Link to="/perfil">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Ver mis pedidos
          </Button>
        </Link>
      </div>

      {/* Help */}
      <Card className="p-6">
        <h3 className="font-display mb-2 text-2xl tracking-tight">¿Necesitas ayuda?</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Si tienes alguna pregunta sobre tu pedido, contáctanos:
        </p>
        <div className="text-sm space-y-1 overflow-hidden">
          <p className="break-all">
            <strong>Email:</strong> michael2230@gmail.com
          </p>
          <p>
            <strong>Teléfono:</strong> +593 0979246567
          </p>
          <p>
            <strong>Horario:</strong> L-V: 9:00 - 18:00
          </p>
        </div>
      </Card>
    </div>
  );
}
