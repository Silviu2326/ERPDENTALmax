import { useState } from 'react';
import { Calendar, Building2, X } from 'lucide-react';
import DateRangePicker from '../DateRangePicker';
import ClinicSelector from '../ClinicSelector';

interface Sede {
  _id: string;
  nombre: string;
}

interface FiltroPeriodoSedeProps {
  fechaInicio: Date;
  fechaFin: Date;
  sedes: Sede[];
  sedeIdsSeleccionadas: string[];
  onFechaInicioChange: (fecha: Date) => void;
  onFechaFinChange: (fecha: Date) => void;
  onSedeIdsChange: (sedeIds: string[]) => void;
  agrupacion?: 'dia' | 'mes' | 'año';
  onAgrupacionChange?: (agrupacion: 'dia' | 'mes' | 'año') => void;
}

export default function FiltroPeriodoSede({
  fechaInicio,
  fechaFin,
  sedes,
  sedeIdsSeleccionadas,
  onFechaInicioChange,
  onFechaFinChange,
  onSedeIdsChange,
  agrupacion = 'mes',
  onAgrupacionChange,
}: FiltroPeriodoSedeProps) {
  const [mostrarSelectorSedes, setMostrarSelectorSedes] = useState(false);

  const handleCambioFechas = (inicio: Date, fin: Date) => {
    onFechaInicioChange(inicio);
    onFechaFinChange(fin);
  };

  const toggleSede = (sedeId: string) => {
    if (sedeIdsSeleccionadas.includes(sedeId)) {
      onSedeIdsChange(sedeIdsSeleccionadas.filter((id) => id !== sedeId));
    } else {
      onSedeIdsChange([...sedeIdsSeleccionadas, sedeId]);
    }
  };

  const sedesSeleccionadas = sedes.filter((sede) =>
    sedeIdsSeleccionadas.includes(sede._id)
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border-2 border-blue-100">
      <div className="flex flex-wrap items-center gap-4">
        {/* Selector de fechas */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <DateRangePicker
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onCambio={handleCambioFechas}
          />
        </div>

        {/* Selector de sedes */}
        <div className="flex items-center space-x-2 relative">
          <Building2 className="w-5 h-5 text-blue-600" />
          <div className="relative">
            <button
              onClick={() => setMostrarSelectorSedes(!mostrarSelectorSedes)}
              className="px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-gray-700 flex items-center space-x-2"
            >
              <span>
                {sedeIdsSeleccionadas.length === 0
                  ? 'Todas las sedes'
                  : sedeIdsSeleccionadas.length === 1
                  ? sedesSeleccionadas[0]?.nombre
                  : `${sedeIdsSeleccionadas.length} sedes`}
              </span>
            </button>

            {mostrarSelectorSedes && (
              <div className="absolute top-full left-0 mt-2 bg-white border-2 border-blue-200 rounded-lg shadow-xl z-50 min-w-[250px]">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Seleccionar Sedes</span>
                  <button
                    onClick={() => setMostrarSelectorSedes(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      if (sedeIdsSeleccionadas.length === sedes.length) {
                        onSedeIdsChange([]);
                      } else {
                        onSedeIdsChange(sedes.map((s) => s._id));
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded mb-1 text-blue-600 font-medium"
                  >
                    {sedeIdsSeleccionadas.length === sedes.length
                      ? 'Desmarcar todas'
                      : 'Seleccionar todas'}
                  </button>
                  {sedes.map((sede) => (
                    <label
                      key={sede._id}
                      className="flex items-center px-3 py-2 hover:bg-blue-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={sedeIdsSeleccionadas.includes(sede._id)}
                        onChange={() => toggleSede(sede._id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{sede.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chips de sedes seleccionadas */}
          {sedeIdsSeleccionadas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sedesSeleccionadas.map((sede) => (
                <span
                  key={sede._id}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {sede.nombre}
                  <button
                    onClick={() => toggleSede(sede._id)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Selector de agrupación (si está disponible) */}
        {onAgrupacionChange && (
          <div className="flex items-center space-x-2">
            <select
              value={agrupacion}
              onChange={(e) => onAgrupacionChange(e.target.value as 'dia' | 'mes' | 'año')}
              className="px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-gray-700"
            >
              <option value="dia">Día</option>
              <option value="mes">Mes</option>
              <option value="año">Año</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}


