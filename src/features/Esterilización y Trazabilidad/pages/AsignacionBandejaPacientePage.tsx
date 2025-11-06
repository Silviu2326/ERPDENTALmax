import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  PacienteActivo,
  BandejaEsteril,
  buscarBandejaPorCodigo,
  crearAsignacion,
  NuevaAsignacion,
} from '../api/trazabilidadApi';
import EscanerQRBandeja from '../components/EscanerQRBandeja';
import SelectorPacienteActivo from '../components/SelectorPacienteActivo';
import DetalleBandejaScaneada from '../components/DetalleBandejaScaneada';
import ModalConfirmarAsignacion from '../components/ModalConfirmarAsignacion';
import ListaAsignacionesRecientes from '../components/ListaAsignacionesRecientes';

interface AsignacionBandejaPacientePageProps {
  onVolver?: () => void;
}

export default function AsignacionBandejaPacientePage({ onVolver }: AsignacionBandejaPacientePageProps) {
  const { user } = useAuth();
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteActivo | null>(null);
  const [bandejaEscaneada, setBandejaEscaneada] = useState<BandejaEsteril | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asignacionExitosa, setAsignacionExitosa] = useState(false);

  const handleCodigoEscaneado = async (codigo: string) => {
    try {
      setError(null);
      setBandejaEscaneada(null);
      const bandeja = await buscarBandejaPorCodigo(codigo);
      setBandejaEscaneada(bandeja);
    } catch (err: any) {
      console.error('Error al buscar bandeja:', err);
      setError(err.message || 'Error al buscar la bandeja. Verifique el código escaneado.');
      setBandejaEscaneada(null);
    }
  };

  const handlePacienteSeleccionado = (paciente: PacienteActivo) => {
    setPacienteSeleccionado(paciente);
    setError(null);
  };

  const handleConfirmarAsignacion = async () => {
    if (!pacienteSeleccionado || !bandejaEscaneada) return;

    try {
      setLoading(true);
      setError(null);

      const datosAsignacion: NuevaAsignacion = {
        pacienteId: pacienteSeleccionado._id,
        bandejaId: bandejaEscaneada._id,
        // En una implementación real, se obtendría el citaId de la cita activa del paciente
        // citaId: pacienteSeleccionado.citaActivaId,
      };

      await crearAsignacion(datosAsignacion);

      setMostrarModalConfirmacion(false);
      setAsignacionExitosa(true);

      // Limpiar el formulario después de 3 segundos
      setTimeout(() => {
        resetearFormulario();
      }, 3000);
    } catch (err: any) {
      console.error('Error al crear asignación:', err);
      setError(err.message || 'Error al crear la asignación. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetearFormulario = () => {
    setPacienteSeleccionado(null);
    setBandejaEscaneada(null);
    setError(null);
    setAsignacionExitosa(false);
  };

  const puedeAsignar = () => {
    return (
      pacienteSeleccionado &&
      bandejaEscaneada &&
      bandejaEscaneada.estado === 'Disponible' &&
      new Date(bandejaEscaneada.fechaVencimiento) >= new Date()
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Asignación de Bandejas a Pacientes</h2>
                <p className="text-gray-600 mt-1">
                  Asigne bandejas esterilizadas a pacientes mediante escaneo de código QR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {asignacionExitosa && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-800">Asignación realizada exitosamente</p>
              <p className="text-sm text-green-700 mt-1">
                La bandeja ha sido asignada al paciente correctamente.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Layout principal: Dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Columna izquierda: Selector de paciente y escáner */}
          <div className="space-y-6">
            <SelectorPacienteActivo
              pacienteSeleccionado={pacienteSeleccionado}
              onPacienteSeleccionado={handlePacienteSeleccionado}
            />

            <EscanerQRBandeja onCodigoEscaneado={handleCodigoEscaneado} />
          </div>

          {/* Columna derecha: Detalle de bandeja y acciones */}
          <div className="space-y-6">
            {bandejaEscaneada && (
              <>
                <DetalleBandejaScaneada bandeja={bandejaEscaneada} />

                {puedeAsignar() && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <button
                      onClick={() => setMostrarModalConfirmacion(true)}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirmar Asignación</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {!bandejaEscaneada && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">
                  Escanee un código QR de bandeja para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lista de asignaciones recientes */}
        <ListaAsignacionesRecientes limit={10} />

        {/* Modal de confirmación */}
        {mostrarModalConfirmacion && pacienteSeleccionado && bandejaEscaneada && (
          <ModalConfirmarAsignacion
            paciente={pacienteSeleccionado}
            bandeja={bandejaEscaneada}
            onConfirmar={handleConfirmarAsignacion}
            onCancelar={() => setMostrarModalConfirmacion(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}


