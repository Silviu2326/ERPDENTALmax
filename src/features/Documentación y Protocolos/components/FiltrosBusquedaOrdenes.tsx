import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { EstadoOrden, FiltrosOrdenes } from '../api/ordenesLaboratorioApi';

interface FiltrosBusquedaOrdenesProps {
  filtros: FiltrosOrdenes;
  onFiltrosChange: (filtros: FiltrosOrdenes) => void;
}

const ESTADOS: EstadoOrden[] = [
  'Borrador',
  'Enviada',
  'Recibida',
  'En Proceso',
  'Control Calidad',
  'Enviada a Clínica',
  'Recibida en Clínica',
  'Completada',
];

export default function FiltrosBusquedaOrdenes({
  filtros,
  onFiltrosChange,
}: FiltrosBusquedaOrdenesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleChange = (campo: keyof FiltrosOrdenes, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
      page: 1, // Resetear a primera página
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: 10,
    });
  };

  const tieneFiltrosActivos =
    filtros.estado || filtros.pacienteId || filtros.laboratorioId || filtros.fechaDesde || filtros.fechaHasta;

  const filtrosActivosCount = [
    filtros.estado,
    filtros.pacienteId,
    filtros.laboratorioId,
    filtros.fechaDesde,
    filtros.fechaHasta,
  ].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda - placeholder para futura implementación */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar órdenes..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 text-sm"
                disabled
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {filtrosActivosCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                  {filtrosActivosCount}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>

            {/* Botón limpiar */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 ring-1 ring-slate-300"
              >
                <X size={18} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleChange('estado', e.target.value || null)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                >
                  <option value="">Todos</option>
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Fecha Desde */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={filtros.fechaDesde || ''}
                  onChange={(e) => handleChange('fechaDesde', e.target.value || null)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                />
              </div>

              {/* Filtro por Fecha Hasta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={filtros.fechaHasta || ''}
                  onChange={(e) => handleChange('fechaHasta', e.target.value || null)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Filtro por Laboratorio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ID Laboratorio
                </label>
                <input
                  type="text"
                  value={filtros.laboratorioId || ''}
                  onChange={(e) => handleChange('laboratorioId', e.target.value || null)}
                  placeholder="ID del laboratorio"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filtrosActivosCount} filtro{filtrosActivosCount !== 1 ? 's' : ''} aplicado{filtrosActivosCount !== 1 ? 's' : ''}</span>
            <div className="flex flex-wrap gap-2">
              {filtros.estado && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Estado: {filtros.estado}
                  <button
                    onClick={() => handleChange('estado', null)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filtros.fechaDesde && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Desde: {new Date(filtros.fechaDesde).toLocaleDateString()}
                  <button
                    onClick={() => handleChange('fechaDesde', null)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filtros.fechaHasta && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Hasta: {new Date(filtros.fechaHasta).toLocaleDateString()}
                  <button
                    onClick={() => handleChange('fechaHasta', null)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filtros.laboratorioId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Lab: {filtros.laboratorioId}
                  <button
                    onClick={() => handleChange('laboratorioId', null)}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



