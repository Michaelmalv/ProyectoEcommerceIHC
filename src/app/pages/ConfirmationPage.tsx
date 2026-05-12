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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <Card className="p-8 border-2 border-green-600 bg-green-50 mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={48} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Pedido confirmado!</h1>
          <p className="text-lg text-gray-700 mb-4">
            Gracias por tu compra, {name || "cliente"}
          </p>
          <div className="bg-white border-2 border-green-600 px-6 py-3 rounded">
            <p className="text-sm text-gray-600">Número de pedido</p>
            <p className="text-2xl font-bold">{orderId}</p>
          </div>
        </div>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">Detalles del pedido</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total pagado</p>
              <p className="text-2xl font-bold">{total?.toFixed(2) || "0.00"}$</p>
            </div>
            <Separator />
            <div className="overflow-hidden">
              <p className="text-sm text-gray-600">Email de confirmación</p>
              <p className="font-bold break-all text-sm sm:text-base">{email || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha del pedido</p>
              <p className="font-bold">{new Date().toLocaleDateString("es-ES")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">Información de envío</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Destinatario</p>
              <p className="font-bold">{name || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dirección</p>
              <p className="font-bold">Calle Principal 12 de Octubre</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tiempo estimado</p>
              <p className="font-bold">2-3 días laborables</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tracking Simulation */}
      <Card className="p-6 border-2 mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/catalogo">
          <Button size="lg" className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
            Seguir comprando
          </Button>
        </Link>
        <Link to="/perfil">
          <Button variant="outline" size="lg" className="border-2 w-full sm:w-auto">
            Ver mis pedidos
          </Button>
        </Link>
      </div>

      {/* Help */}
      <Card className="mt-6 p-6 border-2 bg-gray-50">
        <h3 className="font-bold mb-2">¿Necesitas ayuda?</h3>
        <p className="text-sm text-gray-600 mb-3">
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
