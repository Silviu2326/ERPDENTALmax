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
      <div className="p-6 bg-gray-50 min-h-screen">
        <FormularioRegistroControl
          onGuardar={handleCrearControl}
          onCancelar={handleCancelarFormulario}
          usuarioId={user?._id}
        />
      </div>
    );
  }

  // Si estamos en modo formulario de actualización
  if (mostrarFormularioActualizacion && controlEditando) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <FormularioActualizarResultado
            control={controlEditando}
            onGuardar={handleActualizarControl}
            onCancelar={handleCancelarActualizacion}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <TestTube className="w-7 h-7 text-blue-600" />
                <span>Control Biológico y Químico</span>
              </h2>
              <p className="text-gray-600 mt-1">
                Registro y gestión de controles de validación de ciclos de esterilización
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarControles}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Registrar Nuevo Control</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
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
        <div className="mb-6">
          <FiltrosBusquedaControles
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />
        </div>

        {/* Tabla de Controles */}
        <div className="mb-6">
          <TablaHistorialControles
            controles={controles}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onEditar={handleEditarControl}
          />
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((filtros.page || 1) - 1) * (filtros.limit || 20) + 1} a{' '}
              {Math.min((filtros.page || 1) * (filtros.limit || 20), total)} de {total} controles
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) - 1 })}
                disabled={(filtros.page || 1) === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Página {filtros.page || 1} de {totalPages}
              </span>
              <button
                onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) + 1 })}
                disabled={(filtros.page || 1) >= totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

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
    </div>
  );
}


