import { useState } from 'react';
import { Search, Filter, Grid, List, Star, Eye, Pencil, Trash2 } from 'lucide-react';
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron servicios</p>
        <p className="text-gray-400 text-sm mt-2">
          {filtros.search ? 'Intenta con otros términos de búsqueda' : 'Comienza añadiendo un nuevo servicio'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={busqueda}
              onChange={(e) => handleBusquedaChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros rápidos */}
          <div className="flex gap-2">
            <select
              value={filtros.publicado !== undefined ? filtros.publicado.toString() : ''}
              onChange={(e) =>
                handleFiltroChange(
                  'publicado',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="true">Publicados</option>
              <option value="false">Borradores</option>
            </select>

            <select
              value={filtros.destacado !== undefined ? filtros.destacado.toString() : ''}
              onChange={(e) =>
                handleFiltroChange(
                  'destacado',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="true">Solo destacados</option>
            </select>

            {/* Selector de vista */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setVista('grid')}
                className={`p-2 ${vista === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="Vista de cuadrícula"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setVista('list')}
                className={`p-2 ${vista === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="Vista de lista"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de servicios */}
      {vista === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="space-y-3">
          {servicios.map((servicio) => (
            <div
              key={servicio._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{servicio.nombre}</h3>
                    {servicio.destacado && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Destacado
                      </span>
                    )}
                    {servicio.publicado ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Publicado</span>
                    ) : (
                      <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">Borrador</span>
                    )}
                  </div>
                  {servicio.descripcionCorta && (
                    <p className="text-sm text-gray-600 mb-2">{servicio.descripcionCorta}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-blue-600">
                      {servicio.precioPromocional || servicio.precio} €
                    </span>
                    <span className="text-sm text-gray-500">
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

