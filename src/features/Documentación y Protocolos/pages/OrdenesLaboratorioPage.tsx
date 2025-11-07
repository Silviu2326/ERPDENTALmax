import { useState, useEffect } from 'react';
import { Plus, RefreshCw, ClipboardList, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <ClipboardList size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Órdenes a Laboratorio
                </h1>
                <p className="text-gray-600">
                  Gestión y seguimiento de órdenes de trabajo protésico
                </p>
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
                onClick={cargarOrdenes}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
              {onNuevaOrden && (
                <button
                  onClick={onNuevaOrden}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Plus size={20} />
                  Nueva Orden
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Filtros */}
          <FiltrosBusquedaOrdenes filtros={filtros} onFiltrosChange={setFiltros} />

          {/* Lista de Órdenes */}
          <ListaOrdenesLaboratorio
            ordenes={ordenes}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onEditar={onEditar ? handleEditar : undefined}
            onEliminar={handleEliminar}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Mostrando página {filtros.page || 1} de {totalPages} ({total} órdenes totales)
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCambioPagina((filtros.page || 1) - 1)}
                    disabled={!filtros.page || filtros.page <= 1}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-700">
                    {filtros.page || 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => handleCambioPagina((filtros.page || 1) + 1)}
                    disabled={!filtros.page || filtros.page >= totalPages}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



