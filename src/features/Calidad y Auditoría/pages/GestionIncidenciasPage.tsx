import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerIncidencias,
  eliminarIncidencia,
  crearIncidencia,
  actualizarIncidencia,
  FiltrosIncidencias as FiltrosIncidenciasType,
  Incidencia,
  NuevaIncidencia,
  ActualizarIncidencia,
} from '../api/incidenciasApi';
import IncidenciasDataTable from '../components/IncidenciasDataTable';
import IncidenciaForm from '../components/IncidenciaForm';
import FiltrosIncidencias from '../components/FiltrosIncidencias';
import DashboardIncidencias from '../components/DashboardIncidencias';
import { obtenerEstadisticasIncidencias } from '../api/incidenciasApi';
import DetalleIncidenciaPage from './DetalleIncidenciaPage';

interface GestionIncidenciasPageProps {
  onVerDetalle?: (incidencia: Incidencia) => void;
  onVolver?: () => void;
}

export default function GestionIncidenciasPage({
  onVerDetalle,
  onVolver,
}: GestionIncidenciasPageProps) {
  const { user } = useAuth();
  const [vista, setVista] = useState<'lista' | 'nueva' | 'editar' | 'detalle'>('lista');
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [incidenciaEditando, setIncidenciaEditando] = useState<Incidencia | null>(null);
  const [incidenciaDetalle, setIncidenciaDetalle] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosIncidenciasType>({
    page: 1,
    limit: 10,
  });
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (vista === 'lista') {
      cargarIncidencias();
      cargarEstadisticas();
    }
  }, [vista, filtros]);

  const cargarIncidencias = async () => {
    try {
      setLoading(true);
      const respuesta = await obtenerIncidencias(filtros);
      setIncidencias(respuesta.data);
      setPaginacion(respuesta.pagination);
    } catch (error) {
      console.error('Error al cargar incidencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await obtenerEstadisticasIncidencias({
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
      });
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleGuardar = async (datos: NuevaIncidencia | ActualizarIncidencia) => {
    try {
      if (incidenciaEditando) {
        await actualizarIncidencia(incidenciaEditando._id!, datos as ActualizarIncidencia);
      } else {
        await crearIncidencia(datos as NuevaIncidencia);
      }
      setVista('lista');
      setIncidenciaEditando(null);
      cargarIncidencias();
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await eliminarIncidencia(id);
      cargarIncidencias();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la incidencia');
    }
  };

  const handleVerDetalle = (incidencia: Incidencia) => {
    if (onVerDetalle) {
      onVerDetalle(incidencia);
    } else {
      // Mostrar detalle en una nueva vista
      if (incidencia._id) {
        setIncidenciaDetalle(incidencia._id);
        setVista('detalle');
      }
    }
  };

  if (vista === 'detalle' && incidenciaDetalle) {
    return (
      <DetalleIncidenciaPage
        incidenciaId={incidenciaDetalle}
        onVolver={() => {
          setVista('lista');
          setIncidenciaDetalle(null);
        }}
      />
    );
  }

  if (vista === 'nueva' || vista === 'editar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setVista('lista');
                    setIncidenciaEditando(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 mb-0 mr-6 flex items-center gap-2 text-sm font-medium"
                >
                  ← Volver
                </button>
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <AlertCircle size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {vista === 'nueva' ? 'Nueva Incidencia' : 'Editar Incidencia'}
                  </h1>
                  <p className="text-gray-600">
                    {vista === 'nueva' ? 'Registra una nueva incidencia o no conformidad' : 'Modifica los datos de la incidencia'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-6">
            <IncidenciaForm
              incidencia={incidenciaEditando || undefined}
              onGuardar={handleGuardar}
              onCancelar={() => {
                setVista('lista');
                setIncidenciaEditando(null);
              }}
              clinicaId={user?.clinicaId}
              usuarioId={user?._id}
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
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <AlertCircle size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    No Conformidades e Incidencias
                  </h1>
                  <p className="text-gray-600">
                    Gestión sistemática de desviaciones de estándares de calidad y protocolos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarIncidencias}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 shadow-sm ring-1 ring-slate-200"
              >
                <RefreshCw size={20} className="mr-2" />
                Actualizar
              </button>
              <button
                onClick={() => {
                  setIncidenciaEditando(null);
                  setVista('nueva');
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus size={20} className="mr-2" />
                Nueva Incidencia
              </button>
            </div>
          </div>

          {/* Dashboard de Estadísticas */}
          {estadisticas && (
            <DashboardIncidencias estadisticas={estadisticas} />
          )}

          {/* Filtros */}
          <FiltrosIncidencias
            filtros={filtros}
            onFiltrosChange={setFiltros}
            clinicas={[]} // TODO: Obtener clínicas del contexto o API
          />

          {/* Tabla de Incidencias */}
          <IncidenciasDataTable
            incidencias={incidencias}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onEditar={(incidencia) => {
              setIncidenciaEditando(incidencia);
              setVista('editar');
            }}
            onEliminar={handleEliminar}
          />

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setFiltros({ ...filtros, page: paginacion.page - 1 })}
                  disabled={paginacion.page === 1}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 shadow-sm ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Página {paginacion.page} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => setFiltros({ ...filtros, page: paginacion.page + 1 })}
                  disabled={paginacion.page >= paginacion.totalPages}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 shadow-sm ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} - {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de {paginacion.total} incidencias
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

