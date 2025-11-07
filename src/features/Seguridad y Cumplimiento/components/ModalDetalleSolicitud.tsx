import { useState } from 'react';
import { X, Save, Download, Trash2, AlertTriangle } from 'lucide-react';
import { SolicitudDerechos, exportarDatosPaciente, anonimizarDatosPaciente } from '../api/rgpdApi';

interface ModalDetalleSolicitudProps {
  solicitud: SolicitudDerechos;
  onClose: () => void;
  onActualizarEstado: (
    solicitudId: string,
    nuevoEstado: SolicitudDerechos['estado'],
    notas?: string
  ) => Promise<void>;
}

export default function ModalDetalleSolicitud({
  solicitud,
  onClose,
  onActualizarEstado,
}: ModalDetalleSolicitudProps) {
  const [nuevoEstado, setNuevoEstado] = useState<SolicitudDerechos['estado']>(solicitud.estado);
  const [notasResolucion, setNotasResolucion] = useState(solicitud.notasResolucion || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isAnonymizing, setIsAnonymizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTipoDerechoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      ACCESO: 'Acceso - Obtener copia de mis datos',
      RECTIFICACION: 'Rectificación - Corregir datos incorrectos',
      SUPRESION: 'Supresión - Eliminar mis datos (Derecho al Olvido)',
      LIMITACION: 'Limitación - Restringir el tratamiento',
      PORTABILIDAD: 'Portabilidad - Exportar mis datos',
      OPOSICION: 'Oposición - Oponerme al tratamiento',
    };
    return labels[tipo] || tipo;
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleGuardar = async () => {
    if (nuevoEstado === solicitud.estado && notasResolucion === (solicitud.notasResolucion || '')) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onActualizarEstado(solicitud._id!, nuevoEstado, notasResolucion);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la solicitud');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportarDatos = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const blob = await exportarDatosPaciente(solicitud.pacienteId, 'json');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `datos-paciente-${solicitud.pacienteId}-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar los datos');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAnonimizar = async () => {
    if (
      !window.confirm(
        '¿Está seguro de que desea anonimizar los datos de este paciente? Esta acción es IRREVERSIBLE.'
      )
    ) {
      return;
    }

    setIsAnonymizing(true);
    setError(null);

    try {
      await anonimizarDatosPaciente(solicitud.pacienteId);
      alert('Datos anonimizados exitosamente');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al anonimizar los datos');
    } finally {
      setIsAnonymizing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Detalle de Solicitud</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <p className="text-sm text-gray-900">
                {solicitud.paciente
                  ? `${solicitud.paciente.nombre} ${solicitud.paciente.apellidos}`
                  : `ID: ${solicitud.pacienteId}`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Derecho</label>
              <p className="text-sm text-gray-900">{getTipoDerechoLabel(solicitud.tipoDerecho)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Actual</label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as SolicitudDerechos['estado'])}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="COMPLETADA">Completada</option>
                <option value="RECHAZADA">Rechazada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Solicitud</label>
              <p className="text-sm text-gray-900">{formatFecha(solicitud.fechaSolicitud)}</p>
            </div>
            {solicitud.fechaResolucion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Resolución</label>
                <p className="text-sm text-gray-900">{formatFecha(solicitud.fechaResolucion)}</p>
              </div>
            )}
          </div>

          {/* Detalle de la Solicitud */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detalle de la Solicitud
            </label>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-900">
              {solicitud.detalleSolicitud || 'Sin detalles adicionales'}
            </div>
          </div>

          {/* Notas de Resolución */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas de Resolución
            </label>
            <textarea
              value={notasResolucion}
              onChange={(e) => setNotasResolucion(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese las notas sobre cómo se resolvió esta solicitud..."
            />
          </div>

          {/* Acciones Especiales */}
          {(solicitud.tipoDerecho === 'PORTABILIDAD' || solicitud.tipoDerecho === 'ACCESO') && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Exportar Datos del Paciente</h4>
              <button
                onClick={handleExportarDatos}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exportando...' : 'Exportar Datos (JSON)'}</span>
              </button>
            </div>
          )}

          {solicitud.tipoDerecho === 'SUPRESION' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-900 mb-1">
                    Anonimización de Datos (Derecho al Olvido)
                  </h4>
                  <p className="text-xs text-red-800 mb-3">
                    Esta acción es IRREVERSIBLE. Los datos personales del paciente serán anonimizados
                    pero se mantendrán los registros médicos sin información identificativa.
                  </p>
                  <button
                    onClick={handleAnonimizar}
                    disabled={isAnonymizing}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isAnonymizing ? 'Anonimizando...' : 'Anonimizar Datos'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={handleGuardar}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}



