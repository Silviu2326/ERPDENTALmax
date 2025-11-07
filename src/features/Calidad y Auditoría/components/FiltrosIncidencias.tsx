import { Filter, X } from 'lucide-react';
import { FiltrosIncidencias as FiltrosIncidenciasType } from '../api/incidenciasApi';

interface FiltrosIncidenciasProps {
  filtros: FiltrosIncidenciasType;
  onFiltrosChange: (filtros: FiltrosIncidenciasType) => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosIncidencias({
  filtros,
  onFiltrosChange,
  clinicas = [],
}: FiltrosIncidenciasProps) {
  const tipos = [
    'No Conformidad Producto',
    'Incidencia Clínica',
    'Queja Paciente',
    'Incidente Seguridad',
  ] as const;

  const estados = ['Abierta', 'En Investigación', 'Resuelta', 'Cerrada'] as const;

  const handleChange = (campo: keyof FiltrosIncidenciasType, valor: string | undefined) => {
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

  const tieneFiltros = filtros.clinicaId || filtros.estado || filtros.tipo || filtros.fechaInicio || filtros.fechaFin;
  const numFiltros = [
    filtros.clinicaId,
    filtros.estado,
    filtros.tipo,
    filtros.fechaInicio,
    filtros.fechaFin,
  ].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="space-y-4 p-4">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Filter size={16} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Filtros</span>
                {numFiltros > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {numFiltros}
                  </span>
                )}
              </div>
            </div>
            {tieneFiltros && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={16} />
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Clínica */}
            {clinicas.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Clínica
                </label>
                <select
                  value={filtros.clinicaId || ''}
                  onChange={(e) => handleChange('clinicaId', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Tipo
              </label>
              <select
                value={filtros.tipo || ''}
                onChange={(e) => handleChange('tipo', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Estado
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            {/* Filtro por Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleChange('fechaFin', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



