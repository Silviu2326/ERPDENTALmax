import { useState, useEffect } from 'react';
import { X, Clock, User, Stethoscope, Filter, Trash2, Calendar } from 'lucide-react';
import { CitaPendiente, obtenerCitasPendientes, descartarCitaPendiente } from '../api/citasApi';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface PendingAppointmentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCitaProgramada?: () => void;
  especialidades?: string[];
}

function CitaPendienteItem({ 
  cita, 
  onDescartar 
}: { 
  cita: CitaPendiente; 
  onDescartar: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `pendiente-${cita._id}`,
    data: {
      tipo: 'citaPendiente',
      citaPendiente: cita,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border-2 border-gray-200 p-3 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? 'z-50 shadow-2xl' : ''
      } ${cita.descartada ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <p className="font-semibold text-sm truncate">
              {cita.paciente.nombre} {cita.paciente.apellidos}
            </p>
          </div>
          {cita.tratamiento && (
            <div className="flex items-center space-x-2 mt-1">
              <Stethoscope className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-600 truncate">
                {cita.tratamiento.nombre}
              </p>
            </div>
          )}
          {cita.especialidad && (
            <div className="mt-1">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                {cita.especialidad}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDescartar(cita._id);
          }}
          className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Descartar cita"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {cita.notas && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2 italic">
            💬 {cita.notas}
          </p>
        </div>
      )}
      
      {cita.paciente.telefono && (
        <div className="mt-2 text-xs text-gray-500">
          📞 {cita.paciente.telefono}
        </div>
      )}
    </div>
  );
}

export default function PendingAppointmentsPanel({
  isOpen,
  onClose,
  onCitaProgramada,
  especialidades = [],
}: PendingAppointmentsPanelProps) {
  const [citasPendientes, setCitasPendientes] = useState<CitaPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      cargarCitasPendientes();
    }
  }, [isOpen, filtroEspecialidad]);

  const cargarCitasPendientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const citas = await obtenerCitasPendientes(filtroEspecialidad || undefined);
      // Filtrar las descartadas si es necesario (o mostrarlas con estilo diferente)
      setCitasPendientes(citas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas pendientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDescartar = async (citaId: string) => {
    try {
      await descartarCitaPendiente(citaId);
      // Recargar la lista
      await cargarCitasPendientes();
      if (onCitaProgramada) {
        onCitaProgramada();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al descartar la cita');
    }
  };

  if (!isOpen) return null;

  const citasFiltradas = citasPendientes.filter(cita => 
    !filtroEspecialidad || cita.especialidad === filtroEspecialidad || cita.profesional?.especialidad === filtroEspecialidad
  );

  // Obtener lista única de especialidades
  const especialidadesUnicas = Array.from(new Set([
    ...especialidades,
    ...citasPendientes.map(c => c.especialidad).filter(Boolean) as string[],
    ...citasPendientes.map(c => c.profesional?.especialidad).filter(Boolean) as string[],
  ]));

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Citas Pendientes</h2>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
            <Clock className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando citas pendientes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={cargarCitasPendientes}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay citas pendientes</h3>
            <p className="text-gray-600 text-sm">
              {filtroEspecialidad 
                ? `No hay citas pendientes para ${filtroEspecialidad}`
                : 'No hay citas sin hora asignada en este momento'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {citasFiltradas.length} {citasFiltradas.length === 1 ? 'cita pendiente' : 'citas pendientes'}
            </p>
            <div className="space-y-2">
              {citasFiltradas.map((cita) => (
                <CitaPendienteItem
                  key={cita._id}
                  cita={cita}
                  onDescartar={handleDescartar}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer con instrucciones */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          💡 Arrastra una cita a la agenda para programarla
        </p>
      </div>
    </div>
  );
}

