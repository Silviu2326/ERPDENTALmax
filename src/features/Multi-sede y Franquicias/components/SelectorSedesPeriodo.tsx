import { useState } from 'react';
import { Calendar, Building, X, ChevronDown } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import { Sede } from '../api/dashboardSedesApi';

interface SelectorSedesPeriodoProps {
  sedes: Sede[];
  sedesSeleccionadas: string[];
  fechaInicio: Date;
  fechaFin: Date;
  onSedesChange: (sedeIds: string[]) => void;
  onPeriodoChange: (inicio: Date, fin: Date) => void;
  loading?: boolean;
}

export default function SelectorSedesPeriodo({
  sedes,
  sedesSeleccionadas,
  fechaInicio,
  fechaFin,
  onSedesChange,
  onPeriodoChange,
  loading = false,
}: SelectorSedesPeriodoProps) {
  const [mostrarSelectorSedes, setMostrarSelectorSedes] = useState(false);

  const toggleSede = (sedeId: string) => {
    if (sedesSeleccionadas.includes(sedeId)) {
      onSedesChange(sedesSeleccionadas.filter((id) => id !== sedeId));
    } else {
      onSedesChange([...sedesSeleccionadas, sedeId]);
    }
  };

  const seleccionarTodas = () => {
    onSedesChange(sedes.map((s) => s._id));
  };

  const deseleccionarTodas = () => {
    onSedesChange([]);
  };

  const sedesSeleccionadasNombres = sedes
    .filter((s) => sedesSeleccionadas.includes(s._id))
    .map((s) => s.nombre);

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 ring-1 ring-slate-200">
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Selector de Sedes */}
            <div className="flex-1">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Building size={16} className="inline mr-1" />
                  Sedes
                </label>
                <button
                  onClick={() => setMostrarSelectorSedes(!mostrarSelectorSedes)}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm truncate">
                    {sedesSeleccionadas.length === 0
                      ? 'Todas las sedes'
                      : sedesSeleccionadas.length === sedes.length
                      ? 'Todas las sedes seleccionadas'
                      : sedesSeleccionadas.length === 1
                      ? sedesSeleccionadasNombres[0]
                      : `${sedesSeleccionadas.length} sedes seleccionadas`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      mostrarSelectorSedes ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mostrarSelectorSedes && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMostrarSelectorSedes(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg ring-1 ring-slate-200 z-20 p-4 max-h-64 overflow-y-auto">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-slate-700">Seleccionar sedes</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={seleccionarTodas}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Todas
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={deseleccionarTodas}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Ninguna
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {sedes.map((sede) => (
                          <label
                            key={sede._id}
                            className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={sedesSeleccionadas.includes(sede._id)}
                              onChange={() => toggleSede(sede._id)}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-slate-700">{sede.nombre}</span>
                          </label>
                        ))}
                      </div>
                      {sedesSeleccionadas.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex flex-wrap gap-2">
                            {sedesSeleccionadasNombres.map((nombre, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full ring-1 ring-blue-200"
                              >
                                {nombre}
                                <button
                                  onClick={() => {
                                    const sedeId = sedes.find((s) => s.nombre === nombre)?._id;
                                    if (sedeId) toggleSede(sedeId);
                                  }}
                                  className="hover:text-blue-900 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selector de Período */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Período
              </label>
              <DateRangePicker
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                onCambio={onPeriodoChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

