import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MobileAgendaHeader
        fechaSeleccionada={fechaSeleccionada}
        onCambiarFecha={setFechaSeleccionada}
        onAnteriorDia={handleAnteriorDia}
        onSiguienteDia={handleSiguienteDia}
        onHoy={handleHoy}
      />

      {/* Contenido principal */}
      <div className="p-4">
        {/* Barra de acciones */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Agenda del Día</h1>
          <button
            onClick={cargarAgendaDiaria}
            disabled={loading}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            aria-label="Refrescar"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && profesionales.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Vista de columnas por profesional */}
        {!loading && profesionales.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4">
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
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No hay profesionales registrados en esta sucursal</p>
          </div>
        )}

        {/* Mensaje cuando no hay citas */}
        {!loading &&
          profesionales.length > 0 &&
          Object.keys(agendaDiaria).length === 0 &&
          !error && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No hay citas programadas para este día</p>
            </div>
          )}
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


