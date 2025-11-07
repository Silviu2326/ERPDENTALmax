import { X, Calendar, MapPin, DollarSign, AlertCircle, FileText, Wrench } from 'lucide-react';
import { EquipoClinico } from '../api/equiposApi';

interface ModalDetalleEquipoProps {
  equipo: EquipoClinico | null;
  isOpen: boolean;
  onClose: () => void;
  onEditar?: (equipo: EquipoClinico) => void;
}

export default function ModalDetalleEquipo({
  equipo,
  isOpen,
  onClose,
  onEditar,
}: ModalDetalleEquipoProps) {
  if (!isOpen || !equipo) return null;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return 'bg-green-100 text-green-800';
      case 'En Mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fuera de Servicio':
        return 'bg-red-100 text-red-800';
      case 'De Baja':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{equipo.nombre}</h2>
            <p className="text-blue-100 text-sm mt-1">
              {equipo.marca} {equipo.modelo}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onEditar && (
              <button
                onClick={() => {
                  onEditar(equipo);
                  onClose();
                }}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Editar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Número de Serie</label>
                    <p className="text-gray-900 font-mono">{equipo.numeroSerie}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estado</label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
                        equipo.estado
                      )}`}
                    >
                      {equipo.estado}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Adquisición
                    </label>
                    <p className="text-gray-900">{formatDate(equipo.fechaAdquisicion)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Costo de Adquisición
                    </label>
                    <p className="text-gray-900 font-semibold">{formatCurrency(equipo.costo)}</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sede</label>
                    <p className="text-gray-900">{equipo.ubicacion.sede.nombre}</p>
                  </div>
                  {equipo.ubicacion.gabinete && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gabinete</label>
                      <p className="text-gray-900">{equipo.ubicacion.gabinete}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mantenimiento y Garantía */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Mantenimiento
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Último Mantenimiento
                    </label>
                    <p className="text-gray-900">
                      {formatDate(equipo.fechaUltimoMantenimiento)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Próximo Mantenimiento
                    </label>
                    <p className="text-gray-900">
                      {formatDate(equipo.fechaProximoMantenimiento)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Garantía */}
              {equipo.garantiaHasta && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Garantía
                  </h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Válida hasta</label>
                    <p className="text-gray-900">{formatDate(equipo.garantiaHasta)}</p>
                    {new Date(equipo.garantiaHasta) < new Date() && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        Vencida
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Proveedor */}
              {equipo.proveedor && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Proveedor</h3>
                  <p className="text-gray-900">{equipo.proveedor.nombre}</p>
                </div>
              )}

              {/* Documentos */}
              {equipo.documentos && equipo.documentos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentos
                  </h3>
                  <div className="space-y-2">
                    {equipo.documentos.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        {doc.nombre}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          {equipo.notas && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notas</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{equipo.notas}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-lg border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



