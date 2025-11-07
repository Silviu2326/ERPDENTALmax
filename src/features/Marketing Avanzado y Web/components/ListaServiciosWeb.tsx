import { useState } from 'react';
import { Search, Grid3X3, List, Star, Eye, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import { ServicioWeb, FiltrosServiciosWeb } from '../api/serviciosWebAPI';
import ServicioWebCard from './ServicioWebCard';

interface ListaServiciosWebProps {
  servicios: ServicioWeb[];
  filtros: FiltrosServiciosWeb;
  onFiltrosChange: (filtros: FiltrosServiciosWeb) => void;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
  onVerDetalle?: (id: string) => void;
  loading?: boolean;
}

export default function ListaServiciosWeb({
  servicios,
  filtros,
  onFiltrosChange,
  onEditar,
  onEliminar,
  onVerDetalle,
  loading = false,
}: ListaServiciosWebProps) {
  const [vista, setVista] = useState<'grid' | 'list'>('grid');
  const [busqueda, setBusqueda] = useState(filtros.search || '');

  const handleBusquedaChange = (value: string) => {
    setBusqueda(value);
    onFiltrosChange({ ...filtros, search: value || undefined, page: 1 });
  };

  const handleFiltroChange = (key: keyof FiltrosServiciosWeb, value: any) => {
    onFiltrosChange({ ...filtros, [key]: value, page: 1 });
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron servicios</h3>
        <p className="text-gray-600 mb-4">
          {filtros.search ? 'Intenta con otros términos de búsqueda' : 'Comienza añadiendo un nuevo servicio'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sistema de Filtros */}
      <div className="bg-white shadow-sm rounded-xl mb-6">
        <div className="p-4 space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar servicios..."
                  value={busqueda}
                  onChange={(e) => handleBusquedaChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.publicado !== undefined ? filtros.publicado.toString() : ''}
                  onChange={(e) =>
                    handleFiltroChange(
                      'publicado',
                      e.target.value === '' ? undefined : e.target.value === 'true'
                    )
                  }
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los estados</option>
                  <option value="true">Publicados</option>
                  <option value="false">Borradores</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Destacados
                </label>
                <select
                  value={filtros.destacado !== undefined ? filtros.destacado.toString() : ''}
                  onChange={(e) =>
                    handleFiltroChange(
                      'destacado',
                      e.target.value === '' ? undefined : e.target.value === 'true'
                    )
                  }
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="true">Solo destacados</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Vista y Ordenamiento */}
      <div className="bg-white shadow-sm rounded-xl p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Selector de vista */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Vista:</span>
            <div className="flex border rounded-lg overflow-hidden ring-1 ring-slate-200">
              <button
                onClick={() => setVista('grid')}
                className={`p-2 transition-all ${
                  vista === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title="Vista de cuadrícula"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setVista('list')}
                className={`p-2 transition-all ${
                  vista === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title="Vista de lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid/Lista de Elementos */}
      {vista === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicios.map((servicio) => (
            <ServicioWebCard
              key={servicio._id}
              servicio={servicio}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onVerDetalle={onVerDetalle}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {servicios.map((servicio) => (
            <div
              key={servicio._id}
              className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{servicio.nombre}</h3>
                    {servicio.destacado && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <Star size={12} />
                        Destacado
                      </span>
                    )}
                    {servicio.publicado ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">Publicado</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">Borrador</span>
                    )}
                  </div>
                  {servicio.descripcionCorta && (
                    <p className="text-sm text-gray-600 mb-2">{servicio.descripcionCorta}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-blue-600">
                      {servicio.precioPromocional || servicio.precio} €
                    </span>
                    <span className="text-sm text-slate-600">
                      {typeof servicio.categoria === 'object' && servicio.categoria
                        ? servicio.categoria.nombre
                        : servicio.categoria || 'Sin categoría'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {onVerDetalle && servicio._id && (
                    <button
                      onClick={() => onVerDetalle(servicio._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {servicio._id && (
                    <>
                      <button
                        onClick={() => onEditar(servicio._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEliminar(servicio._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

