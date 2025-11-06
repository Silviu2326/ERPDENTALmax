import { useState, useEffect } from 'react';
import { Plus, RefreshCw, FileCode } from 'lucide-react';
import {
  obtenerOrdenesFabricacion,
  FiltrosFabricacion,
  PaginacionFabricacion,
  OrdenFabricacion,
} from '../api/fabricacionApi';
import TablaOrdenesFabricacion from '../components/TablaOrdenesFabricacion';
import FiltrosBusquedaFabricacion from '../components/FiltrosBusquedaFabricacion';

interface EstadosFabricacionPageProps {
  onNuevaOrden?: () => void;
  onVerDetalle: (ordenId: string) => void;
  onEditar?: (ordenId: string) => void;
}

export default function EstadosFabricacionPage({
  onNuevaOrden,
  onVerDetalle,
  onEditar,
}: EstadosFabricacionPageProps) {
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosFabricacion>({});
  const [paginacion, setPaginacion] = useState<PaginacionFabricacion>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const cargarOrdenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerOrdenesFabricacion(filtros, paginacion.page, paginacion.limit);
      setOrdenes(respuesta.ordenes);
      setPaginacion(respuesta.paginacion);
    } catch (err) {
      console.error('Error al cargar órdenes de fabricación:', err);
      setError('Error al cargar las órdenes de fabricación. Por favor, inténtalo de nuevo.');
      // En desarrollo, puedes usar datos mock aquí si es necesario
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, [filtros, paginacion.page]);

  const handleLimpiarFiltros = () => {
    setFiltros({});
    setPaginacion((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (nuevaPage: number) => {
    setPaginacion((prev) => ({ ...prev, page: nuevaPage }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileCode className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Estados de Fabricación</h1>
                <p className="text-gray-600 mt-1">
                  Gestión y seguimiento en tiempo real del ciclo de vida de trabajos protésicos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarOrdenes}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Actualizar</span>
              </button>
              {onNuevaOrden && (
                <button
                  onClick={onNuevaOrden}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nueva Orden</span>
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

        {/* Filtros */}
        <div className="mb-6">
          <FiltrosBusquedaFabricacion
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onLimpiarFiltros={handleLimpiarFiltros}
          />
        </div>

        {/* Tabla de Órdenes */}
        <div className="mb-6">
          <TablaOrdenesFabricacion
            ordenes={ordenes}
            loading={loading}
            onVerDetalle={onVerDetalle}
          />
        </div>

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando {ordenes.length} de {paginacion.total} órdenes
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(paginacion.page - 1)}
                disabled={paginacion.page === 1}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {paginacion.page} de {paginacion.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(paginacion.page + 1)}
                disabled={paginacion.page === paginacion.totalPages}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


