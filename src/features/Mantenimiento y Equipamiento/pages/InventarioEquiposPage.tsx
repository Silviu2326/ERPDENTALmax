import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';
import {
  obtenerEquipos,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
  EquipoClinico,
  FiltrosEquipos,
  NuevoEquipo,
  PaginatedResponse,
} from '../api/equiposApi';
import TablaInventarioEquipos from '../components/TablaInventarioEquipos';
import FormularioEquipo from '../components/FormularioEquipo';
import FiltrosBusquedaEquipos from '../components/FiltrosBusquedaEquipos';
import { useAuth } from '../../../contexts/AuthContext';

interface InventarioEquiposPageProps {
  onVolver?: () => void;
}

export default function InventarioEquiposPage({ onVolver }: InventarioEquiposPageProps) {
  const { user } = useAuth();
  const [equipos, setEquipos] = useState<EquipoClinico[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState<EquipoClinico | null>(null);
  const [filtros, setFiltros] = useState<FiltrosEquipos>({
    page: 1,
    limit: 10,
  });
  const [paginacion, setPaginacion] = useState<PaginatedResponse<EquipoClinico> | null>(null);
  const [sedes] = useState<Array<{ _id: string; nombre: string }>>([
    // TODO: Obtener sedes desde API
    { _id: '1', nombre: 'Sede Central' },
  ]);
  const [proveedores] = useState<Array<{ _id: string; nombre: string }>>([
    // TODO: Obtener proveedores desde API
  ]);

  const puedeEditar =
    user?.role === 'compras_inventario' || user?.role === 'admin' || user?.role === 'director';

  useEffect(() => {
    cargarEquipos();
  }, [filtros]);

  const cargarEquipos = async () => {
    setLoading(true);
    try {
      const response = await obtenerEquipos(filtros);
      setEquipos(response.equipos);
      setPaginacion(response);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      // Mostrar mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoEquipo = () => {
    setEquipoEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarEquipo = (equipo: EquipoClinico) => {
    setEquipoEditando(equipo);
    setMostrarFormulario(true);
  };

  const handleGuardarEquipo = async (equipoData: NuevoEquipo) => {
    try {
      if (equipoEditando) {
        await actualizarEquipo(equipoEditando._id!, equipoData);
      } else {
        await crearEquipo(equipoData);
      }
      setMostrarFormulario(false);
      setEquipoEditando(null);
      cargarEquipos();
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      throw error; // Re-lanzar para que el formulario maneje el error
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setEquipoEditando(null);
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({
      ...filtros,
      page: nuevaPagina,
    });
  };

  if (mostrarFormulario) {
    return (
      <div className="p-6">
        <FormularioEquipo
          equipo={equipoEditando}
          onGuardar={handleGuardarEquipo}
          onCancelar={handleCancelarFormulario}
          sedes={sedes}
          proveedores={proveedores}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario de Equipos Clínicos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el inventario de equipos y dispositivos médicos de la clínica
          </p>
        </div>
        {puedeEditar && (
          <button
            onClick={handleNuevoEquipo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Añadir Nuevo Equipo
          </button>
        )}
      </div>

      {/* Filtros */}
      <FiltrosBusquedaEquipos
        filtros={filtros}
        onFiltrosChange={setFiltros}
        sedes={sedes}
      />

      {/* Tabla */}
      <TablaInventarioEquipos
        equipos={equipos}
        loading={loading}
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onEquipoEliminado={cargarEquipos}
        onEditarEquipo={puedeEditar ? handleEditarEquipo : undefined}
      />

      {/* Paginación */}
      {paginacion && paginacion.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
            {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
            {paginacion.total} equipos
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCambiarPagina(paginacion.page - 1)}
              disabled={paginacion.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {paginacion.page} de {paginacion.totalPages}
            </span>
            <button
              onClick={() => handleCambiarPagina(paginacion.page + 1)}
              disabled={paginacion.page >= paginacion.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Botón volver (si se proporciona) */}
      {onVolver && (
        <div className="mt-6">
          <button
            onClick={onVolver}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}


