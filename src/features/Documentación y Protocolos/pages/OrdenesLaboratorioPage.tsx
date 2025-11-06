import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { obtenerOrdenes, FiltrosOrdenes, OrdenLaboratorio, eliminarOrden } from '../api/ordenesLaboratorioApi';
import ListaOrdenesLaboratorio from '../components/ListaOrdenesLaboratorio';
import FiltrosBusquedaOrdenes from '../components/FiltrosBusquedaOrdenes';

interface OrdenesLaboratorioPageProps {
  onNuevaOrden?: () => void;
  onVerDetalle?: (ordenId: string) => void;
  onEditar?: (ordenId: string) => void;
}

export default function OrdenesLaboratorioPage({
  onNuevaOrden,
  onVerDetalle,
  onEditar,
}: OrdenesLaboratorioPageProps) {
  const [ordenes, setOrdenes] = useState<OrdenLaboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosOrdenes>({
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    cargarOrdenes();
  }, [filtros]);

  const cargarOrdenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await obtenerOrdenes(filtros);
      setOrdenes(resultado.ordenes);
      setTotal(resultado.total);
      setTotalPages(resultado.totalPages);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('Error al cargar las órdenes de laboratorio');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (orden: OrdenLaboratorio) => {
    if (onVerDetalle && orden._id) {
      onVerDetalle(orden._id);
    }
  };

  const handleEditar = (orden: OrdenLaboratorio) => {
    if (onEditar && orden._id) {
      onEditar(orden._id);
    }
  };

  const handleEliminar = async (orden: OrdenLaboratorio) => {
    if (!orden._id) return;

    if (!confirm(`¿Está seguro de que desea eliminar la orden #${orden._id.slice(-6)}?`)) {
      return;
    }

    try {
      await eliminarOrden(orden._id);
      await cargarOrdenes();
    } catch (err) {
      console.error('Error al eliminar orden:', err);
      alert('Error al eliminar la orden');
    }
  };

  const handleCambioPagina = (nuevaPagina: number) => {
    setFiltros({ ...filtros, page: nuevaPagina });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Órdenes a Laboratorio
              </h1>
              <p className="text-gray-600">
                Gestión y seguimiento de órdenes de trabajo protésico
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarOrdenes}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
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

        {/* Filtros */}
        <div className="mb-6">
          <FiltrosBusquedaOrdenes filtros={filtros} onFiltrosChange={setFiltros} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Lista de Órdenes */}
        <div className="mb-6">
          <ListaOrdenesLaboratorio
            ordenes={ordenes}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onEditar={onEditar ? handleEditar : undefined}
            onEliminar={handleEliminar}
          />
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando página {filtros.page || 1} de {totalPages} ({total} órdenes totales)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCambioPagina((filtros.page || 1) - 1)}
                disabled={!filtros.page || filtros.page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-700">
                {filtros.page || 1} / {totalPages}
              </span>
              <button
                onClick={() => handleCambioPagina((filtros.page || 1) + 1)}
                disabled={!filtros.page || filtros.page >= totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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


