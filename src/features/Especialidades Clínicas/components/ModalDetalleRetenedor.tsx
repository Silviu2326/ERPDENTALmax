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
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
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
                <Edit2 size={20} className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado
            </label>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${obtenerEstadoColor(
                seguimiento.estado
              )}`}
            >
              {seguimiento.estado}
            </span>
          </div>

          {/* Observaciones */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-600" />
              <label className="block text-sm font-medium text-slate-700">
                Observaciones
              </label>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {seguimiento.observaciones || 'No hay observaciones registradas'}
              </p>
            </div>
          </div>

          {/* Fotos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera size={16} className="text-gray-600" />
              <label className="block text-sm font-medium text-slate-700">
                Registro Fotográfico ({seguimiento.fotos?.length || 0} foto(s))
              </label>
            </div>
            {seguimiento.fotos && seguimiento.fotos.length > 0 ? (
              <VisorFotosRetencion fotos={seguimiento.fotos} />
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Camera size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay fotos registradas para este seguimiento</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



