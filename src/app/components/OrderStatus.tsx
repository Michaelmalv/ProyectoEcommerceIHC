import React from "react";
import { Clock, CheckCircle, Package, Truck, Home } from "lucide-react";

type Layout = "vertical" | "horizontal";

const statusSteps = [
  { key: "procesando", label: "Procesando", icon: <Clock size={20} /> },
  { key: "confirmado", label: "Confirmado", icon: <CheckCircle size={20} /> },
  { key: "preparando", label: "Preparando", icon: <Package size={20} /> },
  { key: "enviado", label: "Enviado", icon: <Truck size={20} /> },
  { key: "entregado", label: "Entregado", icon: <Home size={20} /> },
];

export function OrderStatus({
  status,
  layout = "vertical",
}: {
  status: string;
  layout?: Layout;
}) {
  const currentIndex = statusSteps.findIndex((s) => s.key === status);

  if (layout === "horizontal") {
    return (
      <div>
        <div className="relative">
          <div className="flex justify-between mb-2">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <p className={`text-xs mt-2 text-center ${isCurrent ? "font-bold" : "text-gray-600"}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 -z-10" />
        </div>
      </div>
    );
  }

  // vertical layout
  return (
    <div className="space-y-4">
      {statusSteps.map((step, index) => {
        const isActive = index <= currentIndex;
        const activeBg = index === currentIndex ? "bg-blue-600" : "bg-green-600";

        return (
          <div key={step.key} className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isActive ? `${activeBg} border-green-600 text-white` : "border-gray-300"
              }`}
            >
              <span className="text-xl">{step.icon}</span>
            </div>

            <div className="flex-1">
              <p className={`${isActive ? "font-bold" : "font-semibold"}`}>{step.label}</p>
              <p className="text-sm text-gray-600">{getStepDescription(step.key)}</p>
              {index === currentIndex && (
                <p className="text-sm font-bold text-blue-600 mt-1">{getCurrentStatusText(step.key)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStepDescription(key: string) {
  switch (key) {
    case "procesando":
      return "Tu pedido ha sido registrado";
    case "confirmado":
      return "El pago ha sido procesado exitosamente";
    case "preparando":
      return "Estamos preparando tu pedido para el envío";
    case "enviado":
      return "Recibirás un email cuando tu pedido sea enviado";
    case "entregado":
      return "Pedido entregado";
    default:
      return "Estado del pedido";
  }
}

function getCurrentStatusText(key: string) {
  switch (key) {
    case "procesando":
      return "Procesando pago";
    case "confirmado":
      return "Pago confirmado";
    case "preparando":
      return "Preparando envío";
    case "enviado":
      return "En camino";
    case "entregado":
      return "Entregado";
    default:
      return "";
  }
}

export default OrderStatus;
