import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, RefreshCw, AlertCircle, FileText, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando detalles de la orden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onVolver}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Botón volver */}
                <button
                  onClick={onVolver}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                  <ArrowLeft size={20} />
                </button>
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Detalle de Orden de Fabricación
                  </h1>
                  <p className="text-gray-600">
                    Información completa y seguimiento del estado
                  </p>
                </div>
              </div>
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                {puedeActualizarEstado && (
                  <button
                    onClick={() => setMostrarModalActualizar(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Edit size={20} />
                    <span>Actualizar Estado</span>
                  </button>
                )}
                {onEditar && (
                  <button
                    onClick={() => onEditar(ordenId)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <Edit size={20} />
                    <span>Editar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
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
  );
}



