import { Link } from "react-router";
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";

/**
 * Nielsen #9: Ayuda a reconocer y recuperar errores
 * - Mensaje claro del problema (404)
 * - Opciones para recuperarse del error
 */

export function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="border-2 border-gray-300 p-12 bg-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <Home className="mr-2" size={20} aria-hidden="true" />
              Volver al inicio
            </Button>
          </Link>
          <Link to="/catalogo">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-black focus:ring-2 focus:ring-black"
            >
              <Search className="mr-2" size={20} aria-hidden="true" />
              Ir al catálogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
