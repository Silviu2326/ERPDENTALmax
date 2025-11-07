import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Eye } from 'lucide-react';
import { FotoBlanqueamiento } from '../api/blanqueamientoApi';

interface GaleriaFotosAntesDespuesProps {
  fotos: FotoBlanqueamiento[];
  onSubirFotos: (archivos: File[], tipo: 'Antes' | 'Después') => Promise<void>;
  tratamientoId: string;
  loading?: boolean;
}

export default function GaleriaFotosAntesDespues({
  fotos,
  onSubirFotos,
  tratamientoId,
  loading = false,
}: GaleriaFotosAntesDespuesProps) {
  const [mostrarModal, setMostrarModal] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const fotosAntes = fotos.filter((f) => f.tipo === 'Antes');
  const fotosDespues = fotos.filter((f) => f.tipo === 'Después');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'Antes' | 'Después') => {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length === 0) return;

    setSubiendo(true);
    try {
      await onSubirFotos(archivos, tipo);
      // Resetear input
      e.target.value = '';
    } catch (error) {
      console.error('Error al subir fotos:', error);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <ImageIcon className="w-5 h-5" />
        Galería de Fotos - Antes y Después
      </h3>

      {/* Fotos Antes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-medium text-gray-700">Fotos - Antes</h4>
          <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Subir Fotos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'Antes')}
              disabled={subiendo || loading}
            />
          </label>
        </div>
        {fotosAntes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fotosAntes.map((foto) => (
              <div
                key={foto._id || foto.url}
                className="relative group cursor-pointer"
                onClick={() => setMostrarModal(foto.url)}
              >
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
                  <img
                    src={foto.url}
                    alt={`Antes - ${new Date(foto.fechaSubida).toLocaleDateString('es-ES')}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                  {new Date(foto.fechaSubida).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No hay fotos de antes</p>
          </div>
        )}
      </div>

      {/* Fotos Después */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-medium text-gray-700">Fotos - Después</h4>
          <label className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Subir Fotos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'Después')}
              disabled={subiendo || loading}
            />
          </label>
        </div>
        {fotosDespues.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fotosDespues.map((foto) => (
              <div
                key={foto._id || foto.url}
                className="relative group cursor-pointer"
                onClick={() => setMostrarModal(foto.url)}
              >
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-colors">
                  <img
                    src={foto.url}
                    alt={`Después - ${new Date(foto.fechaSubida).toLocaleDateString('es-ES')}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                  {new Date(foto.fechaSubida).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No hay fotos de después</p>
          </div>
        )}
      </div>

      {subiendo && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <p className="text-sm">Subiendo fotos...</p>
        </div>
      )}

      {/* Modal para ver imagen completa */}
      {mostrarModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setMostrarModal(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setMostrarModal(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <img
              src={mostrarModal}
              alt="Vista ampliada"
              className="max-w-full max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}



