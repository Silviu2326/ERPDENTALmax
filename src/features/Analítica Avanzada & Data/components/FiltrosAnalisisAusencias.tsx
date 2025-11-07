import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { FiltrosAusencias } from '../api/analiticaApi';

interface FiltrosAnalisisAusenciasProps {
  filtros: FiltrosAusencias;
  onFiltrosChange: (filtros: FiltrosAusencias) => void;
  onAplicarFiltros: () => void;
  loading?: boolean;
}

export default function FiltrosAnalisisAusencias({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  loading = false,
}: FiltrosAnalisisAusenciasProps) {
  const handleChange = (campo: keyof FiltrosAusencias, valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="space-y-4 p-4">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => handleChange('fechaInicio', e.target.value)}
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
                  value={filtros.fechaFin}
                  onChange={(e) => handleChange('fechaFin', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sede (Opcional)
                </label>
                <input
                  type="text"
                  value={filtros.sedeId || ''}
                  onChange={(e) => handleChange('sedeId', e.target.value)}
                  placeholder="ID de Sede"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Profesional (Opcional)
                </label>
                <input
                  type="text"
                  value={filtros.profesionalId || ''}
                  onChange={(e) => handleChange('profesionalId', e.target.value)}
                  placeholder="ID de Profesional"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={onAplicarFiltros}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



