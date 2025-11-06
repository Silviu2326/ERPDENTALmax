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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg max-w-md w-full">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Seleccione un Paciente</h2>
            <p className="text-gray-600 mb-4">
              Para acceder a los tratamientos de blanqueamiento, necesita seleccionar un paciente primero.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">ID del Paciente</label>
              <input
                type="text"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                placeholder="Ingrese el ID del paciente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Volver"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="bg-gradient-to-br from-pink-600 to-fuchsia-600 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Estética Dental: Blanqueamiento</h1>
                <p className="text-sm text-gray-600">
                  Planificación, ejecución y seguimiento de tratamientos de blanqueamiento
                </p>
              </div>
            </div>
            {!mostrarFormulario && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                Nuevo Tratamiento
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Historial de Tratamientos</h2>
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


