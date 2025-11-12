import { useState, useEffect } from 'react';
import { X, Bell, Mail, MessageSquare, Clock, Save, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  RecordatorioCita,
  HistorialRecordatorio,
  obtenerRecordatoriosCita,
  guardarRecordatorioCita,
  actualizarRecordatorioCita,
  eliminarRecordatorioCita,
  obtenerHistorialRecordatoriosCita,
  obtenerProximosEnvíosRecordatorios,
} from '../api/citasApi';

interface ReminderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  citaId: string;
  pacienteNombre?: string;
  fechaCita?: string;
}

export default function ReminderSettingsModal({
  isOpen,
  onClose,
  citaId,
  pacienteNombre = 'Paciente',
  fechaCita,
}: ReminderSettingsModalProps) {
  const [recordatorios, setRecordatorios] = useState<RecordatorioCita[]>([]);
  const [historial, setHistorial] = useState<HistorialRecordatorio[]>([]);
  const [proximosEnvios, setProximosEnvios] = useState<HistorialRecordatorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoRecordatorio, setEditandoRecordatorio] = useState<RecordatorioCita | null>(null);

  // Formulario
  const [tipo, setTipo] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [diasAntes, setDiasAntes] = useState<number>(1);
  const [horaEnvio, setHoraEnvio] = useState<string>('09:00');
  const [activo, setActivo] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && citaId) {
      cargarDatos();
    }
  }, [isOpen, citaId]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recordatoriosData, historialData, proximosData] = await Promise.all([
        obtenerRecordatoriosCita(citaId),
        obtenerHistorialRecordatoriosCita(citaId),
        obtenerProximosEnvíosRecordatorios(citaId),
      ]);
      setRecordatorios(recordatoriosData);
      setHistorial(historialData);
      setProximosEnvios(proximosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los recordatorios');
    } finally {
      setLoading(false);
    }
  };

  const resetFormulario = () => {
    setTipo('email');
    setDiasAntes(1);
    setHoraEnvio('09:00');
    setActivo(true);
    setEditandoRecordatorio(null);
    setMostrarFormulario(false);
  };

  const handleEditar = (recordatorio: RecordatorioCita) => {
    setEditandoRecordatorio(recordatorio);
    setTipo(recordatorio.tipo);
    setDiasAntes(recordatorio.diasAntes);
    setHoraEnvio(recordatorio.horaEnvio || '09:00');
    setActivo(recordatorio.activo);
    setMostrarFormulario(true);
  };

  const handleGuardar = async () => {
    if (!diasAntes || diasAntes < 0) {
      alert('Los días antes deben ser un número válido');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (editandoRecordatorio && editandoRecordatorio._id) {
        // Actualizar existente
        await actualizarRecordatorioCita(editandoRecordatorio._id, {
          tipo,
          diasAntes,
          horaEnvio,
          activo,
        });
      } else {
        // Crear nuevo
        await guardarRecordatorioCita(citaId, {
          tipo,
          diasAntes,
          horaEnvio,
          activo,
        });
      }
      resetFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (recordatorioId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este recordatorio?')) {
      return;
    }

    setLoading(true);
    try {
      await eliminarRecordatorioCita(recordatorioId);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivo = async (recordatorio: RecordatorioCita) => {
    if (!recordatorio._id) return;

    setLoading(true);
    try {
      await actualizarRecordatorioCita(recordatorio._id, {
        activo: !recordatorio.activo,
      });
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar el recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'email':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'sms':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'whatsapp':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'enviado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fallido':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pendiente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configurar Recordatorios</h2>
              <p className="text-sm text-gray-500">
                {pacienteNombre} {fechaCita && `- ${new Date(fechaCita).toLocaleDateString('es-ES')}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Recordatorios configurados */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Recordatorios Configurados</h3>
              <button
                onClick={() => {
                  resetFormulario();
                  setMostrarFormulario(true);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Nuevo Recordatorio
              </button>
            </div>

            {loading && recordatorios.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-2" />
                <p className="text-gray-600 text-sm">Cargando...</p>
              </div>
            ) : recordatorios.length === 0 && !mostrarFormulario ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Bell className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">No hay recordatorios configurados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recordatorios.map((recordatorio) => (
                  <div
                    key={recordatorio._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`p-1.5 rounded ${getTipoColor(recordatorio.tipo)}`}>
                            {getTipoIcon(recordatorio.tipo)}
                          </div>
                          <span className="font-medium text-gray-900 capitalize">
                            {recordatorio.tipo}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              recordatorio.activo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {recordatorio.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Días antes:</strong> {recordatorio.diasAntes} día(s)
                          </p>
                          {recordatorio.horaEnvio && (
                            <p>
                              <strong>Hora de envío:</strong> {recordatorio.horaEnvio}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleActivo(recordatorio)}
                          disabled={loading}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            recordatorio.activo
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } disabled:opacity-50`}
                        >
                          {recordatorio.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleEditar(recordatorio)}
                          disabled={loading}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => recordatorio._id && handleEliminar(recordatorio._id)}
                          disabled={loading}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de nuevo/editar recordatorio */}
          {mostrarFormulario && (
            <div className="mb-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                {editandoRecordatorio ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Recordatorio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['email', 'sms', 'whatsapp'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTipo(t)}
                        className={`px-3 py-2 rounded-lg border-2 transition-all ${
                          tipo === t
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          {getTipoIcon(t)}
                          <span className="capitalize text-sm">{t}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Días antes de la cita
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={diasAntes}
                      onChange={(e) => setDiasAntes(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de envío
                    </label>
                    <input
                      type="time"
                      value={horaEnvio}
                      onChange={(e) => setHoraEnvio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                    Activar recordatorio
                  </label>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={handleGuardar}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={resetFormulario}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Próximos envíos programados */}
          {proximosEnvios.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Próximos Envíos Programados</h3>
              <div className="space-y-2">
                {proximosEnvios.map((envio) => (
                  <div
                    key={envio._id}
                    className="bg-yellow-50 rounded-lg border border-yellow-200 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(envio.estado)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {envio.tipo.toUpperCase()} - {new Date(envio.fechaProgramada).toLocaleString('es-ES')}
                          </p>
                          <p className="text-xs text-gray-600">A: {envio.destinatario}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        {envio.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historial de envíos */}
          {historial.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Historial de Envíos</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {historial.map((envio) => (
                  <div
                    key={envio._id}
                    className={`rounded-lg border p-3 ${
                      envio.estado === 'enviado'
                        ? 'bg-green-50 border-green-200'
                        : envio.estado === 'fallido'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(envio.estado)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {envio.tipo.toUpperCase()} - {new Date(envio.fechaEnvio).toLocaleString('es-ES')}
                          </p>
                          <p className="text-xs text-gray-600">A: {envio.destinatario}</p>
                          {envio.error && (
                            <p className="text-xs text-red-600 mt-1">Error: {envio.error}</p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          envio.estado === 'enviado'
                            ? 'bg-green-100 text-green-700'
                            : envio.estado === 'fallido'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {envio.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

