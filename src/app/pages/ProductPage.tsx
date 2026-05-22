import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ShoppingCart, ArrowLeft, Info, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Alert, AlertDescription } from "../components/ui/alert";
import { products, sizes } from "../data/products";
import SizeGuideModal from "../components/SizeGuideModal";
import { useCart } from "../context/CartContext";
import { getProductById } from "../../utils/api";
import { getPublicUrlFromPath } from "../../utils/storage";

/**
 * ANÁLISIS HEURÍSTICO:
 *
 * Nielsen #1: Visibilidad del estado del sistema
 * - Feedback claro al seleccionar talla
 * - Confirmación al añadir al carrito
 *
 * Nielsen #5: Prevención de errores
 * - Botón deshabilitado si no hay talla seleccionada
 * - Advertencia de disponibilidad limitada
 */

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const localProduct = products.find((item) => item.id === parseInt(id || "0"));

  useEffect(() => {
    const loadProduct = async () => {
      const productId = parseInt(id || "0");

      if (!productId) {
        setProduct(null);
        setLoadError("Producto no encontrado");
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");

      try {
        const data = await getProductById(productId);
        setProduct({
          ...localProduct,
          ...data,
          image: localProduct?.image || data?.image || "",
          images: localProduct?.images?.length
            ? localProduct.images
            : data?.images?.length
            ? data.images
            : undefined,
        });
      } catch (error) {
        console.error("Error al cargar producto:", error);
        setProduct(localProduct || null);
        setLoadError(localProduct ? "" : "No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const galleryImages = product?.images?.length ? product.images : product?.image ? [product.image] : [];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] || "");
  const resolvedMainImage = getPublicUrlFromPath(localProduct?.image || selectedImage || product?.image || "");
  const resolvedGalleryImages = galleryImages.map((image) => getPublicUrlFromPath(image));

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    }
  }, [product?.id]);

  useEffect(() => {
    if (product?.stock != null) {
      setQuantity((currentQuantity) => Math.min(currentQuantity, Math.max(1, Number(product.stock) || 1)));
    }
  }, [product?.stock]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Card className="p-12 text-center">
          <h1 className="font-display text-3xl mb-4 tracking-tight">Cargando producto...</h1>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Card className="p-12 text-center">
          <h1 className="font-display text-3xl mb-4 tracking-tight">Producto no encontrado</h1>
          {loadError && <p className="mb-4 text-sm text-muted-foreground">{loadError}</p>}
          <Link to="/catalogo">
            <Button>
              Volver al catálogo
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedSize && product) {
      addToCart(product, selectedSize, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const handleCloseNotification = () => {
    setAddedToCart(false);
  };

  const isLowStock = product.stock < 5;
  const availableSize = product.size;
  const maxQuantity = Math.max(1, Number(product.stock) || 1);
  const sizeGuideAnchor =
    product.category === "pantalones"
      ? "/ayuda#guia-pantalones"
      : product.category === "vestidos"
      ? "/ayuda#guia-vestidos"
      : product.category === "camisetas" || product.category === "polos"
      ? "/ayuda#guia-camisetas-polos"
      : "/ayuda#guia-otras-prendas";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalogo">Catálogo</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Back Button */}
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
      >
        <ArrowLeft size={20} aria-hidden="true" />
        <span>Volver al catálogo</span>
      </Link>

      {/* Notificación emergente */}
      {addedToCart && (
        <div
          className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 animate-in slide-in-from-bottom-5 fade-in duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-[1.5rem] border border-green-200 bg-white/95 px-6 py-4 text-green-900 shadow-[0_28px_60px_-38px_rgba(24,18,15,0.6)] backdrop-blur-md">
            <span className="text-2xl text-green-600">✓</span>
            <span className="flex-1 text-center font-semibold">
              Producto añadido al carrito correctamente
            </span>
            <button
              onClick={handleCloseNotification}
              className="ml-2 rounded-full p-1 text-green-700 hover:bg-green-100 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        {/* Product Images - WCAG Perceptibilidad */}
        <div className="space-y-4">
          <div className="relative rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,225,208,0.9))] shadow-[0_28px_70px_-40px_rgba(24,18,15,0.6)] flex items-center justify-center p-6">
            <div className="w-full h-full flex items-center justify-center p-4 bg-[rgba(255,255,255,0.6)] rounded-[1.5rem]">
                <img
                src={resolvedMainImage}
                alt={`${product.name} - ${product.color} para ${product.gender} - Vista principal`}
                className="max-h-[40vh] md:max-h-[64vh] max-w-full w-auto object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm backdrop-blur-sm">
              Curated piece
            </div>
            <div className="absolute bottom-5 left-5 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lg">
              {product.stock > 0 ? "Disponible" : "Agotado"}
            </div>
          </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {resolvedGalleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-[1.25rem] border bg-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black h-20 flex items-center justify-center ${
                      selectedImage === image ? "border-primary ring-2 ring-[color:var(--ring)]" : "border-[color:var(--border)]"
                    }`}
                    aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                    aria-pressed={selectedImage === image}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Vista ${index + 1}`}
                      className={`max-h-full w-auto object-contain transition-opacity ${selectedImage === image ? "opacity-100" : "opacity-80"}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Product Info */}
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white/88 p-6 shadow-[0_24px_70px_-42px_rgba(24,18,15,0.55)] md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {product.category}
            </span>
            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--secondary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
              {product.gender}
            </span>
          </div>
          <h1 className="font-display text-4xl tracking-tight md:text-5xl">{product.name}</h1>
          <p className="mt-3 text-3xl font-semibold text-foreground" aria-label={`Precio: ${product.price} dólares`}>
            {product.price.toFixed(2)}$
          </p>

          <p className="mt-6 text-muted-foreground capitalize">
            <strong>Género:</strong> {product.gender}
          </p>
          <p className="text-muted-foreground">
            <strong>Talla disponible:</strong> <span style={{ unicodeBidi: 'isolate' }}>{product.size}</span>
          </p>
          <p className="text-muted-foreground">
            <strong>Color:</strong> {product.color}
          </p>
          <p className="mb-6 text-muted-foreground">
            <strong>Categoría:</strong> {product.category}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <Label className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Selecciona tu talla
              {!selectedSize && (
                <span className="text-red-600 ml-2" aria-label="Campo requerido">
                  *
                </span>
              )}
            </Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-3"
              aria-required="true"
              aria-label="Selección de talla"
            >
              {sizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem
                    value={size}
                    id={`size-${size}`}
                    disabled={size !== availableSize}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className={`
                      flex h-16 w-16 items-center justify-center rounded-full border text-sm font-semibold cursor-pointer shadow-sm transition-all
                      peer-focus:ring-2 peer-focus:ring-black
                      ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_18px_30px_-20px_rgba(24,18,15,0.75)]"
                          : size === availableSize
                          ? "border-[color:var(--border)] bg-white hover:-translate-y-0.5 hover:border-primary"
                          : "border-[color:var(--border)] bg-muted text-muted-foreground/60 cursor-not-allowed"
                      }
                    `}
                    aria-label={`Talla ${size}`}
                    aria-disabled={size !== availableSize}
                    style={{ fontVariantNumeric: 'normal', textTransform: 'none' }}
                  >
                    <span style={{ unicodeBidi: 'isolate' }}>{size}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <button
              type="button"
              onClick={() => setOpenGuide(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <Info size={16} aria-hidden="true" />
              <span>Guía de tallas</span>
            </button>
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <Alert className="mb-4 border border-amber-300 bg-amber-50/90">
              <AlertDescription>
                ⚠️ Solo quedan {product.stock} unidades disponibles
              </AlertDescription>
            </Alert>
          )}

          {product.stock === 0 && (
            <Alert className="mb-4 border border-red-300 bg-red-50/90">
              <AlertDescription>✕ Producto agotado</AlertDescription>
            </Alert>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <Label htmlFor="quantity" className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Cantidad
            </Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                -
              </Button>
              <div
                id="quantity"
                className="flex h-11 w-20 items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-3 font-semibold shadow-sm"
                aria-label={`Cantidad de productos: ${quantity}`}
              >
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                aria-label="Aumentar cantidad"
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div>
            <Button
              size="lg"
              className="h-14 w-full text-base shadow-[0_24px_40px_-22px_rgba(24,18,15,0.75)]"
              onClick={handleAddToCart}
              disabled={!selectedSize || product.stock === 0}
              aria-label={
                selectedSize
                  ? "Añadir al carrito"
                  : "Selecciona una talla para añadir al carrito"
              }
            >
              <ShoppingCart className="mr-2" size={28} aria-hidden="true" />
              <span className="font-bold">Añadir al carrito</span>
            </Button>
          </div>

          {/* Product Details */}
          <Card className="mt-8 p-5">
            <h2 className="font-display mb-3 text-2xl tracking-tight">Detalles del producto</h2>
            <dl className="space-y-3 text-sm text-muted-foreground">
              <div className="flex">
                <dt className="w-24 font-semibold text-foreground">Categoría:</dt>
                <dd className="capitalize">{product.category}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 font-semibold text-foreground">Género:</dt>
                <dd className="capitalize">{product.gender}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 font-semibold text-foreground">Color:</dt>
                <dd>{product.color}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 font-semibold text-foreground">Stock:</dt>
                <dd>{product.stock} unidades</dd>
              </div>
              <div className="flex">
                <dt className="w-24 font-semibold text-foreground">Material:</dt>
                <dd>100% Algodón orgánico</dd>
              </div>
              <div className="flex">
                <dt className="w-24 font-semibold text-foreground">Cuidados:</dt>
                <dd>Lavar a máquina máx. 30°C</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
      <SizeGuideModal open={openGuide} onOpenChange={setOpenGuide} category={product.category} />
    </div>
  );
}
