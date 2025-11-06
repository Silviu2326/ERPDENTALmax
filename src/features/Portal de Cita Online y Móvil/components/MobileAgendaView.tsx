import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 p-4">
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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {vista === 'dia' ? 'Citas del día' : 'Citas de la semana'}
        </h2>
        <button
          onClick={cargarCitas}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Refrescar"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!loading && !error && citasFiltradas.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No hay citas programadas para este período</p>
        </div>
      )}

      {!loading && !error && citasFiltradas.length > 0 && (
        <div className="space-y-3">
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


