import { useState, useRef } from 'react';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';
import ListaCitasPaciente from '../components/ListaCitasPaciente';
import ModalGestionCita from '../components/ModalGestionCita';
import ConfirmacionCancelacionModal from '../components/ConfirmacionCancelacionModal';
import { cancelarMiCita, CitaPaciente } from '../api/citasPacienteApi';

interface MisCitasPageProps {
  onVolver?: () => void;
}

export default function MisCitasPage({ onVolver }: MisCitasPageProps) {
  const [tabActiva, setTabActiva] = useState<'proximas' | 'pasadas'>('proximas');
  const [modalNuevaCitaAbierto, setModalNuevaCitaAbierto] = useState(false);
  const [modalModificarCitaAbierto, setModalModificarCitaAbierto] = useState(false);
  const [modalCancelacionAbierto, setModalCancelacionAbierto] = useState(false);
  const [citaAModificar, setCitaAModificar] = useState<CitaPaciente | null>(null);
  const [citaACancelar, setCitaACancelar] = useState<{ id: string; fecha?: string } | null>(null);
  const [cargandoCancelacion, setCargandoCancelacion] = useState(false);
  const [keyRecarga, setKeyRecarga] = useState(0);
  const fechaCitaRef = useRef<string | undefined>(undefined);

  const handleNuevaCita = () => {
    setModalNuevaCitaAbierto(true);
  };

  const handleModificarCita = (cita: CitaPaciente) => {
    setCitaAModificar(cita);
    setModalModificarCitaAbierto(true);
  };

  const handleCancelarCita = async (citaId: string) => {
    // Obtener la cita para mostrar su fecha en el modal
    try {
      // En un caso real, obtendríamos la cita de la lista actual
      // Por ahora, solo almacenamos el ID
      const fechaCita = fechaCitaRef.current;
      setCitaACancelar({ id: citaId, fecha: fechaCita });
      setModalCancelacionAbierto(true);
    } catch (error) {
      // Si falla obtener la fecha, continuar con la cancelación sin fecha
      setCitaACancelar({ id: citaId });
      setModalCancelacionAbierto(true);
    }
  };

  const confirmarCancelacion = async () => {
    if (!citaACancelar) return;

    try {
      setCargandoCancelacion(true);
      await cancelarMiCita(citaACancelar.id);
      
      // Forzar recarga del componente de citas
      setKeyRecarga(prev => prev + 1);
      
      // Cerrar modal
      setModalCancelacionAbierto(false);
      setCitaACancelar(null);
      
      // Mostrar mensaje de éxito (podría ser un toast)
      alert('Cita cancelada exitosamente');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al cancelar la cita');
    } finally {
      setCargandoCancelacion(false);
    }
  };

  const handleCerrarModalCancelacion = () => {
    if (!cargandoCancelacion) {
      setModalCancelacionAbierto(false);
      setCitaACancelar(null);
    }
  };

  const handleCitaCreadaOModificada = () => {
    // Forzar recarga de citas
    setKeyRecarga(prev => prev + 1);
    setModalNuevaCitaAbierto(false);
    setModalModificarCitaAbierto(false);
    setCitaAModificar(null);
  };

  const handleCerrarModalNueva = () => {
    setModalNuevaCitaAbierto(false);
  };

  const handleCerrarModalModificar = () => {
    setModalModificarCitaAbierto(false);
    setCitaAModificar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
                  <p className="text-sm text-gray-600">
                    Gestiona tus citas próximas y consulta tu historial
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleNuevaCita}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Cita</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setTabActiva('proximas')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${tabActiva === 'proximas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Citas Próximas
              </button>
              <button
                onClick={() => setTabActiva('pasadas')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${tabActiva === 'pasadas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Historial
              </button>
            </nav>
          </div>

          {/* Lista de Citas */}
          {tabActiva === 'proximas' ? (
            <ListaCitasPaciente
              key={keyRecarga}
              estado="Programada"
              esProxima={true}
              onCancelarCita={handleCancelarCita}
              onModificarCita={handleModificarCita}
            />
          ) : (
            <ListaCitasPaciente
              estado="Completada"
              esProxima={false}
            />
          )}
        </div>
      </main>

      {/* Modal de Nueva Cita */}
      <ModalGestionCita
        isOpen={modalNuevaCitaAbierto}
        onClose={handleCerrarModalNueva}
        onExito={handleCitaCreadaOModificada}
        citaParaModificar={null}
      />

      {/* Modal de Modificar Cita */}
      <ModalGestionCita
        isOpen={modalModificarCitaAbierto}
        onClose={handleCerrarModalModificar}
        onExito={handleCitaCreadaOModificada}
        citaParaModificar={citaAModificar}
      />

      {/* Modal de Confirmación de Cancelación */}
      <ConfirmacionCancelacionModal
        isOpen={modalCancelacionAbierto}
        onClose={handleCerrarModalCancelacion}
        onConfirmar={confirmarCancelacion}
        citaId={citaACancelar?.id || null}
        fechaCita={citaACancelar?.fecha}
        cargando={cargandoCancelacion}
      />
    </div>
  );
}
