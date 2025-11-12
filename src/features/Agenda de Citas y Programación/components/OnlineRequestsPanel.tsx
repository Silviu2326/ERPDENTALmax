import { useState, useEffect } from 'react';
import { X, Globe, User, Stethoscope, Check, XCircle, Clock, Calendar, Mail, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import {
  SolicitudOnline,
  obtenerSolicitudesOnlinePendientes,
  aprobarSolicitudOnline,
  proponerHorarioAlternativo,
  rechazarSolicitudOnline,
  obtenerDisponibilidad,
  Profesional,
  Tratamiento,
} from '../api/citasApi';

interface OnlineRequestsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCitaCreada?: () => void;
  profesionales?: Profesional[];
  tratamientos?: Tratamiento[];
}

function SolicitudItem({
  solicitud,
  profesionales = [],
  tratamientos = [],
  onAprobar,
  onProponerAlternativa,
  onRechazar,
}: {
  solicitud: SolicitudOnline;
  profesionales: Profesional[];
  tratamientos: Tratamiento[];
  onAprobar: (solicitud: SolicitudOnline) => void;
  onProponerAlternativa: (solicitud: SolicitudOnline) => void;
  onRechazar: (solicitud: SolicitudOnline) => void;
}) {
  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  const [mostrarProponerAlternativa, setMostrarProponerAlternativa] = useState(false);
  const [mostrarFormularioAprobar, setMostrarFormularioAprobar] = useState(false);
  const [fechaAlternativa, setFechaAlternativa] = useState('');
  const [horaAlternativa, setHoraAlternativa] = useState('');
  const [profesionalId, setProfesionalId] = useState(solicitud.profesional?._id || '');
  const [boxId, setBoxId] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsDisponibles, setSlotsDisponibles] = useState<Array<{ start: string; end: string }>>([]);
  const [cargandoSlots, setCargandoSlots] = useState(false);

  const fechaSolicitada = solicitud.fechaHoraSolicitada
    ? new Date(solicitud.fechaHoraSolicitada)
    : null;

  const handleBuscarSlots = async () => {
    if (!fechaAlternativa || !horaAlternativa || !profesionalId) {
      alert('Por favor, completa la fecha, hora y profesional');
      return;
    }

    setCargandoSlots(true);
    try {
      const fechaInicio = new Date(`${fechaAlternativa}T00:00:00`);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + 7);

      const tratamiento = tratamientos.find(t => t._id === solicitud.tratamiento._id);
      const duracion = tratamiento?.duracionEstimadaMinutos || solicitud.tratamiento.duracionEstimadaMinutos;

      const slots = await obtenerDisponibilidad(
        profesionalId,
        fechaInicio.toISOString(),
        fechaFin.toISOString(),
        duracion
      );

      setSlotsDisponibles(slots);
    } catch (error) {
      console.error('Error al buscar slots:', error);
      alert('Error al buscar disponibilidad');
    } finally {
      setCargandoSlots(false);
    }
  };

  const handleAprobar = async () => {
    if (!fechaAlternativa || !horaAlternativa) {
      alert('Por favor, selecciona una fecha y hora');
      return;
    }

    setLoading(true);
    try {
      const fechaHoraInicio = new Date(`${fechaAlternativa}T${horaAlternativa}:00`);
      await aprobarSolicitudOnline(
        solicitud._id,
        fechaHoraInicio.toISOString(),
        profesionalId || undefined,
        boxId || undefined,
        true // enviar email
      );
      setMostrarFormularioAprobar(false);
      setMostrarAcciones(false);
      setFechaAlternativa('');
      setHoraAlternativa('');
      setBoxId('');
      onAprobar(solicitud);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al aprobar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleProponerAlternativa = async () => {
    if (!fechaAlternativa || !horaAlternativa) {
      alert('Por favor, selecciona una fecha y hora alternativa');
      return;
    }

    setLoading(true);
    try {
      const fechaHoraAlternativa = new Date(`${fechaAlternativa}T${horaAlternativa}:00`);
      await proponerHorarioAlternativo(
        solicitud._id,
        fechaHoraAlternativa.toISOString(),
        profesionalId || undefined,
        boxId || undefined,
        mensaje || undefined,
        true // enviar email
      );
      setMostrarProponerAlternativa(false);
      setMostrarAcciones(false);
      alert('Horario alternativo propuesto y email enviado al paciente');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al proponer horario alternativo');
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!confirm('¿Estás seguro de que deseas rechazar esta solicitud?')) {
      return;
    }

    const motivo = prompt('Motivo del rechazo (opcional):');
    setLoading(true);
    try {
      await rechazarSolicitudOnline(solicitud._id, motivo || undefined, true);
      onRechazar(solicitud);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al rechazar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-3 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <p className="font-semibold text-sm truncate">
              {solicitud.paciente.nombre} {solicitud.paciente.apellidos}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              solicitud.origen === 'portal_web' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              {solicitud.origen === 'portal_web' ? 'Web' : 'App'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <Stethoscope className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <p className="text-xs text-gray-600 truncate">
              {solicitud.tratamiento.nombre}
            </p>
          </div>

          {fechaSolicitada && (
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Preferencia: {fechaSolicitada.toLocaleDateString('es-ES')} a las{' '}
                {fechaSolicitada.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

          {solicitud.profesional && (
            <div className="mt-1">
              <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                {solicitud.profesional.nombre} {solicitud.profesional.apellidos}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
            {solicitud.paciente.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{solicitud.paciente.email}</span>
              </div>
            )}
            {solicitud.paciente.telefono && (
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{solicitud.paciente.telefono}</span>
              </div>
            )}
          </div>

          {solicitud.notas && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 line-clamp-2 italic">
                💬 {solicitud.notas}
              </p>
            </div>
          )}
        </div>
      </div>

      {!mostrarAcciones ? (
        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={() => setMostrarAcciones(true)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gestionar
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-3 pt-3 border-t border-gray-200">
          {!mostrarProponerAlternativa && !mostrarFormularioAprobar ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMostrarFormularioAprobar(true)}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3 h-3" />
                  <span>Aprobar</span>
                </button>
                <button
                  onClick={() => setMostrarProponerAlternativa(true)}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white text-xs font-medium rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <Clock className="w-3 h-3" />
                  <span>Alternativa</span>
                </button>
              </div>
              <button
                onClick={handleRechazar}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3 h-3" />
                <span>Rechazar</span>
              </button>
              <button
                onClick={() => setMostrarAcciones(false)}
                className="w-full px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : mostrarFormularioAprobar ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">
                <strong>Completa los datos para aprobar la solicitud:</strong>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={fechaAlternativa}
                  onChange={(e) => setFechaAlternativa(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={horaAlternativa}
                  onChange={(e) => setHoraAlternativa(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              {profesionales.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Profesional
                  </label>
                  <select
                    value={profesionalId}
                    onChange={(e) => setProfesionalId(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Cualquier profesional</option>
                    {profesionales.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nombre} {p.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Box (opcional)
                </label>
                <input
                  type="text"
                  value={boxId}
                  onChange={(e) => setBoxId(e.target.value)}
                  placeholder="Ej: 1, 2, 3..."
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={handleAprobar}
                  disabled={loading || !fechaAlternativa || !horaAlternativa}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>{loading ? 'Aprobando...' : 'Aprobar y Enviar Email'}</span>
                </button>
                <button
                  onClick={() => {
                    setMostrarFormularioAprobar(false);
                    setFechaAlternativa('');
                    setHoraAlternativa('');
                    setBoxId('');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fecha alternativa
                </label>
                <input
                  type="date"
                  value={fechaAlternativa}
                  onChange={(e) => setFechaAlternativa(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Hora alternativa
                </label>
                <input
                  type="time"
                  value={horaAlternativa}
                  onChange={(e) => setHoraAlternativa(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {profesionales.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Profesional
                  </label>
                  <select
                    value={profesionalId}
                    onChange={(e) => setProfesionalId(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Cualquier profesional</option>
                    {profesionales.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nombre} {p.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mensaje (opcional)
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Mensaje personalizado para el paciente..."
                  rows={2}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProponerAlternativa}
                  disabled={loading || !fechaAlternativa || !horaAlternativa}
                  className="flex-1 px-3 py-2 bg-yellow-600 text-white text-xs font-medium rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Proponer y Enviar Email'}
                </button>
                <button
                  onClick={() => {
                    setMostrarProponerAlternativa(false);
                    setFechaAlternativa('');
                    setHoraAlternativa('');
                    setMensaje('');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default function OnlineRequestsPanel({
  isOpen,
  onClose,
  onCitaCreada,
  profesionales = [],
  tratamientos = [],
}: OnlineRequestsPanelProps) {
  const [solicitudes, setSolicitudes] = useState<SolicitudOnline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarSolicitudes();
      // Configurar polling cada 30 segundos
      const interval = setInterval(() => {
        cargarSolicitudes();
      }, 30000);
      setPollingInterval(interval);
    } else {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isOpen]);

  const cargarSolicitudes = async () => {
    setLoading(true);
    setError(null);
    try {
      const solicitudesData = await obtenerSolicitudesOnlinePendientes();
      setSolicitudes(solicitudesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las solicitudes online');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = (solicitud: SolicitudOnline) => {
    setSolicitudes(prev => prev.filter(s => s._id !== solicitud._id));
    if (onCitaCreada) {
      onCitaCreada();
    }
    cargarSolicitudes();
  };

  const handleRechazar = (solicitud: SolicitudOnline) => {
    setSolicitudes(prev => prev.filter(s => s._id !== solicitud._id));
    cargarSolicitudes();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Solicitudes Online</h2>
          {solicitudes.length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {solicitudes.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={cargarSolicitudes}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando solicitudes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium mb-1">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={cargarSolicitudes}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes pendientes</h3>
            <p className="text-gray-600 text-sm">
              Las nuevas solicitudes online aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {solicitudes.length} {solicitudes.length === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
            </p>
            <div className="space-y-2">
              {solicitudes.map((solicitud) => (
                <SolicitudItem
                  key={solicitud._id}
                  solicitud={solicitud}
                  profesionales={profesionales}
                  tratamientos={tratamientos}
                  onAprobar={handleAprobar}
                  onProponerAlternativa={handleAprobar}
                  onRechazar={handleRechazar}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer con información */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          💡 Las solicitudes se actualizan automáticamente cada 30 segundos
        </p>
      </div>
    </div>
  );
}

