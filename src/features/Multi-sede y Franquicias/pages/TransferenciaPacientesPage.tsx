import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import BuscadorPacientesGlobal from '../components/BuscadorPacientesGlobal';
import SelectorSedeDestino from '../components/SelectorSedeDestino';
import ResumenTransferencia from '../components/ResumenTransferencia';
import ModalConfirmacionTransferencia from '../components/ModalConfirmacionTransferencia';
import {
  PacienteGlobal,
  Sede,
  transferirPacienteASede,
} from '../api/transferenciaApi';

interface TransferenciaPacientesPageProps {
  onVolver?: () => void;
}

export default function TransferenciaPacientesPage({
  onVolver,
}: TransferenciaPacientesPageProps) {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteGlobal | null>(null);
  const [sedeDestino, setSedeDestino] = useState<Sede | null>(null);
  const [motivo, setMotivo] = useState('');
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirmarTransferencia = async () => {
    if (!pacienteSeleccionado || !sedeDestino) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await transferirPacienteASede(pacienteSeleccionado._id, {
        sede_destino_id: sedeDestino._id,
        motivo: motivo.trim() || undefined,
      });

      setSuccess(true);
      setMostrarModalConfirmacion(false);

      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setPacienteSeleccionado(null);
        setSedeDestino(null);
        setMotivo('');
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al transferir el paciente');
      setMostrarModalConfirmacion(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIniciarTransferencia = () => {
    if (!pacienteSeleccionado || !sedeDestino) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    if (pacienteSeleccionado.sede_actual._id === sedeDestino._id) {
      setError('El paciente ya pertenece a la sede seleccionada');
      return;
    }

    setError(null);
    setMostrarModalConfirmacion(true);
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Transferencia de Pacientes entre Sedes
          </h1>
          <p className="text-gray-600 mt-1">
            Transfiere el historial completo de un paciente de una sede a otra
          </p>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  Transferencia completada exitosamente
                </p>
                <p className="text-sm text-green-700 mt-1">
                  El paciente {pacienteSeleccionado?.nombre} {pacienteSeleccionado?.apellidos} ha
                  sido transferido a {sedeDestino?.nombre}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        {!success && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Paso 1: Buscar paciente */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Paso 1: Seleccionar Paciente
              </h2>
              <BuscadorPacientesGlobal
                pacienteSeleccionado={pacienteSeleccionado}
                onPacienteSeleccionado={setPacienteSeleccionado}
              />
            </div>

            {/* Paso 2: Seleccionar sede destino */}
            {pacienteSeleccionado && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Paso 2: Seleccionar Sede de Destino
                </h2>
                <SelectorSedeDestino
                  sedeSeleccionada={sedeDestino}
                  onSedeSeleccionada={setSedeDestino}
                  sedeActualId={pacienteSeleccionado.sede_actual._id}
                />
              </div>
            )}

            {/* Paso 3: Motivo (opcional) */}
            {pacienteSeleccionado && sedeDestino && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Paso 3: Motivo de la Transferencia (Opcional)
                </h2>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Cambio de residencia, tratamiento especializado, preferencia del paciente..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Resumen */}
            {pacienteSeleccionado && sedeDestino && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Resumen
                </h2>
                <ResumenTransferencia
                  paciente={pacienteSeleccionado}
                  sedeOrigen={pacienteSeleccionado.sede_actual}
                  sedeDestino={sedeDestino}
                  motivo={motivo}
                />
              </div>
            )}

            {/* Botón de transferir */}
            {pacienteSeleccionado && sedeDestino && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleIniciarTransferencia}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Transferir Paciente</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacionTransferencia
        isOpen={mostrarModalConfirmacion}
        onClose={() => setMostrarModalConfirmacion(false)}
        onConfirmar={handleConfirmarTransferencia}
        pacienteNombre={
          pacienteSeleccionado
            ? `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellidos}`
            : ''
        }
        sedeOrigen={pacienteSeleccionado?.sede_actual.nombre || ''}
        sedeDestino={sedeDestino?.nombre || ''}
        isLoading={isLoading}
      />
    </div>
  );
}

