import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Package, CheckCircle, Truck, Clock } from "lucide-react";
import { getOrderById } from "../../utils/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

export function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const orderData = await getOrderById(orderId.trim());
      setOrder(orderData);
    } catch (err) {
      setError("No se encontró el pedido. Verifica el número de pedido.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "procesando":
        return <Clock className="text-yellow-600" size={32} />;
      case "confirmado":
        return <CheckCircle className="text-green-600" size={32} />;
      case "preparando":
        return <Package className="text-blue-600" size={32} />;
      case "enviado":
      case "entregado":
        return <Truck className="text-green-600" size={32} />;
      default:
        return <Package className="text-gray-600" size={32} />;
    }
  };

  const statusSteps = [
    { key: "procesando", label: "Procesando" },
    { key: "confirmado", label: "Confirmado" },
    { key: "preparando", label: "Preparando" },
    { key: "enviado", label: "Enviado" },
    { key: "entregado", label: "Entregado" },
  ];

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Seguimiento de pedido</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Seguimiento de Pedido</h1>

      <Card className="p-6 border-2 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label htmlFor="orderId" className="font-bold">
              Número de Pedido
            </Label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="ORD-123456789"
              className="border-2 focus:ring-2 focus:ring-black"
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              Ingresa el número de pedido que recibiste por email
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-300 text-red-800 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Buscando..." : "Buscar Pedido"}
          </Button>
        </form>
      </Card>

      {order && (
        <>
          {/* Estado del pedido */}
          <Card className="p-6 border-2 mb-6">
            <div className="flex items-center gap-4 mb-6">
              {getStatusIcon(order.status)}
              <div>
                <h2 className="text-2xl font-bold">Pedido {order.id}</h2>
                <p className="text-gray-600 capitalize">Estado: {order.status}</p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="relative">
              <div className="flex justify-between mb-2">
                {statusSteps.map((step, index) => {
                  const currentIndex = getCurrentStepIndex(order.status);
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
                      <p
                        className={`text-xs mt-2 text-center ${
                          isCurrent ? "font-bold" : "text-gray-600"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 -z-10" />
            </div>
          </Card>

          {/* Información del pedido */}
          <Card className="p-6 border-2 mb-6">
            <h3 className="text-xl font-bold mb-4">Información del Pedido</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-bold">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-bold break-all text-sm">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dirección de envío</p>
                <p className="font-bold break-words">{order.customer_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de pedido</p>
                <p className="font-bold">
                  {new Date(order.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </Card>

          {/* Detalles de productos */}
          <Card className="p-6 border-2 mb-6">
            <h3 className="text-xl font-bold mb-4">Productos</h3>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-2 p-3"
                >
                  <div className="flex-1">
                    <p className="font-bold">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      Talla: {item.selected_size} • Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">
                    ${(Number(item.product_price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t-2 mt-4 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
