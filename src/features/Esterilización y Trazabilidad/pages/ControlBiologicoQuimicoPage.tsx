import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle, TestTube } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ControlEsterilizacion,
  NuevoControlEsterilizacion,
  ActualizarControlEsterilizacion,
  FiltrosControles,
  obtenerControles,
  registrarControl,
  actualizarControl,
  obtenerControlPorId,
} from '../api/controlesApi';
import FormularioRegistroControl from '../components/FormularioRegistroControl';
import TablaHistorialControles from '../components/TablaHistorialControles';
import ModalDetalleControl from '../components/ModalDetalleControl';
import FiltrosBusquedaControles from '../components/FiltrosBusquedaControles';
import FormularioActualizarResultado from '../components/FormularioActualizarResultado';

export default function ControlBiologicoQuimicoPage() {
  const { user } = useAuth();
  const [controles, setControles] = useState<ControlEsterilizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioActualizacion, setMostrarFormularioActualizacion] = useState(false);
  const [controlSeleccionado, setControlSeleccionado] = useState<ControlEsterilizacion | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [controlEditando, setControlEditando] = useState<ControlEsterilizacion | null>(null);
  const [filtros, setFiltros] = useState<FiltrosControles>({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    cargarControles();
  }, [filtros]);

  const cargarControles = async () => {
    try {
      setLoading(true);
      setError(null);
      const respuesta = await obtenerControles(filtros);
      setControles(respuesta.controles);
      setTotal(respuesta.total);
      setTotalPages(respuesta.totalPages);
    } catch (err) {
      console.error('Error al cargar controles:', err);
      setError('Error al cargar los controles. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearControl = async (control: NuevoControlEsterilizacion) => {
    try {
      setError(null);
      await registrarControl(control);
      setMostrarFormulario(false);
      await cargarControles();
    } catch (err: any) {
      console.error('Error al crear control:', err);
      setError(err.message || 'Error al registrar el control');
    }
  };

  const handleVerDetalle = async (control: ControlEsterilizacion) => {
    try {
      // Cargar detalles completos del control
      const controlCompleto = await obtenerControlPorId(control._id!);
      setControlSeleccionado(controlCompleto);
      setMostrarModalDetalle(true);
    } catch (err) {
      console.error('Error al cargar detalle del control:', err);
      setError('Error al cargar los detalles del control');
    }
  };

  const handleEditarControl = (control: ControlEsterilizacion) => {
    setControlEditando(control);
    setMostrarFormularioActualizacion(true);
  };

  const handleActualizarControl = async (datos: ActualizarControlEsterilizacion) => {
    if (!controlEditando?._id) return;

    try {
      setError(null);
      await actualizarControl(controlEditando._id, datos);
      
      // Si el resultado es positivo, mostrar alerta
      if (datos.resultado === 'positivo') {
        alert('⚠️ ALERTA: El control ha resultado POSITIVO. Se debe activar el protocolo de seguridad inmediatamente.');
      }
      
      setMostrarFormularioActualizacion(false);
      setControlEditando(null);
      await cargarControles();
    } catch (err: any) {
      console.error('Error al actualizar control:', err);
      setError(err.message || 'Error al actualizar el control');
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
  };

  const handleCancelarActualizacion = () => {
    setMostrarFormularioActualizacion(false);
    setControlEditando(null);
  };

  // Si estamos en modo formulario de registro
  if (mostrarFormulario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <FormularioRegistroControl
            onGuardar={handleCrearControl}
            onCancelar={handleCancelarFormulario}
            usuarioId={user?._id}
          />
        </div>
      </div>
    );
  }

  // Si estamos en modo formulario de actualización
  if (mostrarFormularioActualizacion && controlEditando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <FormularioActualizarResultado
              control={controlEditando}
              onGuardar={handleActualizarControl}
              onCancelar={handleCancelarActualizacion}
            />
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
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <TestTube size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Control Biológico y Químico
                  </h1>
                  <p className="text-gray-600">
                    Registro y gestión de controles de validación de ciclos de esterilización
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarControles}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
              >
                <Plus size={20} />
                <span>Registrar Nuevo Control</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* Filtros */}
          <FiltrosBusquedaControles
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />

          {/* Tabla de Controles */}
          <TablaHistorialControles
            controles={controles}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onEditar={handleEditarControl}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) - 1 })}
                  disabled={(filtros.page || 1) === 1}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-slate-700">
                  Página {filtros.page || 1} de {totalPages}
                </span>
                <button
                  onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) + 1 })}
                  disabled={(filtros.page || 1) >= totalPages}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      {mostrarModalDetalle && (
        <ModalDetalleControl
          control={controlSeleccionado}
          onCerrar={() => {
            setMostrarModalDetalle(false);
            setControlSeleccionado(null);
          }}
          onEditar={handleEditarControl}
        />
      )}
    </div>
  );
}



