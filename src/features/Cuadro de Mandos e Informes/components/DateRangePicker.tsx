import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  fechaInicio: Date;
  fechaFin: Date;
  onCambio: (inicio: Date, fin: Date) => void;
}

const rangosPreset = [
  { label: 'Últimos 7 días', dias: 7 },
  { label: 'Últimos 30 días', dias: 30 },
  { label: 'Últimos 90 días', dias: 90 },
  { label: 'Último mes', dias: 30 },
  { label: 'Último trimestre', dias: 90 },
  { label: 'Último año', dias: 365 },
];

export default function DateRangePicker({
  fechaInicio,
  fechaFin,
  onCambio,
}: DateRangePickerProps) {
  const [mostrarSelector, setMostrarSelector] = useState(false);

  const aplicarRangoPreset = (dias: number) => {
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - dias);
    inicio.setHours(0, 0, 0, 0);
    onCambio(inicio, fin);
    setMostrarSelector(false);
  };

  const formatearFecha = (fecha: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(fecha);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarSelector(!mostrarSelector)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
      >
        <Calendar size={18} className="text-slate-600" />
        <span className="text-sm font-medium text-slate-700">
          {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
        </span>
        <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${mostrarSelector ? 'rotate-90' : ''}`} />
      </button>

      {mostrarSelector && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMostrarSelector(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 z-20 p-4 min-w-[280px]">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Rangos rápidos</h4>
              <div className="space-y-2">
                {rangosPreset.map((rango) => (
                  <button
                    key={rango.label}
                    onClick={() => aplicarRangoPreset(rango.dias)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {rango.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Selección personalizada</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha inicio</label>
                  <input
                    type="date"
                    value={fechaInicio.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const nuevaFecha = new Date(e.target.value);
                      nuevaFecha.setHours(0, 0, 0, 0);
                      onCambio(nuevaFecha, fechaFin);
                    }}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha fin</label>
                  <input
                    type="date"
                    value={fechaFin.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const nuevaFecha = new Date(e.target.value);
                      nuevaFecha.setHours(23, 59, 59, 999);
                      onCambio(fechaInicio, nuevaFecha);
                    }}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



