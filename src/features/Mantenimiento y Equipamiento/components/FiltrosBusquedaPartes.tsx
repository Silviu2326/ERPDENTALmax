import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FiltrosPartesAveria, EstadoParteAveria, PrioridadParteAveria } from '../api/partesAveriaApi';

interface FiltrosBusquedaPartesProps {
  filtros: FiltrosPartesAveria;
  onFiltrosChange: (filtros: FiltrosPartesAveria) => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
  equipos?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosBusquedaPartes({
  filtros,
  onFiltrosChange,
  clinicas = [],
  equipos = [],
}: FiltrosBusquedaPartesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busquedaTexto, setBusquedaTexto] = useState(filtros.search || '');

  const estados: EstadoParteAveria[] = ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado'];
  const prioridades: PrioridadParteAveria[] = ['Baja', 'Media', 'Alta', 'Crítica'];

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltrosChange({ ...filtros, search: busquedaTexto || undefined, page: 1 });
  };

  const handleLimpiarFiltros = () => {
    const nuevosFiltros: FiltrosPartesAveria = {
      page: 1,
      limit: filtros.limit || 10,
    };
    setBusquedaTexto('');
    onFiltrosChange(nuevosFiltros);
  };

  const tieneFiltrosActivos = 
    filtros.clinicaId || 
    filtros.estado || 
    filtros.prioridad || 
    filtros.equipoId || 
    filtros.fechaInicio || 
    filtros.fechaFin || 
    filtros.search;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* Barra de búsqueda principal */}
      <form onSubmit={handleBuscar} className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={busquedaTexto}
            onChange={(e) => setBusquedaTexto(e.target.value)}
            placeholder="Buscar por descripción del problema o notas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            mostrarFiltros
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        {tieneFiltrosActivos && (
          <button
            type="button"
            onClick={handleLimpiarFiltros}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </form>

      {/* Panel de filtros avanzados */}
      {mostrarFiltros && (
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por clínica */}
            {clinicas.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clínica
                </label>
                <select
                  value={filtros.clinicaId || ''}
                  onChange={(e) =>
                    onFiltrosChange({
                      ...filtros,
                      clinicaId: e.target.value || undefined,
                      page: 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las clínicas</option>
                  {clinicas.map((clinica) => (
                    <option key={clinica._id} value={clinica._id}>
                      {clinica.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) =>
                  onFiltrosChange({
                    ...filtros,
                    estado: (e.target.value as EstadoParteAveria) || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={filtros.prioridad || ''}
                onChange={(e) =>
                  onFiltrosChange({
                    ...filtros,
                    prioridad: (e.target.value as PrioridadParteAveria) || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las prioridades</option>
                {prioridades.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por equipo */}
            {equipos.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipo
                </label>
                <select
                  value={filtros.equipoId || ''}
                  onChange={(e) =>
                    onFiltrosChange({
                      ...filtros,
                      equipoId: e.target.value || undefined,
                      page: 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los equipos</option>
                  {equipos.map((equipo) => (
                    <option key={equipo._id} value={equipo._id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) =>
                  onFiltrosChange({
                    ...filtros,
                    fechaInicio: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por fecha fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) =>
                  onFiltrosChange({
                    ...filtros,
                    fechaFin: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


