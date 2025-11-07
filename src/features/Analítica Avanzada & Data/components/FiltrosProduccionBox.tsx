import { Calendar, RefreshCw, Building2, User, Box } from 'lucide-react';
import { FiltrosProduccionBox } from '../api/analiticaApi';

interface FiltrosProduccionBoxProps {
  filtros: FiltrosProduccionBox;
  onFiltrosChange: (filtros: FiltrosProduccionBox) => void;
  onAplicarFiltros: () => void;
  loading?: boolean;
}

export default function FiltrosProduccionBoxComponent({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  loading = false,
}: FiltrosProduccionBoxProps) {
  const handleChange = (campo: keyof FiltrosProduccionBox, valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
    });
  };

  const tieneFiltrosOpcionales = filtros.sedeId || filtros.profesionalId || filtros.boxId;

  return (
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda y botones */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <Building2 size={16} className="inline mr-1" />
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
                  <User size={16} className="inline mr-1" />
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Box size={16} className="inline mr-1" />
                  Box (Opcional)
                </label>
                <input
                  type="text"
                  value={filtros.boxId || ''}
                  onChange={(e) => handleChange('boxId', e.target.value)}
                  placeholder="ID de Box"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              {tieneFiltrosOpcionales && (
                <button
                  onClick={() => {
                    onFiltrosChange({
                      fechaInicio: filtros.fechaInicio,
                      fechaFin: filtros.fechaFin,
                    });
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white/70 transition-all"
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={onAplicarFiltros}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



