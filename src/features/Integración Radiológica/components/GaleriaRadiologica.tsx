import { useState } from 'react';
import { Calendar, FileImage, Eye, Trash2, Edit, Loader2 } from 'lucide-react';
import { Radiologia } from '../api/radiologiaApi';

interface GaleriaRadiologicaProps {
  radiologias: Radiologia[];
  loading?: boolean;
  onSeleccionarRadiografia: (radiologia: Radiologia) => void;
  onEditar?: (radiologia: Radiologia) => void;
  onEliminar?: (radiologiaId: string) => void;
  radiografiaSeleccionadaId?: string;
}

export default function GaleriaRadiologica({
  radiologias,
  loading = false,
  onSeleccionarRadiografia,
  onEditar,
  onEliminar,
  radiografiaSeleccionadaId,
}: GaleriaRadiologicaProps) {
  const [radiologiaAEliminar, setRadiologiaAEliminar] = useState<string | null>(null);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearTamaño = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getTipoColor = (tipo: Radiologia['tipoRadiografia']) => {
    const colores: { [key: string]: string } = {
      Periapical: 'bg-green-100 text-green-800 border-green-200',
      Bitewing: 'bg-blue-100 text-blue-800 border-blue-200',
      Oclusal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Panorámica: 'bg-purple-100 text-purple-800 border-purple-200',
      CBCT: 'bg-red-100 text-red-800 border-red-200',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleEliminar = (e: React.MouseEvent, radiologiaId: string) => {
    e.stopPropagation();
    if (window.confirm('¿Está seguro de que desea eliminar esta radiografía?')) {
      setRadiologiaAEliminar(radiologiaId);
      onEliminar?.(radiologiaId);
      // Resetear después de un momento
      setTimeout(() => setRadiologiaAEliminar(null), 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (radiologias.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-2">No hay radiografías</p>
        <p className="text-sm text-gray-500">
          Añada una nueva radiografía para comenzar el historial
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {radiologias.map((radiologia) => (
        <div
          key={radiologia._id}
          onClick={() => onSeleccionarRadiografia(radiologia)}
          className={`relative group bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
            radiografiaSeleccionadaId === radiologia._id
              ? 'border-blue-500 shadow-md'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          {/* Imagen thumbnail */}
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            {radiologia.thumbnailUrl ? (
              <img
                src={radiologia.thumbnailUrl}
                alt={radiologia.tipoRadiografia}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback si la imagen no carga
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <FileImage className="w-12 h-12 text-gray-400" />
            </div>

          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSeleccionarRadiografia(radiologia);
                }}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Ver imagen"
              >
                <Eye className="w-5 h-5" />
              </button>
              {onEditar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(radiologia);
                  }}
                  className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {onEliminar && (
                <button
                  onClick={(e) => handleEliminar(e, radiologia._id)}
                  disabled={radiologiaAEliminar === radiologia._id}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

            {/* Badge de tipo */}
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium border ${getTipoColor(radiologia.tipoRadiografia)}`}
              >
                {radiologia.tipoRadiografia}
              </span>
            </div>
          </div>

          {/* Información */}
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatearFecha(radiologia.fechaToma)}</span>
            </div>
            
            {radiologia.notas && (
              <p className="text-xs text-gray-500 line-clamp-2">{radiologia.notas}</p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{formatearTamaño(radiologia.tamañoArchivo)}</span>
              {radiologia.diagnosticoAsociado && (
                <span className="text-blue-600">✓ Diagnóstico</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

