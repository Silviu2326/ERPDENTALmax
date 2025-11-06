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
      <div className="p-6">
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
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              Partes de Avería y Correctivos
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gestión integral de incidencias en el equipamiento de la clínica
            </p>
          </div>
          <button
            onClick={handleNuevoParte}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nuevo Parte
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <FiltrosBusquedaPartes
        filtros={filtros}
        onFiltrosChange={handleFiltrosChange}
        clinicas={clinicas}
        equipos={equipos}
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {partes.length} de {paginacion.total} partes
        </div>
        <button
          onClick={cargarPartes}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      <TablaPartesAveria
        partes={partes}
        loading={loading}
        onVerDetalle={handleVerDetalleParte}
        onEditar={handleEditarParte}
        onEliminar={handleEliminarParte}
      />

      {/* Paginación */}
      {paginacion.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => handleCambiarPagina(paginacion.page - 1)}
            disabled={paginacion.page === 1}
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Página {paginacion.page} de {paginacion.totalPages}
          </span>
          <button
            onClick={() => handleCambiarPagina(paginacion.page + 1)}
            disabled={paginacion.page >= paginacion.totalPages}
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}


