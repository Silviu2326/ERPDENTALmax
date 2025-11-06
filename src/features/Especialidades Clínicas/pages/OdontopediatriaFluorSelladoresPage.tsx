import { useState, useEffect } from 'react';
import { ArrowLeft, Baby, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  AplicacionPreventiva,
  CrearAplicacionData,
  ActualizarAplicacionData,
  obtenerAplicacionesPorPaciente,
  crearNuevaAplicacion,
  actualizarAplicacionExistente,
  eliminarAplicacion,
} from '../api/odontopediatriaApi';
import FormularioAplicacionFluorSellador from '../components/FormularioAplicacionFluorSellador';
import HistorialAplicacionesTable from '../components/HistorialAplicacionesTable';

interface OdontopediatriaFluorSelladoresPageProps {
  pacienteId?: string;
  onVolver?: () => void;
}

export default function OdontopediatriaFluorSelladoresPage({
  pacienteId: pacienteIdProp,
  onVolver,
}: OdontopediatriaFluorSelladoresPageProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [aplicaciones, setAplicaciones] = useState<AplicacionPreventiva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aplicacionEditando, setAplicacionEditando] = useState<AplicacionPreventiva | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<'Fluor' | 'Sellador' | 'Todos'>('Todos');

  useEffect(() => {
    if (pacienteId) {
      cargarAplicaciones();
    }
  }, [pacienteId]);

  const cargarAplicaciones = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerAplicacionesPorPaciente(pacienteId);
      // Ordenar por fecha descendente (más recientes primero)
      const ordenados = datos.sort(
        (a, b) => new Date(b.fechaAplicacion).getTime() - new Date(a.fechaAplicacion).getTime()
      );
      setAplicaciones(ordenados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las aplicaciones');
      setAplicaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (datos: CrearAplicacionData) => {
    if (!pacienteId || !user) return;

    try {
      await crearNuevaAplicacion(pacienteId, datos);
      await cargarAplicaciones();
      setMostrarFormulario(false);
      setError(null);
    } catch (err) {
      throw err;
    }
  };

  const handleEditar = async (aplicacion: AplicacionPreventiva) => {
    setAplicacionEditando(aplicacion);
    setMostrarFormulario(true);
  };

  const handleActualizar = async (datos: ActualizarAplicacionData) => {
    if (!pacienteId || !aplicacionEditando?._id) return;

    try {
      await actualizarAplicacionExistente(pacienteId, aplicacionEditando._id, datos);
      await cargarAplicaciones();
      setMostrarFormulario(false);
      setAplicacionEditando(null);
      setError(null);
    } catch (err) {
      throw err;
    }
  };

  const handleEliminar = async (aplicacionId: string) => {
    if (!pacienteId) return;

    try {
      await eliminarAplicacion(pacienteId, aplicacionId);
      await cargarAplicaciones();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la aplicación');
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setAplicacionEditando(null);
  };

  // Si no hay pacienteId, mostrar selector
  if (!pacienteId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg max-w-md w-full">
          <div className="text-center">
            <Baby className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Seleccione un Paciente</h2>
            <p className="text-gray-600 mb-4">
              Para acceder a las aplicaciones de flúor y selladores, necesita seleccionar un paciente
              primero.
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
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-3 rounded-xl shadow-lg">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Odontopediatría: Fluorizaciones y Selladores
                </h1>
                <p className="text-sm text-gray-600">
                  Registro y seguimiento de tratamientos preventivos
                </p>
              </div>
            </div>
            {!mostrarFormulario && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                Nueva Aplicación
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
          <div>
            {aplicacionEditando ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600 mb-4">
                  Editando aplicación del {new Date(aplicacionEditando.fechaAplicacion).toLocaleDateString('es-ES')}
                </p>
                <FormularioAplicacionFluorSellador
                  pacienteId={pacienteId}
                  profesionalId={user?._id || ''}
                  onSubmit={handleActualizar as any}
                  onCancel={handleCancelarFormulario}
                  loading={loading}
                />
              </div>
            ) : (
              <FormularioAplicacionFluorSellador
                pacienteId={pacienteId}
                profesionalId={user?._id || ''}
                onSubmit={handleGuardar}
                onCancel={handleCancelarFormulario}
                loading={loading}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Historial de Aplicaciones</h2>
              <HistorialAplicacionesTable
                aplicaciones={aplicaciones}
                loading={loading}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                filtroTipo={filtroTipo}
                onFiltroTipoChange={setFiltroTipo}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


