import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { User, Package, Settings } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { useAuth } from "../context/AuthContext";
import { getUserOrders, getUserProfile } from "../../utils/api";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #4: Consistencia y estándares
 * - Organización típica de perfil de usuario
 * - Tabs para separar diferentes secciones
 *
 * Nielsen #6: Reconocimiento antes que recuerdo
 * - Iconos que ayudan a identificar secciones
 * - Historial visible de pedidos
 */

export function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: { pathname: "/perfil" } } });
      return;
    }

    if (user) {
      Promise.all([
        getUserOrders(user.id),
        getUserProfile(user.id),
      ])
        .then(([ordersData, profileData]) => {
          setOrders(ordersData);
          setProfile(profileData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar datos del perfil:", error);
          setLoading(false);
        });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mi perfil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Mi perfil</h1>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="w-full justify-start grid grid-cols-3 bg-transparent p-0 h-auto border-b-2 border-gray-300 rounded-none">
          <TabsTrigger value="account" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent">
            <User size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Mi cuenta</span>
            <span className="sm:hidden text-[10px]">Cuenta</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent">
            <Package size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Mis pedidos</span>
            <span className="sm:hidden text-[10px]">Pedidos</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent">
            <Settings size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Configuración</span>
            <span className="sm:hidden text-[10px]">Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="p-6 border-2">
            <h2 className="text-xl font-bold mb-4">Información personal</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nombre</p>
                  <p className="font-bold">{profile?.full_name || user.email}</p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-bold break-all text-sm sm:text-base">{user.email}</p>
                </div>
              </div>
              {profile?.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="font-bold">{profile.phone}</p>
                </div>
              )}
              {profile?.default_address && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dirección</p>
                  <p className="font-bold break-words">{profile.default_address}</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="p-6 border-2">
            <h2 className="text-xl font-bold mb-4">Historial de pedidos</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed">
                <p className="text-gray-600 mb-2">No tienes pedidos aún</p>
                <Link to="/catalogo">
                  <Button className="mt-4 bg-black text-white hover:bg-gray-800">
                    Ir a comprar
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border-2 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div>
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.order_items?.length || 0} producto(s)
                    </p>
                  </div>
                  <div className="sm:text-right flex flex-col items-end gap-3">
                    <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                    <p
                      className={`text-sm capitalize ${
                        order.status === "entregado"
                          ? "text-green-600"
                          : order.status === "enviado"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </p>
                    <div>
                      <Link to="/seguimiento" state={{ orderId: order.id }}>
                        <Button className="bg-black text-white">Rastrear pedido</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6 border-2">
            <h2 className="text-xl font-bold mb-4">Configuración</h2>
            <div className="space-y-4">
              <Button asChild variant="outline" className="w-full border-2 justify-start text-left break-words whitespace-normal h-auto py-3">
                <Link to="/perfil/cambiar-contrasena" className="block">Cambiar contraseña</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 justify-start text-left break-words whitespace-normal h-auto py-3">
                <Link to="/perfil/privacidad" className="block">Configuración de privacidad</Link>
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
