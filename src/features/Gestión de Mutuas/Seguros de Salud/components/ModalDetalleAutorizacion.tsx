import { X, FileText, Calendar, User, Building2, Clock, Check, AlertCircle, Download } from 'lucide-react';
import { Autorizacion } from '../api/autorizacionesApi';
import SelectorEstadoAutorizacion from './SelectorEstadoAutorizacion';
import UploaderDocumentosAutorizacion from './UploaderDocumentosAutorizacion';

interface ModalDetalleAutorizacionProps {
  autorizacion: Autorizacion;
  onCerrar: () => void;
  onEstadoChange?: (nuevoEstado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional') => Promise<void>;
  onSubirDocumentos?: (archivos: File[]) => Promise<void>;
  onActualizar?: (datos: { codigoAutorizacion?: string; notas?: string; fechaRespuesta?: string }) => Promise<void>;
  loading?: boolean;
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'Aprobada':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Rechazada':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Requiere Información Adicional':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }
};

export default function ModalDetalleAutorizacion({
  autorizacion,
  onCerrar,
  onEstadoChange,
  onSubirDocumentos,
  onActualizar,
  loading = false,
}: ModalDetalleAutorizacionProps) {
  const [codigoAutorizacion, setCodigoAutorizacion] = useState(autorizacion.codigoAutorizacion || '');
  const [notas, setNotas] = useState(autorizacion.notas || '');
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleGuardarCambios = async () => {
    if (!onActualizar) return;

    setGuardando(true);
    try {
      await onActualizar({
        codigoAutorizacion: codigoAutorizacion || undefined,
        notas: notas || undefined,
        fechaRespuesta: autorizacion.estado !== 'Pendiente' ? new Date().toISOString() : undefined,
      });
      setEditando(false);
    } catch (err) {
      console.error('Error al actualizar:', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEstadoChange = async (nuevoEstado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional') => {
    if (onEstadoChange) {
      await onEstadoChange(nuevoEstado);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Detalle de Autorización</h2>
              <p className="text-blue-100 text-sm">Código: {autorizacion.codigoSolicitud}</p>
            </div>
            <button
              onClick={onCerrar}
              disabled={loading}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paciente */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-700">Paciente</h3>
              </div>
              <p className="text-gray-900">
                {autorizacion.paciente.nombre} {autorizacion.paciente.apellidos}
              </p>
            </div>

            {/* Tratamiento */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-700">Tratamiento</h3>
              </div>
              <p className="text-gray-900">{autorizacion.tratamientoPlanificado.nombre}</p>
              {autorizacion.tratamientoPlanificado.descripcion && (
                <p className="text-sm text-gray-600 mt-1">{autorizacion.tratamientoPlanificado.descripcion}</p>
              )}
            </div>

            {/* Mutua */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-700">Mutua/Seguro</h3>
              </div>
              <p className="text-gray-900">{autorizacion.mutua.nombreComercial}</p>
            </div>

            {/* Estado */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-700">Estado</h3>
              </div>
              {onEstadoChange ? (
                <SelectorEstadoAutorizacion
                  estado={autorizacion.estado}
                  onEstadoChange={handleEstadoChange}
                  disabled={loading}
                />
              ) : (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(autorizacion.estado)}`}
                >
                  {autorizacion.estado}
                </span>
              )}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Fecha de Solicitud</p>
                <p className="text-sm text-gray-900">{formatearFecha(autorizacion.fechaSolicitud)}</p>
              </div>
            </div>
            {autorizacion.fechaRespuesta && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Fecha de Respuesta</p>
                  <p className="text-sm text-gray-900">{formatearFecha(autorizacion.fechaRespuesta)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Código de Autorización */}
          {editando && onActualizar ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Autorización
              </label>
              <input
                type="text"
                value={codigoAutorizacion}
                onChange={(e) => setCodigoAutorizacion(e.target.value)}
                placeholder="Ingresa el código proporcionado por la mutua"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            autorizacion.codigoAutorizacion && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Código de Autorización</h3>
                </div>
                <p className="text-lg font-mono text-green-900">{autorizacion.codigoAutorizacion}</p>
              </div>
            )
          )}

          {/* Notas */}
          {editando && onActualizar ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Añade notas sobre la autorización..."
              />
            </div>
          ) : (
            autorizacion.notas && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Notas</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{autorizacion.notas}</p>
              </div>
            )
          )}

          {/* Documentos */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Documentos Adjuntos</h3>
            {onSubirDocumentos ? (
              <UploaderDocumentosAutorizacion
                documentos={autorizacion.documentos.map((doc) => ({
                  nombreArchivo: doc.nombreArchivo,
                  url: doc.url,
                  fechaSubida: doc.fechaSubida,
                }))}
                onSubirArchivos={onSubirDocumentos}
                disabled={loading}
              />
            ) : (
              <div className="space-y-2">
                {autorizacion.documentos.length > 0 ? (
                  autorizacion.documentos.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.nombreArchivo}</p>
                          <p className="text-xs text-gray-500">{formatearFecha(doc.fechaSubida)}</p>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Descargar</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No hay documentos adjuntos</p>
                )}
              </div>
            )}
          </div>

          {/* Historial de Estados */}
          {autorizacion.historialEstados && autorizacion.historialEstados.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Historial de Estados</h3>
              <div className="space-y-2">
                {autorizacion.historialEstados.map((historial, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      historial.estado === 'Aprobada' ? 'bg-green-500' :
                      historial.estado === 'Rechazada' ? 'bg-red-500' :
                      historial.estado === 'Requiere Información Adicional' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{historial.estado}</p>
                      <p className="text-xs text-gray-500">
                        {formatearFecha(historial.fecha)} - {historial.modificadoPor.nombre}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          {onActualizar && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {editando ? (
                <>
                  <button
                    onClick={() => {
                      setEditando(false);
                      setCodigoAutorizacion(autorizacion.codigoAutorizacion || '');
                      setNotas(autorizacion.notas || '');
                    }}
                    disabled={guardando}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardarCambios}
                    disabled={guardando}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {guardando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditando(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Editar Información
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


