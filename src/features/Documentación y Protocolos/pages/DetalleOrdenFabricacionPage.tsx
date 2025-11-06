import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, RefreshCw, AlertCircle } from 'lucide-react';
import {
  obtenerOrdenFabricacionPorId,
  actualizarEstadoFabricacion,
  OrdenFabricacion,
} from '../api/fabricacionApi';
import { useAuth } from '../../../contexts/AuthContext';
import FichaDetalleFabricacion from '../components/FichaDetalleFabricacion';
import TimelineEstadoFabricacion from '../components/TimelineEstadoFabricacion';
import ModalActualizarEstado from '../components/ModalActualizarEstado';

interface DetalleOrdenFabricacionPageProps {
  ordenId: string;
  onVolver: () => void;
  onEditar?: (ordenId: string) => void;
}

export default function DetalleOrdenFabricacionPage({
  ordenId,
  onVolver,
  onEditar,
}: DetalleOrdenFabricacionPageProps) {
  const { user } = useAuth();
  const [orden, setOrden] = useState<OrdenFabricacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalActualizar, setMostrarModalActualizar] = useState(false);
  const [actualizando, setActualizando] = useState(false);

  const cargarOrden = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordenData = await obtenerOrdenFabricacionPorId(ordenId);
      setOrden(ordenData);
    } catch (err) {
      console.error('Error al cargar la orden de fabricación:', err);
      setError('Error al cargar los detalles de la orden. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ordenId) {
      cargarOrden();
    }
  }, [ordenId]);

  const handleActualizarEstado = async (
    nuevoEstado: string,
    notas?: string
  ) => {
    if (!user?._id || !orden?._id) return;

    setActualizando(true);
    try {
      await actualizarEstadoFabricacion(orden._id, {
        nuevoEstado: nuevoEstado as any,
        notas,
        usuarioId: user._id,
      });
      
      // Recargar la orden para obtener los datos actualizados
      await cargarOrden();
      setMostrarModalActualizar(false);
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      setError('Error al actualizar el estado. Por favor, inténtalo de nuevo.');
    } finally {
      setActualizando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando detalles de la orden...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 font-semibold">{error}</p>
            <button
              onClick={onVolver}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orden) {
    return null;
  }

  const puedeActualizarEstado = user?.role === 'protesico' || user?.role === 'laboratorio' || user?.role === 'admin' || user?.role === 'director';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onVolver}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden de Fabricación</h1>
                <p className="text-gray-600 mt-1">Información completa y seguimiento del estado</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {puedeActualizarEstado && (
                <button
                  onClick={() => setMostrarModalActualizar(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Actualizar Estado</span>
                </button>
              )}
              {onEditar && (
                <button
                  onClick={() => onEditar(ordenId)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ficha de Detalle */}
          <div className="lg:col-span-2">
            <FichaDetalleFabricacion orden={orden} />
          </div>

          {/* Timeline de Estados */}
          <div className="lg:col-span-1">
            <TimelineEstadoFabricacion
              historial={orden.historialEstados || []}
              estadoActual={orden.estadoActual}
            />
          </div>
        </div>

        {/* Modal de Actualizar Estado */}
        {mostrarModalActualizar && (
          <ModalActualizarEstado
            isOpen={mostrarModalActualizar}
            onClose={() => setMostrarModalActualizar(false)}
            estadoActual={orden.estadoActual}
            onActualizar={handleActualizarEstado}
            loading={actualizando}
          />
        )}
      </div>
    </div>
  );
}


