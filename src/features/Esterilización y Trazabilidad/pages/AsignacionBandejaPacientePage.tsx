import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Package } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all mr-4"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Package size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Asignación de Bandejas a Pacientes
                </h1>
                <p className="text-gray-600">
                  Asigne bandejas esterilizadas a pacientes mediante escaneo de código QR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">

        <div className="space-y-6">
          {/* Mensaje de éxito */}
          {asignacionExitosa && (
            <div className="rounded-2xl bg-green-50 ring-1 ring-green-200 p-4 flex items-start space-x-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Asignación realizada exitosamente</p>
                <p className="text-sm text-green-700 mt-1">
                  La bandeja ha sido asignada al paciente correctamente.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-4 flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* Layout principal: Dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <button
                      onClick={() => setMostrarModalConfirmacion(true)}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <CheckCircle size={20} />
                      <span>Confirmar Asignación</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {!bandejaEscaneada && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Escanee una bandeja</h3>
                <p className="text-gray-600">
                  Escanee un código QR de bandeja para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lista de asignaciones recientes */}
        <ListaAsignacionesRecientes limit={10} />
        </div>
      </div>

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
  );
}



