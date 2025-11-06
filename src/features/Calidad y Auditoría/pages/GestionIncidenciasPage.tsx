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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => {
                setVista('lista');
                setIncidenciaEditando(null);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {vista === 'nueva' ? 'Nueva Incidencia' : 'Editar Incidencia'}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-600 to-orange-600 p-3 rounded-xl shadow-lg">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                No Conformidades e Incidencias
              </h1>
              <p className="text-gray-600 text-lg">
                Gestión sistemática de desviaciones de estándares de calidad y protocolos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={cargarIncidencias}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5" />
                Actualizar
              </button>
              <button
                onClick={() => {
                  setIncidenciaEditando(null);
                  setVista('nueva');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nueva Incidencia
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard de Estadísticas */}
        {estadisticas && (
          <div className="mb-8">
            <DashboardIncidencias estadisticas={estadisticas} />
          </div>
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
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} - {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de {paginacion.total} incidencias
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltros({ ...filtros, page: paginacion.page - 1 })}
                disabled={paginacion.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Página {paginacion.page} de {paginacion.totalPages}
              </span>
              <button
                onClick={() => setFiltros({ ...filtros, page: paginacion.page + 1 })}
                disabled={paginacion.page >= paginacion.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

