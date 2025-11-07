import { Info, Calendar, User, FileText, Stethoscope, X } from 'lucide-react';
import { DetalleEstudioCompleto } from '../api/estudiosApi';

interface PanelMetadatosEstudioProps {
  estudio: DetalleEstudioCompleto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PanelMetadatosEstudio({
  estudio,
  isOpen,
  onClose,
}: PanelMetadatosEstudioProps) {
  if (!isOpen || !estudio) return null;

  const formatearFecha = (fecha: string) => {
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  const getTipoEstudioColor = (tipo: string) => {
    const colores: { [key: string]: string } = {
      TAC: 'bg-purple-100 text-purple-800 border-purple-300',
      Ortopantomografía: 'bg-blue-100 text-blue-800 border-blue-300',
      Periapical: 'bg-green-100 text-green-800 border-green-300',
      Cefalometría: 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Metadatos del Estudio</h2>
                <p className="text-blue-100 text-sm">Información del estudio radiológico</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Tipo de Estudio */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Tipo de Estudio</p>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getTipoEstudioColor(estudio.tipoEstudio)}`}>
                {estudio.tipoEstudio}
              </span>
            </div>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha del Estudio */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-700">Fecha del Estudio</p>
              </div>
              <p className="text-gray-900">{formatearFecha(estudio.fechaEstudio)}</p>
            </div>

            {/* ID del Paciente */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-700">ID del Paciente</p>
              </div>
              <p className="text-gray-900 font-mono text-sm">{estudio.paciente}</p>
            </div>
          </div>

          {/* Descripción */}
          {estudio.descripcion && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-700">Descripción</p>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap">{estudio.descripcion}</p>
            </div>
          )}

          {/* Notas */}
          {estudio.notas && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-yellow-700" />
                <p className="text-sm font-semibold text-yellow-800">Notas Técnicas</p>
              </div>
              <p className="text-yellow-900 whitespace-pre-wrap">{estudio.notas}</p>
            </div>
          )}

          {/* Técnico Asignado */}
          {estudio.tecnicoAsignado && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-700">Técnico Asignado</p>
              </div>
              <p className="text-gray-900">{estudio.tecnicoAsignado}</p>
            </div>
          )}

          {/* Información de Archivo */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-700" />
              <p className="text-sm font-semibold text-blue-800">Información de Archivo</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Ruta de almacenamiento:</span>{' '}
                <span className="font-mono text-xs break-all">{estudio.storagePath}</span>
              </p>
              {estudio.urlDicom && (
                <p className="text-sm text-blue-900">
                  <span className="font-medium">URL DICOM:</span>{' '}
                  <span className="font-mono text-xs break-all">{estudio.urlDicom}</span>
                </p>
              )}
            </div>
          </div>

          {/* Fechas de Creación y Actualización */}
          {(estudio.createdAt || estudio.updatedAt) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {estudio.createdAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Creado el</p>
                  <p className="text-sm text-gray-700">{formatearFecha(estudio.createdAt)}</p>
                </div>
              )}
              {estudio.updatedAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Actualizado el</p>
                  <p className="text-sm text-gray-700">{formatearFecha(estudio.updatedAt)}</p>
                </div>
              )}
            </div>
          )}

          {/* Anotaciones */}
          {estudio.anotaciones && Object.keys(estudio.anotaciones).length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-700" />
                <p className="text-sm font-semibold text-green-800">Anotaciones Guardadas</p>
              </div>
              <p className="text-sm text-green-900">
                Este estudio tiene {Object.keys(estudio.anotaciones).length} anotación(es) guardada(s)
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



