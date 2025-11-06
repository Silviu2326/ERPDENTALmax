import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  RegistroEndodoncia,
  obtenerRegistroPorTratamientoId,
  crearRegistroEndodoncia,
  actualizarRegistroEndodoncia,
} from '../api/endodonciaApi';
import EndodonciaForm from '../components/EndodonciaForm';

interface EndodonciaRegistroPageProps {
  tratamientoId?: string;
  pacienteId?: string;
  numeroDiente?: number;
  onVolver?: () => void;
}

export default function EndodonciaRegistroPage({
  tratamientoId: tratamientoIdProp,
  pacienteId: pacienteIdProp,
  numeroDiente: numeroDienteProp,
  onVolver,
}: EndodonciaRegistroPageProps) {
  const { user } = useAuth();
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [numeroDiente, setNumeroDiente] = useState<number | undefined>(numeroDienteProp);
  const [registroExistente, setRegistroExistente] = useState<RegistroEndodoncia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar registro existente si hay tratamientoId
  useEffect(() => {
    if (tratamientoId) {
      cargarRegistroExistente();
    }
  }, [tratamientoId]);

  const cargarRegistroExistente = async () => {
    if (!tratamientoId) return;

    setLoading(true);
    setError(null);
    try {
      const registro = await obtenerRegistroPorTratamientoId(tratamientoId);
      if (registro) {
        setRegistroExistente(registro);
        setPacienteId(registro.pacienteId);
        setNumeroDiente(registro.numeroDiente);
      }
    } catch (err: any) {
      console.error('Error al cargar registro:', err);
      setError('No se pudo cargar el registro existente');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (registro: RegistroEndodoncia) => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (registroExistente?._id) {
        // Actualizar registro existente
        await actualizarRegistroEndodoncia(registroExistente._id, {
          conductos: registro.conductos,
          observacionesGenerales: registro.observacionesGenerales,
        });
        setSuccess(true);
        // Recargar registro actualizado
        await cargarRegistroExistente();
      } else {
        // Crear nuevo registro
        const nuevoRegistro = await crearRegistroEndodoncia({
          tratamientoId: registro.tratamientoId,
          pacienteId: registro.pacienteId,
          odontologoId: user._id || registro.odontologoId,
          numeroDiente: registro.numeroDiente,
          conductos: registro.conductos,
          observacionesGenerales: registro.observacionesGenerales,
        });
        setRegistroExistente(nuevoRegistro);
        setSuccess(true);
      }

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al guardar el registro';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Validar que tenemos los datos mínimos necesarios
  if (!tratamientoId || !pacienteId || !numeroDiente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Información Requerida
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Para registrar los detalles de endodoncia, se requiere:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>ID de Tratamiento</li>
            <li>ID de Paciente</li>
            <li>Número de Diente</li>
          </ul>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Tratamiento
              </label>
              <input
                type="text"
                value={tratamientoId}
                onChange={(e) => setTratamientoId(e.target.value)}
                placeholder="Ingrese el ID del tratamiento"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Paciente
              </label>
              <input
                type="text"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                placeholder="Ingrese el ID del paciente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Diente
              </label>
              <input
                type="number"
                value={numeroDiente || ''}
                onChange={(e) => setNumeroDiente(parseInt(e.target.value) || undefined)}
                placeholder="Ej: 16, 26, 36, 46"
                min="11"
                max="48"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Endodoncia: Registro de Conductos
                  </h1>
                  <p className="text-sm text-gray-600">
                    Registro detallado de parámetros clínicos del tratamiento de conductos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Mensajes de estado */}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-medium">
              Registro guardado exitosamente
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {loading && !registroExistente && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-sm text-center">
            <p className="text-gray-600">Cargando registro...</p>
          </div>
        )}

        {!loading && (
          <EndodonciaForm
            tratamientoId={tratamientoId}
            pacienteId={pacienteId}
            odontologoId={user?._id || ''}
            numeroDiente={numeroDiente}
            registroExistente={registroExistente || undefined}
            onSave={handleSave}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}


