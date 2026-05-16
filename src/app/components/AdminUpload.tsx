import React, { useState } from 'react';
import { uploadToBucket } from '../../utils/storage';

export default function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState('');

  const normalizeErrorMessage = (message: string) => {
    if (message.toLowerCase().includes('row-level security policy')) {
      return 'No tienes permiso para subir archivos al bucket. Debes crear una policy RLS de INSERT en storage.objects para el bucket products.';
    }
    return message;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicUrl(null);
    setError(null);
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !filename) setFilename(f.name);
  };

  const handleUpload = async () => {
    if (!file) return setError('Selecciona un archivo');
    if (!filename) return setError('Indica el nombre destino (ej: camiseta-negra.jpg)');

    try {
      setUploading(true);
      const url = await uploadToBucket('products', file, filename);
      setPublicUrl(url);
    } catch (err: any) {
      const rawMessage = err?.message || 'Error al subir';
      setError(normalizeErrorMessage(rawMessage));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded max-w-xl">
      <h3 className="font-bold mb-2">Subir imagen a Supabase Storage</h3>
      <p className="text-sm text-gray-600 mb-4">Bucket: <strong>products</strong></p>

      <input type="file" accept="image/*" onChange={handleFile} className="mb-2" />

      <label className="block text-sm mb-1">Nombre destino</label>
      <input
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="ej: camiseta-negra.jpg"
        className="border px-2 py-1 mb-3 w-full"
      />

      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-black text-white px-3 py-1 rounded disabled:opacity-60"
        >
          {uploading ? 'Subiendo...' : 'Subir'}
        </button>
      </div>

      {publicUrl && (
        <div className="mt-4">
          <p className="text-sm">URL pública:</p>
          <input className="w-full border p-2" value={publicUrl} readOnly />
          <p className="text-xs text-gray-500 mt-1">Copia esta URL y reemplaza la propiedad `image` en <code>src/app/data/products.ts</code> o usa solo el nombre de archivo como <code>products/tu.jpg</code>.</p>
        </div>
      )}

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
