import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Blanqueamiento,
  CrearBlanqueamientoData,
  obtenerBlanqueamientosPorPaciente,
  crearNuevoBlanqueamiento,
} from '../api/blanqueamientoApi';
import FormularioNuevoBlanqueamiento from '../components/FormularioNuevoBlanqueamiento';
import HistorialBlanqueamientos from '../components/HistorialBlanqueamientos';
import DetalleTratamientoBlanqueamiento from '../components/DetalleTratamientoBlanqueamiento';

interface BlanqueamientoDentalPacientePageProps {
  pacienteId?: string;
  onVolver?: () => void;
}

export default function BlanqueamientoDentalPacientePage({
  pacienteId: pacienteIdProp,
  onVolver,
}: BlanqueamientoDentalPacientePageProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [blanqueamientos, setBlanqueamientos] = useState<Blanqueamiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [blanqueamientoSeleccionado, setBlanqueamientoSeleccionado] = useState<Blanqueamiento | null>(null);

  useEffect(() => {
    if (pacienteId) {
      cargarBlanqueamientos();
    }
  }, [pacienteId]);

  const cargarBlanqueamientos = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerBlanqueamientosPorPaciente(pacienteId);
      setBlanqueamientos(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los tratamientos');
      setBlanqueamientos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (datos: CrearBlanqueamientoData) => {
    if (!pacienteId || !user) return;

    try {
      await crearNuevoBlanqueamiento(datos);
      await cargarBlanqueamientos();
      setMostrarFormulario(false);
      setError(null);
    } catch (err) {
      throw err;
    }
  };

  const handleVerDetalle = (blanqueamiento: Blanqueamiento) => {
    setBlanqueamientoSeleccionado(blanqueamiento);
  };

  const handleActualizado = () => {
    cargarBlanqueamientos();
    // Si estamos viendo el detalle, actualizar también el objeto seleccionado
    if (blanqueamientoSeleccionado) {
      cargarBlanqueamientos().then(() => {
        const actualizado = blanqueamientos.find((b) => b._id === blanqueamientoSeleccionado._id);
        if (actualizado) {
          setBlanqueamientoSeleccionado(actualizado);
        }
      });
    }
  };

  // Si hay un blanqueamiento seleccionado, mostrar el detalle
  if (blanqueamientoSeleccionado) {
    return (
      <DetalleTratamientoBlanqueamiento
        blanqueamiento={blanqueamientoSeleccionado}
        onVolver={() => {
          setBlanqueamientoSeleccionado(null);
          cargarBlanqueamientos();
        }}
        onActualizado={handleActualizado}
        loading={loading}
      />
    );
  }

  // Si no hay pacienteId, mostrar selector
  if (!pacienteId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
            <div className="p-2 bg-blue-100 rounded-xl mx-auto mb-4 ring-1 ring-blue-200/70 w-fit">
              <Sparkles size={48} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un Paciente</h3>
            <p className="text-gray-600 mb-4">
              Para acceder a los tratamientos de blanqueamiento, necesita seleccionar un paciente primero.
            </p>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-slate-700 mb-2">ID del Paciente</label>
              <input
                type="text"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                placeholder="Ingrese el ID del paciente"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            {onVolver && (
              <button
                onClick={onVolver}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                    title="Volver"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Sparkles size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Estética Dental: Blanqueamiento
                  </h1>
                  <p className="text-gray-600">
                    Planificación, ejecución y seguimiento de tratamientos de blanqueamiento
                  </p>
                </div>
              </div>
              {!mostrarFormulario && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setMostrarFormulario(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus size={20} />
                    Nuevo Tratamiento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {mostrarFormulario ? (
          <FormularioNuevoBlanqueamiento
            pacienteId={pacienteId}
            profesionalId={user?._id || ''}
            onSubmit={handleGuardar}
            onCancel={() => setMostrarFormulario(false)}
            loading={loading}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Tratamientos</h2>
              <HistorialBlanqueamientos
                blanqueamientos={blanqueamientos}
                loading={loading}
                onVerDetalle={handleVerDetalle}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



