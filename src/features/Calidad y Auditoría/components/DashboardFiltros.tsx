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
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filtros de Fecha */}
        <div className="flex-1 flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio.toISOString().split('T')[0]}
                onChange={(e) => onFechaInicioChange(new Date(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin.toISOString().split('T')[0]}
                onChange={(e) => onFechaFinChange(new Date(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filtro de Sede (si aplica) */}
        {onSedeChange && sedes && (
          <div className="flex items-end gap-2">
            <Building2 className="w-5 h-5 text-gray-500 flex-shrink-0 mb-2" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sede
              </label>
              <select
                value={sedeId || ''}
                onChange={(e) => onSedeChange(e.target.value || undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las sedes</option>
                {sedes.map((sede) => (
                  <option key={sede._id} value={sede._id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Filtro de Agrupación (para gráficos) */}
        {onAgrupacionChange && agrupacion !== undefined && (
          <div className="flex items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agrupación
              </label>
              <select
                value={agrupacion}
                onChange={(e) =>
                  onAgrupacionChange(e.target.value as 'day' | 'week' | 'month')
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="day">Diaria</option>
                <option value="week">Semanal</option>
                <option value="month">Mensual</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


