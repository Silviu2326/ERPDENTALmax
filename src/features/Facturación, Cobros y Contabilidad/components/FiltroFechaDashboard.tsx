import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

export interface FiltrosFecha {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
}

interface FiltroFechaDashboardProps {
  filtros: FiltrosFecha;
  onFiltrosChange: (filtros: FiltrosFecha) => void;
  sedeId?: string;
  onSedeChange?: (sedeId: string | undefined) => void;
  sedes?: Array<{ _id: string; nombre: string }>;
}

export default function FiltroFechaDashboard({
  filtros,
  onFiltrosChange,
  sedeId,
  onSedeChange,
  sedes,
}: FiltroFechaDashboardProps) {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const aplicarRangoPredeterminado = (rango: 'hoy' | 'semana' | 'mes' | 'trimestre' | 'año') => {
    const hoy = new Date();
    let fechaInicio: Date;
    let fechaFin: Date = new Date(hoy);

    switch (rango) {
      case 'hoy':
        fechaInicio = new Date(hoy);
        fechaFin = new Date(hoy);
        break;
      case 'semana':
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 7);
        break;
      case 'mes':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        break;
      case 'trimestre':
        const mesActual = hoy.getMonth();
        const trimestreInicio = Math.floor(mesActual / 3) * 3;
        fechaInicio = new Date(hoy.getFullYear(), trimestreInicio, 1);
        fechaFin = new Date(hoy.getFullYear(), trimestreInicio + 3, 0);
        break;
      case 'año':
        fechaInicio = new Date(hoy.getFullYear(), 0, 1);
        fechaFin = new Date(hoy.getFullYear(), 11, 31);
        break;
      default:
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 30);
    }

    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(23, 59, 59, 999);

    onFiltrosChange({
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    });
  };

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaInicio: e.target.value,
    });
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaFin: e.target.value,
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="p-4 space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filtros:</span>
            </div>

            {/* Rangos rápidos */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => aplicarRangoPredeterminado('hoy')}
                className="px-3 py-1.5 text-sm font-medium rounded-xl bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300 transition-all"
              >
                Hoy
              </button>
              <button
                onClick={() => aplicarRangoPredeterminado('semana')}
                className="px-3 py-1.5 text-sm font-medium rounded-xl bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300 transition-all"
              >
                Última Semana
              </button>
              <button
                onClick={() => aplicarRangoPredeterminado('mes')}
                className="px-3 py-1.5 text-sm font-medium rounded-xl bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300 transition-all"
              >
                Mes Actual
              </button>
              <button
                onClick={() => aplicarRangoPredeterminado('trimestre')}
                className="px-3 py-1.5 text-sm font-medium rounded-xl bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300 transition-all"
              >
                Trimestre
              </button>
              <button
                onClick={() => aplicarRangoPredeterminado('año')}
                className="px-3 py-1.5 text-sm font-medium rounded-xl bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300 transition-all"
              >
                Año Actual
              </button>
            </div>

            {/* Selector de fechas personalizado */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-600" />
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={handleFechaInicioChange}
                className="px-3 py-2.5 text-sm rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-slate-500 text-sm">a</span>
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={handleFechaFinChange}
                className="px-3 py-2.5 text-sm rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Selector de sede (si está disponible) */}
            {sedes && sedes.length > 0 && onSedeChange && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Sede:</label>
                <select
                  value={sedeId || ''}
                  onChange={(e) => onSedeChange(e.target.value || undefined)}
                  className="px-3 py-2.5 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          </div>
        </div>
      </div>
    </div>
  );
}



