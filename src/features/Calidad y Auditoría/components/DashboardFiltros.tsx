import { Calendar, Building2 } from 'lucide-react';

interface DashboardFiltrosProps {
  fechaInicio: Date;
  fechaFin: Date;
  onFechaInicioChange: (fecha: Date) => void;
  onFechaFinChange: (fecha: Date) => void;
  sedeId?: string;
  onSedeChange?: (sedeId: string | undefined) => void;
  sedes?: Array<{ _id: string; nombre: string }>;
  agrupacion?: 'day' | 'week' | 'month';
  onAgrupacionChange?: (agrupacion: 'day' | 'week' | 'month') => void;
}

export default function DashboardFiltros({
  fechaInicio,
  fechaFin,
  onFechaInicioChange,
  onFechaFinChange,
  sedeId,
  onSedeChange,
  sedes,
  agrupacion,
  onAgrupacionChange,
}: DashboardFiltrosProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 mb-6">
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtros de Fecha */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio.toISOString().split('T')[0]}
                  onChange={(e) => onFechaInicioChange(new Date(e.target.value))}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={fechaFin.toISOString().split('T')[0]}
                  onChange={(e) => onFechaFinChange(new Date(e.target.value))}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>

            {/* Filtro de Sede (si aplica) */}
            {onSedeChange && sedes && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Building2 size={16} className="inline mr-1" />
                  Sede
                </label>
                <select
                  value={sedeId || ''}
                  onChange={(e) => onSedeChange(e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map((sede) => (
                    <option key={sede._id} value={sede._id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro de Agrupación (para gráficos) */}
            {onAgrupacionChange && agrupacion !== undefined && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Agrupación
                </label>
                <select
                  value={agrupacion}
                  onChange={(e) =>
                    onAgrupacionChange(e.target.value as 'day' | 'week' | 'month')
                  }
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="day">Diaria</option>
                  <option value="week">Semanal</option>
                  <option value="month">Mensual</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



