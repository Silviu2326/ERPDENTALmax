import { X, Edit2, Calendar, Camera, FileText } from 'lucide-react';
import { SeguimientoRetencion } from '../api/retencionApi';
import VisorFotosRetencion from './VisorFotosRetencion';

interface ModalDetalleRetenedorProps {
  seguimiento: SeguimientoRetencion;
  onClose: () => void;
  onEditar?: () => void;
}

export default function ModalDetalleRetenedor({
  seguimiento,
  onClose,
  onEditar,
}: ModalDetalleRetenedorProps) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obtenerEstadoColor = (estado: string) => {
    const colores = {
      Programada: 'bg-blue-100 text-blue-800 border-blue-300',
      Realizada: 'bg-green-100 text-green-800 border-green-300',
      Cancelada: 'bg-red-100 text-red-800 border-red-300',
    };
    return colores[estado as keyof typeof colores] || colores.Programada;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Detalle de Seguimiento
              </h2>
              <p className="text-sm text-gray-600">
                {formatearFecha(seguimiento.fechaCita)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEditar && (
              <button
                onClick={onEditar}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Editar seguimiento"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <span
              className={`inline-block px-4 py-2 rounded-lg border font-medium ${obtenerEstadoColor(
                seguimiento.estado
              )}`}
            >
              {seguimiento.estado}
            </span>
          </div>

          {/* Observaciones */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <label className="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {seguimiento.observaciones || 'No hay observaciones registradas'}
              </p>
            </div>
          </div>

          {/* Fotos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-gray-600" />
              <label className="block text-sm font-medium text-gray-700">
                Registro Fotográfico ({seguimiento.fotos?.length || 0} foto(s))
              </label>
            </div>
            {seguimiento.fotos && seguimiento.fotos.length > 0 ? (
              <VisorFotosRetencion fotos={seguimiento.fotos} />
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hay fotos registradas para este seguimiento</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


