import { useState } from 'react';
import { Repeat, Calendar, X } from 'lucide-react';

export interface ConfiguracionRecurrencia {
  tipo: 'diaria' | 'semanal' | 'mensual' | null;
  frecuencia: number;
  finFecha?: string;
  finOcurrencias?: number;
  diasSemana?: number[];
  diaMes?: number;
}

interface ConfiguradorRecurrenciaProps {
  recurrencia: ConfiguracionRecurrencia;
  onRecurrenciaChange: (recurrencia: ConfiguracionRecurrencia) => void;
}

const DIAS_SEMANA = [
  { valor: 0, nombre: 'Domingo' },
  { valor: 1, nombre: 'Lunes' },
  { valor: 2, nombre: 'Martes' },
  { valor: 3, nombre: 'Miércoles' },
  { valor: 4, nombre: 'Jueves' },
  { valor: 5, nombre: 'Viernes' },
  { valor: 6, nombre: 'Sábado' },
];

export default function ConfiguradorRecurrencia({
  recurrencia,
  onRecurrenciaChange,
}: ConfiguradorRecurrenciaProps) {
  const [tieneRecurrencia, setTieneRecurrencia] = useState(recurrencia.tipo !== null);

  const handleToggleRecurrencia = () => {
    if (tieneRecurrencia) {
      setTieneRecurrencia(false);
      onRecurrenciaChange({
        tipo: null,
        frecuencia: 1,
      });
    } else {
      setTieneRecurrencia(true);
      onRecurrenciaChange({
        tipo: recurrencia.tipo || 'semanal',
        frecuencia: recurrencia.frecuencia || 1,
      });
    }
  };

  const handleTipoChange = (tipo: 'diaria' | 'semanal' | 'mensual') => {
    onRecurrenciaChange({
      ...recurrencia,
      tipo,
      diasSemana: tipo === 'semanal' ? recurrencia.diasSemana || [] : undefined,
      diaMes: tipo === 'mensual' ? recurrencia.diaMes : undefined,
    });
  };

  const handleDiaSemanaToggle = (dia: number) => {
    const diasSemana = recurrencia.diasSemana || [];
    const nuevosDias = diasSemana.includes(dia)
      ? diasSemana.filter((d) => d !== dia)
      : [...diasSemana, dia].sort();
    
    onRecurrenciaChange({
      ...recurrencia,
      diasSemana: nuevosDias,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
          <Repeat className="w-4 h-4" />
          <span>Evento Recurrente</span>
        </label>
        <button
          type="button"
          onClick={handleToggleRecurrencia}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            tieneRecurrencia ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              tieneRecurrencia ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {tieneRecurrencia && (
        <div className="space-y-4 pt-2 border-t border-slate-300">
          {/* Tipo de recurrencia */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Tipo de Recurrencia *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTipoChange('diaria')}
                className={`px-3 py-2 rounded-xl ring-1 transition-all ${
                  recurrencia.tipo === 'diaria'
                    ? 'ring-blue-300 bg-blue-50 text-blue-700'
                    : 'ring-slate-300 bg-white text-slate-700 hover:ring-slate-400'
                }`}
              >
                Diaria
              </button>
              <button
                type="button"
                onClick={() => handleTipoChange('semanal')}
                className={`px-3 py-2 rounded-xl ring-1 transition-all ${
                  recurrencia.tipo === 'semanal'
                    ? 'ring-blue-300 bg-blue-50 text-blue-700'
                    : 'ring-slate-300 bg-white text-slate-700 hover:ring-slate-400'
                }`}
              >
                Semanal
              </button>
              <button
                type="button"
                onClick={() => handleTipoChange('mensual')}
                className={`px-3 py-2 rounded-xl ring-1 transition-all ${
                  recurrencia.tipo === 'mensual'
                    ? 'ring-blue-300 bg-blue-50 text-blue-700'
                    : 'ring-slate-300 bg-white text-slate-700 hover:ring-slate-400'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>

          {/* Frecuencia */}
          {recurrencia.tipo && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Repetir cada {recurrencia.tipo === 'diaria' ? 'día(s)' : recurrencia.tipo === 'semanal' ? 'semana(s)' : 'mes(es)'} *
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={recurrencia.frecuencia || 1}
                onChange={(e) =>
                  onRecurrenciaChange({
                    ...recurrencia,
                    frecuencia: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          )}

          {/* Días de la semana (solo para semanal) */}
          {recurrencia.tipo === 'semanal' && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Días de la Semana *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DIAS_SEMANA.map((dia) => (
                  <button
                    key={dia.valor}
                    type="button"
                    onClick={() => handleDiaSemanaToggle(dia.valor)}
                    className={`px-3 py-2 rounded-xl ring-1 transition-all text-sm ${
                      (recurrencia.diasSemana || []).includes(dia.valor)
                        ? 'ring-blue-300 bg-blue-50 text-blue-700 font-semibold'
                        : 'ring-slate-300 bg-white text-slate-700 hover:ring-slate-400'
                    }`}
                  >
                    {dia.nombre.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Día del mes (solo para mensual) */}
          {recurrencia.tipo === 'mensual' && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Día del Mes *
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={recurrencia.diaMes || 1}
                onChange={(e) =>
                  onRecurrenciaChange({
                    ...recurrencia,
                    diaMes: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          )}

          {/* Fin de recurrencia */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Finalizar
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="finRecurrencia"
                  checked={!!recurrencia.finFecha}
                  onChange={() =>
                    onRecurrenciaChange({
                      ...recurrencia,
                      finFecha: recurrencia.finFecha || new Date().toISOString().split('T')[0],
                      finOcurrencias: undefined,
                    })
                  }
                  className="text-blue-600"
                />
                <span className="text-sm text-slate-700">En una fecha específica</span>
              </label>
              {recurrencia.finFecha && (
                <input
                  type="date"
                  value={recurrencia.finFecha}
                  onChange={(e) =>
                    onRecurrenciaChange({
                      ...recurrencia,
                      finFecha: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              )}
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="finRecurrencia"
                  checked={!!recurrencia.finOcurrencias}
                  onChange={() =>
                    onRecurrenciaChange({
                      ...recurrencia,
                      finOcurrencias: recurrencia.finOcurrencias || 10,
                      finFecha: undefined,
                    })
                  }
                  className="text-blue-600"
                />
                <span className="text-sm text-slate-700">Después de</span>
                {recurrencia.finOcurrencias && (
                  <>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={recurrencia.finOcurrencias}
                      onChange={(e) =>
                        onRecurrenciaChange({
                          ...recurrencia,
                          finOcurrencias: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-20 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1"
                    />
                    <span className="text-sm text-slate-700">ocurrencias</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



