import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  obtenerEquipos,
  crearEquipo,
  actualizarEquipo,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <FormularioEquipo
            equipo={equipoEditando}
            onGuardar={handleGuardarEquipo}
            onCancelar={handleCancelarFormulario}
            sedes={sedes}
            proveedores={proveedores}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      {puedeEditar && (
        <div className="flex items-center justify-end">
          <button
            onClick={handleNuevoEquipo}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-sm"
          >
            <Plus size={20} />
            Añadir Nuevo Equipo
          </button>
        </div>
      )}

      {/* Filtros */}
      <FiltrosBusquedaEquipos
        filtros={filtros}
        onFiltrosChange={setFiltros}
        sedes={sedes}
      />

      {/* Controles de vista y resumen */}
      {paginacion && (
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-600">
              Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
              {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
              {paginacion.total} equipos
            </div>
          </div>
        </div>
      )}

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

      {/* Botón volver (si se proporciona) */}
      {onVolver && (
        <div className="flex items-center justify-start">
          <button
            onClick={onVolver}
            className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}



