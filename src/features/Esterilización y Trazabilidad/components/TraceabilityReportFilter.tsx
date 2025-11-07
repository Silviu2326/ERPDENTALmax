import { useState } from 'react';
import { Filter, X, Calendar, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { TraceabilityReportFilters } from '../api/traceabilityApi';

interface TraceabilityReportFilterProps {
  filtros: TraceabilityReportFilters;
  onFiltrosChange: (filtros: TraceabilityReportFilters) => void;
  onBuscar: () => void;
  loading?: boolean;
}

export default function TraceabilityReportFilter({
  filtros,
  onFiltrosChange,
  onBuscar,
  loading = false,
}: TraceabilityReportFilterProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const handleChange = (key: keyof TraceabilityReportFilters, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    onFiltrosChange({
      startDate: fechaInicio.toISOString().split('T')[0],
      endDate: fechaFin.toISOString().split('T')[0],
      page: 1,
      limit: filtros.limit || 20,
    });
  };

  const tieneFiltrosActivos =
    filtros.patientId || filtros.instrumentKitId || filtros.sterilizationCycleId || filtros.startDate || filtros.endDate;

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.patientId) count++;
    if (filtros.instrumentKitId) count++;
    if (filtros.sterilizationCycleId) count++;
    if (filtros.startDate) count++;
    if (filtros.endDate) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-xl ring-1 ring-slate-300 hover:bg-slate-50 transition-all"
            >
              <Filter size={18} className="opacity-70" />
              <span>Filtros</span>
              {contarFiltrosActivos() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {contarFiltrosActivos()}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={16} className="opacity-70" />
              ) : (
                <ChevronDown size={16} className="opacity-70" />
              )}
            </button>

            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white rounded-xl ring-1 ring-slate-300 hover:bg-slate-50 transition-all"
              >
                <X size={16} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por DNI/Nombre de Paciente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Search size={16} className="inline mr-1" />
                  DNI / Nombre de Paciente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filtros.patientId || ''}
                    onChange={(e) => handleChange('patientId', e.target.value)}
                    placeholder="Buscar por DNI o nombre"
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                </div>
              </div>

              {/* Filtro por Código de Kit */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Search size={16} className="inline mr-1" />
                  Código de Kit de Instrumental
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filtros.instrumentKitId || ''}
                    onChange={(e) => handleChange('instrumentKitId', e.target.value)}
                    placeholder="Ej: KIT-001"
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                </div>
              </div>

              {/* Filtro por ID de Ciclo de Esterilización */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Search size={16} className="inline mr-1" />
                  ID de Ciclo de Esterilización
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filtros.sterilizationCycleId || ''}
                    onChange={(e) => handleChange('sterilizationCycleId', e.target.value)}
                    placeholder="Ej: CYC-2024-001"
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                </div>
              </div>

              {/* Filtro por Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.startDate || ''}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
              </div>

              {/* Filtro por Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.endDate || ''}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
              </div>

              {/* Botón de Búsqueda */}
              <div className="flex items-end">
                <button
                  onClick={onBuscar}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Search size={20} />
                  <span>{loading ? 'Buscando...' : 'Buscar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {mostrarFiltros && tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{contarFiltrosActivos()} filtros aplicados</span>
          </div>
        )}
      </div>
    </div>
  );
}



