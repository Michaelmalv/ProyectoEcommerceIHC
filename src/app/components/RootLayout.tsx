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
import { brandLogoUrl } from "../data/brandAssets";

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[-8rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(168,111,67,0.22),transparent_70%)] blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(214,186,149,0.26),transparent_72%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(24,18,15,0.08),transparent_72%)] blur-3xl" />
      </div>
      {/* WCAG - Operabilidad: Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        aria-label="Saltar al contenido principal"
      >
        Ir al contenido principal
      </a>

      {/* Header - Nielsen #4: Consistencia y estándares */}
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[rgba(248,241,233,0.82)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[color:var(--border)] bg-white/75 px-4 py-3 shadow-[0_18px_50px_-32px_rgba(24,18,15,0.55)] backdrop-blur-xl md:px-5">
            {/* Logo - WCAG Perceptibilidad: alt text descriptivo */}
            <Link
              to="/"
              className="flex items-center gap-3 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="CrowStore - Ir a página principal"
            >
              <img
                src={brandLogoUrl}
                alt="Logo de CrowStore"
                className="h-11 w-11 rounded-full object-cover border border-[color:var(--border)] bg-white shadow-sm"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="hidden sm:block">
                <span className="block font-display text-2xl leading-none">CrowStore</span>
              </div>
            </Link>

            {/* Desktop Navigation - Nielsen #6: Reconocimiento vs recuerdo */}
            <nav className="hidden md:flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/80 p-1" aria-label="Navegación principal">
              <Link
                to="/"
                className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-black ${isActive("/") ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent/60"}`}
                aria-label="Inicio"
              >
                <Home size={20} aria-hidden="true" />
                <span>Inicio</span>
              </Link>
              <Link
                to="/catalogo"
                className={`rounded-full px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-black ${isActive("/catalogo") ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent/60"}`}
              >
                Catálogo
              </Link>
              <Link
                to="/seguimiento"
                className={`rounded-full px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-black ${isActive("/seguimiento") ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent/60"}`}
              >
                Seguimiento
              </Link>
              <Link
                to="/ayuda"
                className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-black ${isActive("/ayuda") ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent/60"}`}
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
              <div className="flex flex-col gap-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 rounded-xl px-3 py-3 hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <Home size={20} />
                  <span>Inicio</span>
                </Link>
                <Link
                  to="/catalogo"
                  className="rounded-xl px-3 py-3 hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  Catálogo
                </Link>
                <Link
                  to="/seguimiento"
                  className="rounded-xl px-3 py-3 hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  Seguimiento
                </Link>
                <Link
                  to="/ayuda"
                  className="flex items-center gap-2 rounded-xl px-3 py-3 hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-black"
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-[1.75rem] border border-[color:var(--border)] bg-white/95 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Buscar productos</DialogTitle>
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
                className="flex-1"
                autoFocus
              />
              <Button type="submit">
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
                      className="flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-all hover:border-[color:var(--border)] hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(241,229,216,0.95))]">
                        {product.images && product.images.length > 1 ? (
                            <div className="flex items-center justify-center w-full h-full">
                              <img
                                src={product.image}
                                alt={`${product.name} - ${product.color}`}
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full h-full p-1 bg-[rgba(248,241,233,0.65)]">
                              <img
                                src={product.image}
                                alt={`${product.name} - ${product.color}`}
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {product.category} • {product.gender} • {product.color}
                        </p>
                      </div>
                      <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                    </Link>
                  ))}
                  {filteredProducts.length > 8 && (
                    <Button
                      variant="outline"
                      className="w-full"
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
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] py-8 text-center">
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
      <main id="main-content" className="relative z-10 min-h-[calc(100vh-220px)]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Footer - Nielsen #4: Consistencia */}
      <footer className="relative z-10 mt-12 border-t border-white/70 bg-[rgba(248,241,233,0.86)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-display mb-3 text-2xl tracking-tight">CrowStore</h3>
              <p className="text-sm text-muted-foreground">
                Tu tienda de ropa en línea. Moda accesible para todos.
              </p>
            </div>
            <div>
              <h3 className="font-display mb-3 text-2xl tracking-tight">Enlaces útiles</h3>
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
              <h3 className="font-display mb-3 text-2xl tracking-tight">Contacto</h3>
              <p className="text-sm text-muted-foreground break-all">
                Email: michael2230@gmail.com<br />
                Tel: +593 0979246567
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-[color:var(--border)] pt-4 text-center text-sm text-muted-foreground">
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
