import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Loader2, Calendar } from 'lucide-react';
import {
  CitaProfesional,
  obtenerAgendaProfesional,
  obtenerDetallesCitaMovil,
  actualizarEstadoCita,
  FiltrosAgendaProfesional,
} from '../api/agendaProfesionalApi';
import AppointmentCardMobile from './AppointmentCardMobile';
import DateNavigatorMobile from './DateNavigatorMobile';
import ProfessionalFilterMobile from './ProfessionalFilterMobile';
import { Profesional, obtenerProfesionalesActivos } from '../api/agendaProfesionalApi';

interface MobileAgendaViewProps {
  profesionalId?: string;
  mostrarFiltroProfesional?: boolean;
}

export default function MobileAgendaView({
  profesionalId: profesionalIdProp,
  mostrarFiltroProfesional = false,
}: MobileAgendaViewProps) {
  const [citas, setCitas] = useState<CitaProfesional[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [vista, setVista] = useState<'dia' | 'semana'>('dia');
  const [profesionalSeleccionadoId, setProfesionalSeleccionadoId] = useState<string | undefined>(
    profesionalIdProp
  );
  const [citaDetalles, setCitaDetalles] = useState<string | null>(null);

  // Cargar profesionales si es necesario
  useEffect(() => {
    if (mostrarFiltroProfesional) {
      cargarProfesionales();
    }
  }, [mostrarFiltroProfesional]);

  // Cargar citas cuando cambian los filtros
  useEffect(() => {
    cargarCitas();
  }, [fechaSeleccionada, vista, profesionalSeleccionadoId]);

  const cargarProfesionales = async () => {
    try {
      const datos = await obtenerProfesionalesActivos();
      setProfesionales(datos);
    } catch (err) {
      console.error('Error al cargar profesionales:', err);
    }
  };

  const cargarCitas = async () => {
    setLoading(true);
    setError(null);

    try {
      const fechaInicio = new Date(fechaSeleccionada);
      fechaInicio.setHours(0, 0, 0, 0);

      const fechaFin = new Date(fechaSeleccionada);
      if (vista === 'dia') {
        fechaFin.setHours(23, 59, 59, 999);
      } else {
        fechaFin.setDate(fechaFin.getDate() + 6);
        fechaFin.setHours(23, 59, 59, 999);
      }

      const filtros: FiltrosAgendaProfesional = {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        profesionalId: profesionalSeleccionadoId,
      };

      const datos = await obtenerAgendaProfesional(filtros);
      setCitas(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas');
      console.error('Error al cargar citas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = async (citaId: string) => {
    try {
      const detalles = await obtenerDetallesCitaMovil(citaId);
      setCitaDetalles(citaId);
      // Aquí podrías mostrar un modal con los detalles
      console.log('Detalles de la cita:', detalles);
    } catch (err) {
      console.error('Error al obtener detalles:', err);
    }
  };

  const handleLlamarPaciente = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  const handleCambiarEstado = async (citaId: string, nuevoEstado: CitaProfesional['estado']) => {
    try {
      await actualizarEstadoCita(citaId, nuevoEstado);
      // Recargar citas después de actualizar
      await cargarCitas();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const citasFiltradas = citas.filter((cita) => {
    const fechaCita = new Date(cita.fechaHoraInicio);
    if (vista === 'dia') {
      return (
        fechaCita.getDate() === fechaSeleccionada.getDate() &&
        fechaCita.getMonth() === fechaSeleccionada.getMonth() &&
        fechaCita.getFullYear() === fechaSeleccionada.getFullYear()
      );
    } else {
      // Semana: mostrar todas las citas del rango
      return true;
    }
  });

  // Ordenar citas por hora
  citasFiltradas.sort((a, b) => {
    const fechaA = new Date(a.fechaHoraInicio).getTime();
    const fechaB = new Date(b.fechaHoraInicio).getTime();
    return fechaA - fechaB;
  });

  return (
    <div className="space-y-6">
      <DateNavigatorMobile
        fechaSeleccionada={fechaSeleccionada}
        vista={vista}
        onCambiarFecha={setFechaSeleccionada}
        onCambiarVista={setVista}
      />

      {mostrarFiltroProfesional && (
        <ProfessionalFilterMobile
          profesionales={profesionales}
          profesionalSeleccionadoId={profesionalSeleccionadoId}
          onSeleccionarProfesional={setProfesionalSeleccionadoId}
          mostrarTodos={true}
        />
      )}

      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <button
          onClick={cargarCitas}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-all text-sm font-medium shadow-sm"
          aria-label="Refrescar"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refrescar
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarCitas}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {!loading && !error && citasFiltradas.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {vista === 'dia' ? 'No hay citas del día' : 'No hay citas de la semana'}
          </h3>
          <p className="text-gray-600">
            No hay citas programadas para este período
          </p>
        </div>
      )}

      {/* Lista de citas */}
      {!loading && !error && citasFiltradas.length > 0 && (
        <div className="space-y-4">
          {citasFiltradas.map((cita) => (
            <AppointmentCardMobile
              key={cita._id}
              cita={cita}
              onVerDetalles={handleVerDetalles}
              onLlamarPaciente={handleLlamarPaciente}
              mostrarDetalles={citaDetalles === cita._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}



