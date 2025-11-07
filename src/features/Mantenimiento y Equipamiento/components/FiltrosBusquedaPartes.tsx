import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
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

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.clinicaId) count++;
    if (filtros.estado) count++;
    if (filtros.prioridad) count++;
    if (filtros.equipoId) count++;
    if (filtros.fechaInicio) count++;
    if (filtros.fechaFin) count++;
    return count;
  };

  const numFiltrosActivos = contarFiltrosActivos();

  return (
    <div className="mb-6 bg-white shadow-sm rounded-xl">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <form onSubmit={handleBuscar} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={busquedaTexto}
                onChange={(e) => setBusquedaTexto(e.target.value)}
                placeholder="Buscar por descripción del problema o notas..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            <button
              type="button"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm"
            >
              <Filter size={18} />
              Filtros
              {numFiltrosActivos > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {numFiltrosActivos}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>
            {tieneFiltrosActivos && (
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl bg-white text-red-700 hover:bg-red-50 border border-red-300 shadow-sm"
              >
                <X size={18} />
                Limpiar
              </button>
            )}
          </form>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por clínica */}
              {clinicas.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por fecha fin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{numFiltrosActivos} filtros aplicados</span>
          </div>
        )}
      </div>
    </div>
  );
}



