import { useState, useEffect } from 'react';
import { Plus, RefreshCw, FileCode, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileCode size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Estados de Fabricación
                  </h1>
                  <p className="text-gray-600">
                    Gestión y seguimiento en tiempo real del ciclo de vida de trabajos protésicos
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={cargarOrdenes}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  <RefreshCw size={20} className="mr-2" />
                  Actualizar
                </button>
                {onNuevaOrden && (
                  <button
                    onClick={onNuevaOrden}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  >
                    <Plus size={20} className="mr-2" />
                    Nueva Orden
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {/* Filtros */}
          <FiltrosBusquedaFabricacion
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onLimpiarFiltros={handleLimpiarFiltros}
          />

          {/* Tabla de Órdenes */}
          <TablaOrdenesFabricacion
            ordenes={ordenes}
            loading={loading}
            onVerDetalle={onVerDetalle}
          />

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="p-4 bg-white shadow-sm rounded-lg">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all rounded-lg bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {paginacion.page} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page === paginacion.totalPages}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all rounded-lg bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="mt-2 text-center text-sm text-gray-600">
                Mostrando {ordenes.length} de {paginacion.total} órdenes
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



