import { useState, useEffect, useMemo } from 'react';
import { X, Clock, User, Stethoscope, Filter, Trash2, Calendar, AlertCircle, CheckCircle, XCircle, RefreshCw, MapPin } from 'lucide-react';
import { 
  ItemListaEspera, 
  SlotSugerido,
  obtenerListaEspera, 
  obtenerSlotsSugeridos,
  asignarSlotListaEspera,
  registrarIntentoReasignacion,
  eliminarDeListaEspera,
  Cita
} from '../api/citasApi';
import { useAuth } from '../../../contexts/AuthContext';

interface WaitlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCitaCreada?: () => void;
  especialidades?: string[];
  citas?: Cita[]; // Citas actuales para detectar cancelaciones
}

function ItemListaEsperaCard({ 
  item, 
  onAsignarSlot,
  onEliminar,
  citas
}: { 
  item: ItemListaEspera; 
  onAsignarSlot: (item: ItemListaEspera, slot: SlotSugerido) => void;
  onEliminar: (itemId: string) => void;
  citas?: Cita[];
}) {
  const [mostrarSlots, setMostrarSlots] = useState(false);
  const [slotsSugeridos, setSlotsSugeridos] = useState<SlotSugerido[]>([]);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const { user } = useAuth();

  const cargarSlotsSugeridos = async () => {
    setCargandoSlots(true);
    try {
      // Calcular rango de fechas (próximos 30 días)
      const fechaInicio = new Date();
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + 30);
      fechaFin.setHours(23, 59, 59, 999);

      const slots = await obtenerSlotsSugeridos(
        item._id,
        fechaInicio.toISOString(),
        fechaFin.toISOString()
      );
      setSlotsSugeridos(slots);
    } catch (err) {
      console.error('Error al cargar slots sugeridos:', err);
      alert(err instanceof Error ? err.message : 'Error al cargar slots sugeridos');
    } finally {
      setCargandoSlots(false);
    }
  };

  const handleMostrarSlots = () => {
    if (!mostrarSlots) {
      cargarSlotsSugeridos();
    }
    setMostrarSlots(!mostrarSlots);
  };

  const handleAsignarSlot = async (slot: SlotSugerido) => {
    try {
      await onAsignarSlot(item, slot);
      setMostrarSlots(false);
    } catch (err) {
      // El error ya se maneja en el componente padre
    }
  };

  const prioridadColor = {
    alta: 'bg-red-100 text-red-800 border-red-300',
    media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    baja: 'bg-blue-100 text-blue-800 border-blue-300',
  }[item.prioridad || 'media'];

  const fechaCreacion = new Date(item.fechaCreacion);
  const diasEnEspera = Math.floor((Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-3 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <p className="font-semibold text-sm">
              {item.paciente.nombre} {item.paciente.apellidos}
            </p>
            {item.prioridad && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${prioridadColor}`}>
                {item.prioridad.toUpperCase()}
              </span>
            )}
          </div>

          {item.tratamiento && (
            <div className="flex items-center space-x-2 mt-1 mb-1">
              <Stethoscope className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                {item.tratamiento.nombre}
              </p>
            </div>
          )}

          {item.profesional && (
            <div className="flex items-center space-x-2 mt-1 mb-1">
              <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Dr/a. {item.profesional.nombre} {item.profesional.apellidos}
              </p>
            </div>
          )}

          {item.especialidad && (
            <div className="mt-1 mb-1">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                {item.especialidad}
              </span>
            </div>
          )}

          {item.fechaPreferida && (
            <div className="flex items-center space-x-2 mt-1 mb-1">
              <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Preferencia: {new Date(item.fechaPreferida).toLocaleDateString('es-ES')}
                {item.horaPreferida && ` a las ${item.horaPreferida}`}
              </p>
            </div>
          )}

          {item.notas && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 line-clamp-2 italic">
                💬 {item.notas}
              </p>
            </div>
          )}

          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
            <span>⏱️ {diasEnEspera} {diasEnEspera === 1 ? 'día' : 'días'} en espera</span>
            {item.intentosReasignacion && item.intentosReasignacion.length > 0 && (
              <span>🔄 {item.intentosReasignacion.length} {item.intentosReasignacion.length === 1 ? 'intento' : 'intentos'}</span>
            )}
          </div>

          {item.paciente.telefono && (
            <div className="mt-1 text-xs text-gray-500">
              📞 {item.paciente.telefono}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEliminar(item._id);
          }}
          className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Eliminar de lista de espera"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Botón para ver slots sugeridos */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={handleMostrarSlots}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${cargandoSlots ? 'animate-spin' : ''}`} />
          <span>
            {mostrarSlots ? 'Ocultar' : 'Ver'} Slots Sugeridos
          </span>
        </button>

        {/* Slots sugeridos */}
        {mostrarSlots && (
          <div className="mt-3 space-y-2">
            {cargandoSlots ? (
              <div className="text-center py-4">
                <RefreshCw className="w-6 h-6 mx-auto text-blue-600 animate-spin mb-2" />
                <p className="text-xs text-gray-600">Buscando slots disponibles...</p>
              </div>
            ) : slotsSugeridos.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <AlertCircle className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-600">No se encontraron slots disponibles</p>
              </div>
            ) : (
              slotsSugeridos.map((slot, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-gray-900">
                          {new Date(slot.fecha).toLocaleDateString('es-ES', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                        <Clock className="w-4 h-4 text-blue-600 ml-2" />
                        <span className="font-semibold text-sm text-gray-900">
                          {slot.hora}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{slot.razon}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          {slot.puntuacion}% coincidencia
                        </span>
                        <span className="text-xs text-gray-500">
                          {slot.duracionMinutos} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAsignarSlot(slot)}
                    className="w-full mt-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                  >
                    Asignar este slot
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Historial de intentos */}
      {item.intentosReasignacion && item.intentosReasignacion.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-700 mb-2">Historial de intentos:</p>
          <div className="space-y-1">
            {item.intentosReasignacion.slice(-3).map((intento, idx) => (
              <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-1 mb-1">
                  {intento.resultado === 'aceptado' && <CheckCircle className="w-3 h-3 text-green-600" />}
                  {intento.resultado === 'rechazado' && <XCircle className="w-3 h-3 text-red-600" />}
                  {intento.resultado === 'no_disponible' && <AlertCircle className="w-3 h-3 text-yellow-600" />}
                  <span className="font-medium">
                    {new Date(intento.fecha).toLocaleDateString('es-ES')} {new Date(intento.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-500">
                  {intento.slotSugerido.fecha} {intento.slotSugerido.hora} - {intento.resultado}
                </p>
                {intento.motivo && (
                  <p className="text-gray-400 italic mt-1">{intento.motivo}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WaitlistPanel({
  isOpen,
  onClose,
  onCitaCreada,
  especialidades = [],
  citas = [],
}: WaitlistPanelProps) {
  const [listaEspera, setListaEspera] = useState<ItemListaEspera[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      cargarListaEspera();
    }
  }, [isOpen, filtroEspecialidad]);

  // Detectar cancelaciones y sugerir slots automáticamente
  useEffect(() => {
    if (isOpen && citas.length > 0) {
      // Verificar si hay citas canceladas recientemente
      const citasCanceladas = citas.filter(c => c.estado === 'cancelada');
      if (citasCanceladas.length > 0 && listaEspera.length > 0) {
        // Podríamos mostrar una notificación o recargar slots sugeridos
        // Por ahora, solo recargamos la lista
      }
    }
  }, [citas, isOpen, listaEspera.length]);

  const cargarListaEspera = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await obtenerListaEspera(filtroEspecialidad || undefined);
      setListaEspera(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la lista de espera');
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarSlot = async (item: ItemListaEspera, slot: SlotSugerido) => {
    try {
      await asignarSlotListaEspera(item._id, {
        fecha: slot.fecha,
        hora: slot.hora,
        profesionalId: slot.profesionalId,
        boxId: slot.boxId,
      });

      // Registrar intento exitoso
      await registrarIntentoReasignacion(item._id, {
        slotSugerido: {
          fecha: slot.fecha,
          hora: slot.hora,
          profesionalId: slot.profesionalId,
        },
        resultado: 'aceptado',
        motivo: 'Slot asignado exitosamente',
      });

      // Recargar lista
      await cargarListaEspera();
      if (onCitaCreada) {
        onCitaCreada();
      }
    } catch (err) {
      // Registrar intento fallido
      try {
        await registrarIntentoReasignacion(item._id, {
          slotSugerido: {
            fecha: slot.fecha,
            hora: slot.hora,
            profesionalId: slot.profesionalId,
          },
          resultado: 'no_disponible',
          motivo: err instanceof Error ? err.message : 'Error al asignar slot',
        });
      } catch (regErr) {
        console.error('Error al registrar intento:', regErr);
      }

      alert(err instanceof Error ? err.message : 'Error al asignar el slot');
    }
  };

  const handleEliminar = async (itemId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este item de la lista de espera?')) {
      return;
    }

    try {
      await eliminarDeListaEspera(itemId, 'Eliminado manualmente por el usuario');
      await cargarListaEspera();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar de la lista de espera');
    }
  };

  if (!isOpen) return null;

  const itemsFiltrados = listaEspera.filter(item => 
    !filtroEspecialidad || 
    item.especialidad === filtroEspecialidad || 
    item.profesional?.especialidad === filtroEspecialidad
  );

  // Obtener lista única de especialidades
  const especialidadesUnicas = Array.from(new Set([
    ...especialidades,
    ...listaEspera.map(item => item.especialidad).filter(Boolean) as string[],
    ...listaEspera.map(item => item.profesional?.especialidad).filter(Boolean) as string[],
  ]));

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lista de Espera</h2>
            <p className="text-xs text-gray-600">
              {itemsFiltrados.length} {itemsFiltrados.length === 1 ? 'item' : 'items'} en espera
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filtros */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 mb-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Filtrar por especialidad:</label>
        </div>
        <select
          value={filtroEspecialidad}
          onChange={(e) => setFiltroEspecialidad(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          <option value="">Todas las especialidades</option>
          {especialidadesUnicas.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando lista de espera...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={cargarListaEspera}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : itemsFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista de espera vacía</h3>
            <p className="text-gray-600 text-sm">
              {filtroEspecialidad 
                ? `No hay items en espera para ${filtroEspecialidad}`
                : 'No hay pacientes en lista de espera en este momento'}
            </p>
          </div>
        ) : (
          <div>
            {itemsFiltrados.map((item) => (
              <ItemListaEsperaCard
                key={item._id}
                item={item}
                onAsignarSlot={handleAsignarSlot}
                onEliminar={handleEliminar}
                citas={citas}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer con instrucciones */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          💡 Los slots sugeridos se actualizan automáticamente cuando hay cancelaciones
        </p>
      </div>
    </div>
  );
}

