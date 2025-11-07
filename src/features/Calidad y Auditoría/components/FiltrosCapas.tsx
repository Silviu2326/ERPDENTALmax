import { Filter, X, Search } from 'lucide-react';
import { FiltrosCapas as FiltrosCapasType } from '../api/capasApi';

interface FiltrosCapasProps {
  filtros: FiltrosCapasType;
  onFiltrosChange: (filtros: FiltrosCapasType) => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
  responsables?: Array<{ _id: string; nombre: string; apellidos?: string }>;
}

export default function FiltrosCapas({
  filtros,
  onFiltrosChange,
  clinicas = [],
  responsables = [],
}: FiltrosCapasProps) {
  const estados = [
    'Abierta',
    'En Investigación',
    'Acciones Definidas',
    'En Implementación',
    'Pendiente de Verificación',
    'Cerrada',
  ] as const;

  const handleChange = (campo: keyof FiltrosCapasType, valor: string | undefined) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
      page: 1, // Resetear a primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltros =
    filtros.id_clinica ||
    filtros.estado ||
    filtros.id_responsable ||
    filtros.fechaInicio ||
    filtros.fechaFin;

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda y controles */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar CAPAs..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            {tieneFiltros && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={18} />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={16} className="text-slate-600" />
            <h3 className="text-sm font-medium text-slate-700">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Clínica */}
            {clinicas.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Clínica
                </label>
                <select
                  value={filtros.id_clinica || ''}
                  onChange={(e) => handleChange('id_clinica', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="">Todas</option>
                  {clinicas.map((clinica) => (
                    <option key={clinica._id} value={clinica._id}>
                      {clinica.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              >
                <option value="">Todos</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Responsable */}
            {responsables.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Responsable
                </label>
                <select
                  value={filtros.id_responsable || ''}
                  onChange={(e) => handleChange('id_responsable', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="">Todos</option>
                  {responsables.map((responsable) => (
                    <option key={responsable._id} value={responsable._id}>
                      {responsable.nombre} {responsable.apellidos || ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              />
            </div>

            {/* Filtro por Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleChange('fechaFin', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



