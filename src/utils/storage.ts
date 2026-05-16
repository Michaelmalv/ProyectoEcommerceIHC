import { supabase } from './api';

// Devuelve una URL pública válida para mostrar en <img>
export function getPublicUrlFromPath(path: string) {
  if (!path) return '';
  // Si ya es una URL pública completa, devolverla
  if (path.startsWith('http')) return path;
  // Si es una ruta que incluye 'storage/v1/object/public', devolverla
  if (path.includes('/storage/v1/object/public')) return path;

  // Normalizar: permitir tanto 'products/imagen.jpg' como 'imagen.jpg'
  const objectPath = path.includes('/') ? path : `products/${path}`;

  const { data } = supabase.storage.from('products').getPublicUrl(objectPath);
  return data?.publicUrl ?? '';
}

export async function uploadToBucket(bucket: string, file: File, destPath: string) {
  // destPath ejemplo: 'camiseta-negra.jpg' o 'folder/imagen.jpg'
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(destPath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    const detail = [
      uploadError.message,
      uploadError.name,
      uploadError.status ? `status: ${uploadError.status}` : null,
      uploadError.error ? `error: ${uploadError.error}` : null,
      uploadError.details ? `details: ${uploadError.details}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    throw new Error(detail || 'Error al subir archivo');
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(destPath);
  return data?.publicUrl ?? null;
}
