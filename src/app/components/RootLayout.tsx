import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  Search,
  HelpCircle,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { CartProvider, useCart } from "../context/CartContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { products } from "../data/products";

/**
 * ANÁLISIS HEURÍSTICO - Nielsen #3: Control y libertad del usuario
 * - Navegación siempre visible con opciones para retroceder
 * - Breadcrumbs en páginas internas para orientación
 *
 * WCAG 2.2 - Operabilidad: Navegación por teclado
 * - Todos los enlaces tienen foco visible
 * - Skip to content link para lectores de pantalla
 */

function RootLayoutContent() {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const cartItems = getCartCount();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Cerrar menú móvil al cambiar de página y hacer scroll al inicio
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/catalogo?busqueda=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* WCAG - Operabilidad: Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white"
        aria-label="Saltar al contenido principal"
      >
        Ir al contenido principal
      </a>

      {/* Header - Nielsen #4: Consistencia y estándares */}
      <header className="bg-white border-b-2 border-gray-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - WCAG Perceptibilidad: alt text descriptivo */}
            <Link
              to="/"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="CrowStore - Ir a página principal"
            >
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl" aria-hidden="true">C</span>
              </div>
              <span className="text-2xl font-bold">CrowStore</span>
            </Link>

            {/* Desktop Navigation - Nielsen #6: Reconocimiento vs recuerdo */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
              <Link
                to="/"
                className="flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-black px-2 py-1"
                aria-label="Inicio"
              >
                <Home size={20} aria-hidden="true" />
                <span>Inicio</span>
              </Link>
              <Link
                to="/catalogo"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-black px-2 py-1"
              >
                Catálogo
              </Link>
              <Link
                to="/ayuda"
                className="flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-black px-2 py-1"
                aria-label="Ayuda y preguntas frecuentes"
              >
                <HelpCircle size={20} aria-hidden="true" />
                <span>Ayuda</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search - Nielsen #7: Flexibilidad y eficiencia de uso */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar productos"
              >
                <Search size={20} />
              </Button>

              {/* Cart - WCAG Perceptibilidad: Badge con contraste adecuado */}
              <Link to="/carrito">
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  aria-label={`Carrito de compras, ${cartItems} artículos`}
                >
                  <ShoppingCart size={20} />
                  {cartItems > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 bg-black text-white"
                      aria-hidden="true"
                    >
                      {cartItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Profile / Login */}
              {user ? (
                <div className="flex gap-2">
                  <Link to="/perfil">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Mi perfil"
                    >
                      <User size={20} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                    className="hidden sm:flex"
                  >
                    <LogOut size={20} />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="hidden sm:flex"
                    aria-label="Iniciar sesión"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="sm:hidden"
                    aria-label="Iniciar sesión"
                  >
                    <User size={20} />
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu - Nielsen #10: Ayuda y documentación */}
          {mobileMenuOpen && (
            <nav
              id="mobile-menu"
              className="md:hidden mt-4 pb-4 border-t-2 border-gray-200 pt-4"
              aria-label="Menú móvil"
            >
              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <Home size={20} />
                  <span>Inicio</span>
                </Link>
                <Link
                  to="/catalogo"
                  className="px-2 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  Catálogo
                </Link>
                <Link
                  to="/ayuda"
                  className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <HelpCircle size={20} />
                  <span>Ayuda</span>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buscar productos</DialogTitle>
            <DialogDescription>
              Encuentra productos por nombre, categoría o color
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Buscar por nombre, categoría o color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-2 focus:ring-2 focus:ring-black"
                autoFocus
              />
              <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                Buscar
              </Button>
            </div>
          </form>

          {searchQuery && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                {filteredProducts.length} resultados encontrados
              </p>

              {filteredProducts.length > 0 ? (
                <div className="space-y-2">
                  {filteredProducts.slice(0, 8).map((product) => (
                    <Link
                      key={product.id}
                      to={`/producto/${product.id}`}
                      className="flex items-center gap-3 p-3 border-2 hover:border-black transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="w-16 h-16 border-2 border-gray-300 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={product.image}
                          alt={`${product.name} - ${product.color}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{product.name}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {product.category} • {product.gender} • {product.color}
                        </p>
                      </div>
                      <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                    </Link>
                  ))}
                  {filteredProducts.length > 8 && (
                    <Button
                      variant="outline"
                      className="w-full border-2"
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/catalogo?busqueda=${encodeURIComponent(searchQuery)}`);
                      }}
                    >
                      Ver todos los {filteredProducts.length} resultados
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed">
                  <p className="text-gray-600 mb-2">No se encontraron productos</p>
                  <p className="text-sm text-gray-500">
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Main Content - WCAG Robustez: Estructura semántica */}
      <main id="main-content" className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>

      {/* Footer - Nielsen #4: Consistencia */}
      <footer className="bg-white border-t-2 border-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">CrowStore</h3>
              <p className="text-sm text-gray-600">
                Tu tienda de ropa en línea. Moda accesible para todos.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Enlaces útiles</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/seguimiento"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    Seguimiento de pedido
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ayuda#preguntas-frecuentes"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-black"
                    onClick={() => {
                      setTimeout(() => {
                        const element = document.getElementById('preguntas-frecuentes');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                  >
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalogo"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-black"
                    onClick={() => {
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                    }}
                  >
                    Catálogo completo
                  </Link>
                </li>
              </ul>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold mb-3">Contacto</h3>
              <p className="text-sm text-gray-600 break-all">
                Email: michael2230@gmail.com<br />
                Tel: +593 0979246567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2026 CrowStore. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutContent />
      </CartProvider>
    </AuthProvider>
  );
}
