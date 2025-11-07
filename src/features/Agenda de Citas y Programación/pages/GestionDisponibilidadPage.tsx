import { useState, useEffect } from 'react';
import { Calendar, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import {
  obtenerDisponibilidadCompleta,
  guardarHorarioRecurrente,
  eliminarExcepcion,
  HorarioRecurrente,
  ExcepcionDisponibilidad,
  CrearHorarioRecurrente,
} from '../api/disponibilidadApi';
import SelectorProfesionalSede from '../components/SelectorProfesionalSede';
import FormularioHorarioProfesional from '../components/FormularioHorarioProfesional';
import DisponibilidadCalendarView from '../components/DisponibilidadCalendarView';
import ModalGestionExcepcion from '../components/ModalGestionExcepcion';
import ListaBloqueosHorarios from '../components/ListaBloqueosHorarios';

export default function GestionDisponibilidadPage() {
  const [profesionalId, setProfesionalId] = useState<string>('');
  const [sedeId, setSedeId] = useState<string>('');
  const [horariosRecurrentes, setHorariosRecurrentes] = useState<HorarioRecurrente[]>([]);
  const [excepciones, setExcepciones] = useState<ExcepcionDisponibilidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalExcepcion, setMostrarModalExcepcion] = useState(false);
  const [excepcionSeleccionada, setExcepcionSeleccionada] = useState<ExcepcionDisponibilidad | null>(null);

  // Cargar disponibilidad cuando cambie el profesional o sede
  useEffect(() => {
    if (profesionalId && sedeId) {
      cargarDisponibilidad();
    } else {
      setHorariosRecurrentes([]);
      setExcepciones([]);
    }
  }, [profesionalId, sedeId]);

  const cargarDisponibilidad = async () => {
    if (!profesionalId || !sedeId) return;

    setLoading(true);
    setError(null);

    try {
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generar datos mock enriquecidos
      const horariosMock: HorarioRecurrente[] = [];
      const excepcionesMock: ExcepcionDisponibilidad[] = [];
      
      // Generar horarios recurrentes para días laborables (Lunes a Viernes)
      const diasLaborables = [1, 2, 3, 4, 5]; // Lunes a Viernes
      const horariosComunes = [
        { inicio: '09:00', fin: '13:00' },
        { inicio: '15:00', fin: '19:00' },
        { inicio: '09:00', fin: '19:00' }, // Día completo
        { inicio: '10:00', fin: '14:00' },
        { inicio: '16:00', fin: '20:00' },
      ];
      
      // Generar 3-5 horarios recurrentes por profesional
      const numHorarios = 3 + Math.floor(Math.random() * 3);
      const diasSeleccionados = diasLaborables.sort(() => Math.random() - 0.5).slice(0, numHorarios);
      
      diasSeleccionados.forEach((dia, index) => {
        const horario = horariosComunes[index % horariosComunes.length];
        horariosMock.push({
          _id: `horario-${profesionalId}-${sedeId}-${dia}-${index}`,
          profesional: profesionalId,
          sede: sedeId,
          diaSemana: dia,
          horaInicio: horario.inicio,
          horaFin: horario.fin,
          activo: true,
        });
      });
      
      // Generar excepciones (vacaciones, bajas, etc.)
      const ahora = new Date();
      const motivosExcepcion = [
        'Vacaciones',
        'Baja médica',
        'Formación',
        'Congreso',
        'Permiso personal',
        'Baja por maternidad',
        'Jornada de formación',
        'Conferencia médica',
        'Permiso familiar',
      ];
      
      // Generar 2-4 excepciones
      const numExcepciones = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numExcepciones; i++) {
        const fechaInicio = new Date(ahora);
        fechaInicio.setDate(fechaInicio.getDate() + 7 + i * 10);
        fechaInicio.setHours(0, 0, 0, 0);
        
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + (i % 2 === 0 ? 7 : 3)); // 7 días o 3 días
        fechaFin.setHours(23, 59, 59, 999);
        
        excepcionesMock.push({
          _id: `excepcion-${profesionalId}-${sedeId}-${i}`,
          profesional: profesionalId,
          sede: sedeId,
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          motivo: motivosExcepcion[i % motivosExcepcion.length],
          diaCompleto: true,
          creadoPor: '1',
          createdAt: new Date(fechaInicio.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(fechaInicio.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      
      setHorariosRecurrentes(horariosMock);
      setExcepciones(excepcionesMock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarHorario = async (datos: CrearHorarioRecurrente) => {
    try {
      await guardarHorarioRecurrente(datos);
      // Recargar disponibilidad después de guardar
      await cargarDisponibilidad();
    } catch (err) {
      throw err;
    }
  };

  const handleEliminarExcepcion = async (excepcionId: string) => {
    if (!confirm('¿Está seguro de eliminar esta excepción?')) {
      return;
    }

    try {
      await eliminarExcepcion(excepcionId);
      await cargarDisponibilidad();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la excepción');
    }
  };

  const handleNuevaExcepcion = () => {
    setExcepcionSeleccionada(null);
    setMostrarModalExcepcion(true);
  };

  const handleEditarExcepcion = (excepcion: ExcepcionDisponibilidad) => {
    setExcepcionSeleccionada(excepcion);
    setMostrarModalExcepcion(true);
  };

  const handleExcepcionGuardada = () => {
    cargarDisponibilidad();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Gestión de Disponibilidad de Profesionales
                  </h1>
                  <p className="text-gray-600">
                    Configure los horarios de trabajo recurrentes y gestione las excepciones (vacaciones, bajas, etc.)
                  </p>
                </div>
              </div>
              {profesionalId && sedeId && (
                <button
                  onClick={cargarDisponibilidad}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white shadow-sm rounded-xl p-6">
            <SelectorProfesionalSede
              profesionalId={profesionalId}
              sedeId={sedeId}
              onProfesionalChange={setProfesionalId}
              onSedeChange={setSedeId}
            />
          </div>

          {profesionalId && sedeId ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulario de Horarios Recurrentes */}
                <div>
                  <FormularioHorarioProfesional
                    profesionalId={profesionalId}
                    sedeId={sedeId}
                    horariosExistentes={horariosRecurrentes}
                    onGuardar={handleGuardarHorario}
                    loading={loading}
                  />
                </div>

                {/* Vista de Calendario */}
                <div>
                  <DisponibilidadCalendarView
                    horariosRecurrentes={horariosRecurrentes}
                    excepciones={excepciones}
                  />
                </div>
              </div>

              {/* Gestión de Excepciones */}
              <div className="bg-white shadow-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Excepciones y Bloqueos</h2>
                  <button
                    onClick={handleNuevaExcepcion}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                    <span>Nueva Excepción</span>
                  </button>
                </div>

                <ListaBloqueosHorarios
                  excepciones={excepciones}
                  onEliminar={handleEliminarExcepcion}
                  loading={loading}
                />
              </div>
            </>
          ) : (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un profesional y una sede</h3>
              <p className="text-gray-600">
                Para comenzar a gestionar la disponibilidad, seleccione un profesional y una sede
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Gestión de Excepciones */}
      <ModalGestionExcepcion
        isOpen={mostrarModalExcepcion}
        onClose={() => {
          setMostrarModalExcepcion(false);
          setExcepcionSeleccionada(null);
        }}
        profesionalId={profesionalId}
        sedeId={sedeId}
        excepcion={excepcionSeleccionada}
        onExcepcionGuardada={handleExcepcionGuardada}
      />
    </div>
  );
}

