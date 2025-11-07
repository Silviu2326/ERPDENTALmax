import { useState, useEffect } from 'react';
import { ArrowLeft, Baby, Plus, AlertCircle, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <Baby size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un Paciente</h3>
            <p className="text-gray-600 mb-4">
              Para acceder a las aplicaciones de flúor y selladores, necesita seleccionar un paciente
              primero.
            </p>
            <div className="mb-4">
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
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700"
              >
                <ArrowLeft size={18} />
                <span>Volver</span>
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
              <div className="flex items-center gap-4">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Volver"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <div className="flex items-center">
                  {/* Icono con contenedor */}
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Baby size={24} className="text-blue-600" />
                  </div>
                  
                  {/* Título y descripción */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Odontopediatría: Fluorizaciones y Selladores
                    </h1>
                    <p className="text-gray-600">
                      Registro y seguimiento de tratamientos preventivos
                    </p>
                  </div>
                </div>
              </div>
              {!mostrarFormulario && (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
                >
                  <Plus size={20} />
                  <span>Nueva Aplicación</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={20} className="text-red-500" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm mt-1 text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {mostrarFormulario ? (
            <div>
              {aplicacionEditando && (
                <div className="bg-white shadow-sm rounded-xl p-4 mb-6">
                  <p className="text-gray-600">
                    Editando aplicación del {new Date(aplicacionEditando.fechaAplicacion).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
              <FormularioAplicacionFluorSellador
                pacienteId={pacienteId}
                profesionalId={user?._id || ''}
                onSubmit={aplicacionEditando ? (handleActualizar as any) : handleGuardar}
                onCancel={handleCancelarFormulario}
                loading={loading}
              />
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl p-0">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Historial de Aplicaciones</h2>
              </div>
              <div className="p-4">
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
    </div>
  );
}



