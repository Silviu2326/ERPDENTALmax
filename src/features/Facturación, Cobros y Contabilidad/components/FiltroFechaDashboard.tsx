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
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Filtros:</span>
        </div>

        {/* Rangos rápidos */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => aplicarRangoPredeterminado('hoy')}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => aplicarRangoPredeterminado('semana')}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Última Semana
          </button>
          <button
            onClick={() => aplicarRangoPredeterminado('mes')}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Mes Actual
          </button>
          <button
            onClick={() => aplicarRangoPredeterminado('trimestre')}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Trimestre
          </button>
          <button
            onClick={() => aplicarRangoPredeterminado('año')}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Año Actual
          </button>
        </div>

        {/* Selector de fechas personalizado */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={handleFechaInicioChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-500">a</span>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={handleFechaFinChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Selector de sede (si está disponible) */}
        {sedes && sedes.length > 0 && onSedeChange && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sede:</label>
            <select
              value={sedeId || ''}
              onChange={(e) => onSedeChange(e.target.value || undefined)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  );
}


