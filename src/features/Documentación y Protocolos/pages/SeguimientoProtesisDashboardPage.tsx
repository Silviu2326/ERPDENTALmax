import { useState, useEffect } from 'react';
import { Plus, RefreshCw, FileText } from 'lucide-react';
import {
  obtenerProtesis,
  Protesis,
  FiltrosProtesis,
  PaginacionProtesis,
} from '../api/protesisApi';
import TablaSeguimientoProtesis from '../components/TablaSeguimientoProtesis';
import FiltrosProtesisPanel from '../components/FiltrosProtesisPanel';

interface SeguimientoProtesisDashboardPageProps {
  onNuevaOrden: () => void;
  onVerDetalle: (protesisId: string) => void;
  onEditar?: (protesisId: string) => void;
}

export default function SeguimientoProtesisDashboardPage({
  onNuevaOrden,
  onVerDetalle,
  onEditar,
}: SeguimientoProtesisDashboardPageProps) {
  const [protesis, setProtesis] = useState<Protesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosProtesis>({});
  const [paginacion, setPaginacion] = useState<PaginacionProtesis>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const cargarProtesis = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerProtesis(filtros, paginacion.page, paginacion.limit);
      setProtesis(respuesta.protesis);
      setPaginacion(respuesta.paginacion);
    } catch (err) {
      console.error('Error al cargar prótesis:', err);
      setError('Error al cargar las órdenes de prótesis. Por favor, inténtalo de nuevo.');
      // Datos mock para desarrollo
      setProtesis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProtesis();
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
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Seguimiento de Prótesis</h1>
                <p className="text-gray-600 mt-1">
                  Gestión y monitorización del ciclo de vida completo de las prótesis dentales
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarProtesis}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Actualizar</span>
              </button>
              <button
                onClick={onNuevaOrden}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Orden</span>
              </button>
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
          <FiltrosProtesisPanel
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onLimpiarFiltros={handleLimpiarFiltros}
          />
        </div>

        {/* Tabla de Prótesis */}
        <div className="mb-6">
          <TablaSeguimientoProtesis
            protesis={protesis}
            onVerDetalle={onVerDetalle}
            onEditar={onEditar}
            loading={loading}
          />
        </div>

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(paginacion.page - 1)}
              disabled={paginacion.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {paginacion.page} de {paginacion.totalPages} ({paginacion.total} total)
            </span>
            <button
              onClick={() => handlePageChange(paginacion.page + 1)}
              disabled={paginacion.page >= paginacion.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


