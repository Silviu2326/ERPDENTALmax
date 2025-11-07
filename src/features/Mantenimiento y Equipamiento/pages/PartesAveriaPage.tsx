import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import {
  ParteAveria,
  FiltrosPartesAveria,
  obtenerPartesAveria,
  crearParteAveria,
  actualizarParteAveria,
  eliminarParteAveria,
  NuevoParteAveria,
  ActualizarParteAveria,
} from '../api/partesAveriaApi';
import { useAuth } from '../../../contexts/AuthContext';
import TablaPartesAveria from '../components/TablaPartesAveria';
import FiltrosBusquedaPartes from '../components/FiltrosBusquedaPartes';
import FormularioCrearEditarParte from '../components/FormularioCrearEditarParte';

interface PartesAveriaPageProps {
  onVerDetalle?: (parte: ParteAveria) => void;
}

export default function PartesAveriaPage({ onVerDetalle }: PartesAveriaPageProps = {}) {
  const { user } = useAuth();
  const [partes, setPartes] = useState<ParteAveria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [parteEditando, setParteEditando] = useState<ParteAveria | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPartesAveria>({
    page: 1,
    limit: 10,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Datos mock para clínicas y equipos (en producción vendrían de APIs)
  const clinicas = [
    { _id: '1', nombre: 'Clínica Central' },
    { _id: '2', nombre: 'Clínica Norte' },
  ];

  const equipos = [
    { _id: '1', nombre: 'Sillón Dental 1' },
    { _id: '2', nombre: 'Autoclave Principal' },
    { _id: '3', nombre: 'Rayos X Panorámico' },
  ];

  const cargarPartes = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerPartesAveria(filtros);
      setPartes(respuesta.data || []);
      setPaginacion({
        total: respuesta.total || 0,
        page: respuesta.page || 1,
        limit: respuesta.limit || 10,
        totalPages: respuesta.totalPages || 0,
      });
    } catch (err) {
      console.error('Error al cargar partes:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los partes de avería');
      // Datos mock para desarrollo
      setPartes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPartes();
  }, [filtros]);

  const handleNuevoParte = () => {
    setParteEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarParte = (parte: ParteAveria) => {
    setParteEditando(parte);
    setMostrarFormulario(true);
  };

  const handleGuardarParte = async (
    datos: NuevoParteAveria | ActualizarParteAveria
  ) => {
    try {
      if (parteEditando) {
        // Actualizar
        await actualizarParteAveria(parteEditando._id!, datos as ActualizarParteAveria);
      } else {
        // Crear
        await crearParteAveria(datos as NuevoParteAveria);
      }
      setMostrarFormulario(false);
      setParteEditando(null);
      cargarPartes();
    } catch (err) {
      console.error('Error al guardar parte:', err);
      throw err;
    }
  };

  const handleEliminarParte = async (parte: ParteAveria) => {
    if (!confirm(`¿Está seguro de que desea eliminar este parte de avería?`)) {
      return;
    }

    try {
      if (parte._id) {
        await eliminarParteAveria(parte._id);
        cargarPartes();
      }
    } catch (err) {
      console.error('Error al eliminar parte:', err);
      alert('Error al eliminar el parte de avería');
    }
  };

  const handleVerDetalleParte = (parte: ParteAveria) => {
    if (onVerDetalle) {
      onVerDetalle(parte);
    }
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosPartesAveria) => {
    setFiltros(nuevosFiltros);
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({ ...filtros, page: nuevaPagina });
  };

  if (mostrarFormulario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <FormularioCrearEditarParte
            parte={parteEditando || undefined}
            clinicaId={clinicas[0]?._id}
            clinicas={clinicas}
            reportadoPor={user?._id || user?.name || ''}
            onGuardar={handleGuardarParte}
            onCancelar={() => {
              setMostrarFormulario(false);
              setParteEditando(null);
            }}
            modoEdicion={!!parteEditando}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={cargarPartes}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
          <button
            onClick={handleNuevoParte}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-sm"
          >
            <Plus size={20} />
            Nuevo Parte
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarPartes}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Filtros */}
      {!error && (
        <FiltrosBusquedaPartes
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          clinicas={clinicas}
          equipos={equipos}
        />
      )}

      {/* Controles de vista y resumen */}
      {!error && (
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-600">
              Mostrando {partes.length} de {paginacion.total} partes
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      {!error && (
        <TablaPartesAveria
          partes={partes}
          loading={loading}
          onVerDetalle={handleVerDetalleParte}
          onEditar={handleEditarParte}
          onEliminar={handleEliminarParte}
        />
      )}

      {/* Paginación */}
      {!error && paginacion.totalPages > 1 && (
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handleCambiarPagina(paginacion.page - 1)}
              disabled={paginacion.page === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-700 px-3">
              Página {paginacion.page} de {paginacion.totalPages}
            </span>
            <button
              onClick={() => handleCambiarPagina(paginacion.page + 1)}
              disabled={paginacion.page >= paginacion.totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



