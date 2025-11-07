import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Loader2, Calendar, Users } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerAgendaDiariaPorSucursal,
  obtenerProfesionalesPorSucursal,
  actualizarEstadoCitaRecepcion,
  CitaAgenda,
  ProfesionalAgenda,
  AgendaDiariaPorSucursal,
} from '../api/agenda';
import MobileAgendaHeader from '../components/mobile-agenda/MobileAgendaHeader';
import DoctorColumn from '../components/mobile-agenda/DoctorColumn';
import AppointmentStatusModal from '../components/mobile-agenda/AppointmentStatusModal';

export default function ReceptionMobileAgendaPage() {
  const { user } = useAuth();
  const [agendaDiaria, setAgendaDiaria] = useState<AgendaDiariaPorSucursal>({});
  const [profesionales, setProfesionales] = useState<ProfesionalAgenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaAgenda | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Obtener ID de sucursal del usuario (en producción, esto vendría del contexto de autenticación)
  const idSucursal = (user as any)?.sucursalId || 'default-sucursal-id';

  // Cargar profesionales al montar el componente
  useEffect(() => {
    cargarProfesionales();
  }, [idSucursal]);

  // Cargar agenda cuando cambia la fecha
  useEffect(() => {
    cargarAgendaDiaria();
  }, [fechaSeleccionada, idSucursal]);

  const cargarProfesionales = async () => {
    try {
      const datos = await obtenerProfesionalesPorSucursal(idSucursal);
      setProfesionales(datos);
    } catch (err) {
      console.error('Error al cargar profesionales:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los profesionales');
    }
  };

  const cargarAgendaDiaria = async () => {
    setLoading(true);
    setError(null);

    try {
      const fechaFormato = fechaSeleccionada.toISOString().split('T')[0]; // YYYY-MM-DD
      const datos = await obtenerAgendaDiariaPorSucursal(fechaFormato, idSucursal);
      setAgendaDiaria(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la agenda diaria');
      console.error('Error al cargar agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnteriorDia = () => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() - 1);
    setFechaSeleccionada(nuevaFecha);
  };

  const handleSiguienteDia = () => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    setFechaSeleccionada(nuevaFecha);
  };

  const handleHoy = () => {
    setFechaSeleccionada(new Date());
  };

  const handleCitaClick = (cita: CitaAgenda) => {
    setCitaSeleccionada(cita);
    setModalAbierto(true);
  };

  const handleLlamarPaciente = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  const handleCambiarEstado = async (citaId: string, nuevoEstado: CitaAgenda['estado']) => {
    try {
      await actualizarEstadoCitaRecepcion(citaId, nuevoEstado);
      // Recargar la agenda después de actualizar
      await cargarAgendaDiaria();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      throw err; // Re-lanzar para que el modal lo maneje
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setCitaSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Calendar size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Portal de Cita Online y Móvil
                </h1>
                <p className="text-gray-600">
                  Vista de recepción con agenda por profesional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Navegador de fecha */}
          <MobileAgendaHeader
            fechaSeleccionada={fechaSeleccionada}
            onCambiarFecha={setFechaSeleccionada}
            onAnteriorDia={handleAnteriorDia}
            onSiguienteDia={handleSiguienteDia}
            onHoy={handleHoy}
          />

          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={cargarAgendaDiaria}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refrescar"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Refrescar
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarAgendaDiaria}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && profesionales.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          )}

          {/* Vista de columnas por profesional */}
          {!loading && profesionales.length > 0 && (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {profesionales.map((profesional) => {
                const citasDelProfesional = agendaDiaria[profesional._id] || [];
                return (
                  <DoctorColumn
                    key={profesional._id}
                    profesional={profesional}
                    citas={citasDelProfesional}
                    onCitaClick={handleCitaClick}
                    onLlamarPaciente={handleLlamarPaciente}
                  />
                );
              })}
            </div>
          )}

          {/* Mensaje cuando no hay profesionales */}
          {!loading && profesionales.length === 0 && !error && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay profesionales</h3>
              <p className="text-gray-600 mb-4">
                No hay profesionales registrados en esta sucursal
              </p>
            </div>
          )}

          {/* Mensaje cuando no hay citas */}
          {!loading &&
            profesionales.length > 0 &&
            Object.keys(agendaDiaria).length === 0 &&
            !error && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay citas programadas</h3>
                <p className="text-gray-600 mb-4">
                  No hay citas programadas para este día
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Modal de cambio de estado */}
      <AppointmentStatusModal
        cita={citaSeleccionada}
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onCambiarEstado={handleCambiarEstado}
      />
    </div>
  );
}



