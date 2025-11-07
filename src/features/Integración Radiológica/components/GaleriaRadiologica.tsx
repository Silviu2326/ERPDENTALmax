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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando radiografías...</p>
      </div>
    );
  }

  if (radiologias.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <FileImage size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay radiografías</h3>
        <p className="text-gray-600 mb-4">
          Añada una nueva radiografía para comenzar el historial
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {radiologias.map((radiologia) => (
        <div
          key={radiologia._id}
          onClick={() => onSeleccionarRadiografia(radiologia)}
          className={`relative group bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden cursor-pointer transition-all hover:shadow-md h-full flex flex-col ${
            radiografiaSeleccionadaId === radiologia._id
              ? 'ring-2 ring-blue-500 shadow-md'
              : 'hover:ring-2 hover:ring-blue-400'
          }`}
        >
          {/* Imagen thumbnail */}
          <div className="h-48 bg-gray-100 relative overflow-hidden">
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

            {/* Badge de tipo */}
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ring-1 ${getTipoColor(radiologia.tipoRadiografia)}`}
              >
                {radiologia.tipoRadiografia}
              </span>
            </div>

            {/* Overlay con acciones */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeleccionarRadiografia(radiologia);
                  }}
                  className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                  title="Ver imagen"
                >
                  <Eye size={20} />
                </button>
                {onEditar && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditar(radiologia);
                    }}
                    className="bg-slate-700 text-white p-2 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                    title="Editar"
                  >
                    <Edit size={20} />
                  </button>
                )}
                {onEliminar && (
                  <button
                    onClick={(e) => handleEliminar(e, radiologia._id)}
                    disabled={radiologiaAEliminar === radiologia._id}
                    className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
                    title="Eliminar"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{formatearFecha(radiologia.fechaToma)}</span>
            </div>
            
            {radiologia.notas && (
              <p className="text-xs text-gray-500 line-clamp-2">{radiologia.notas}</p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
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

