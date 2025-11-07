import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              {onVolver && (
                <button
                  onClick={handleVolver}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Volver</span>
                </button>
              )}
            </div>
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Users size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Transferencia de Pacientes entre Sedes
                </h1>
                <p className="text-gray-600">
                  Transfiere el historial completo de un paciente de una sede a otra
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Mensaje de éxito */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl ring-1 ring-green-200/70">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
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
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl ring-1 ring-red-200/70">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          {!success && (
            <div className="bg-white shadow-sm rounded-2xl p-6 space-y-6">
              {/* Paso 1: Buscar paciente */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Paso 3: Motivo de la Transferencia (Opcional)
                  </h2>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej: Cambio de residencia, tratamiento especializado, preferencia del paciente..."
                    rows={3}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
              )}

              {/* Resumen */}
              {pacienteSeleccionado && sedeDestino && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={handleIniciarTransferencia}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
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

