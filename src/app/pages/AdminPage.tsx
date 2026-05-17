import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import AdminUpload from "../components/AdminUpload";

export function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-bold mb-4">Subir Imágenes de Productos</h2>
          <AdminUpload />
        </section>

        <section className="border-t pt-6">
          <h2 className="text-lg font-bold mb-3">Instrucciones</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Selecciona una imagen PNG, JPG o WebP</li>
            <li>Define el nombre del archivo (ej: camiseta-negra.jpg)</li>
            <li>Haz clic en "Subir"</li>
            <li>Copia la URL pública que aparece</li>
            <li>Actualiza el campo <code className="bg-gray-100 px-2 py-1 rounded">image</code> en <code className="bg-gray-100 px-2 py-1 rounded">src/app/data/products.ts</code></li>
          </ol>
        </section>
      </div>
    </div>
  );
}
