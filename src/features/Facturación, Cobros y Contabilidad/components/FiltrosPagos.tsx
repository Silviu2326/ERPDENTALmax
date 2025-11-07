import { Calendar, User, CreditCard, Filter } from 'lucide-react';
import { FiltrosPagos } from '../api/pagosApi';

interface FiltrosPagosProps {
  filtros: FiltrosPagos;
  onFiltrosChange: (filtros: FiltrosPagos) => void;
  onLimpiar: () => void;
}

const METODOS_PAGO = [
  'Efectivo',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Transferencia',
  'Cheque',
  'Otro',
] as const;

export default function FiltrosPagosComponent({
  filtros,
  onFiltrosChange,
  onLimpiar,
}: FiltrosPagosProps) {
  const handleChange = (campo: keyof FiltrosPagos, valor: string | undefined) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
    });
  };

  const hayFiltrosActivos = !!(
    filtros.fechaInicio ||
    filtros.fechaFin ||
    filtros.pacienteId ||
    filtros.metodoPago ||
    filtros.estado
  );

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Filter size={18} className="text-slate-600" />
              <h3 className="text-sm font-medium text-slate-700">Filtros de Búsqueda</h3>
            </div>
            {hayFiltrosActivos && (
              <button
                onClick={onLimpiar}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            {/* Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleChange('fechaFin', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            {/* ID Paciente */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User size={16} className="inline mr-1" />
                ID Paciente
              </label>
              <input
                type="text"
                value={filtros.pacienteId || ''}
                onChange={(e) => handleChange('pacienteId', e.target.value)}
                placeholder="Buscar por ID..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <CreditCard size={16} className="inline mr-1" />
                Método de Pago
              </label>
              <select
                value={filtros.metodoPago || ''}
                onChange={(e) => handleChange('metodoPago', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos</option>
                {METODOS_PAGO.map((metodo) => (
                  <option key={metodo} value={metodo}>
                    {metodo}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos</option>
                <option value="Completado">Completado</option>
                <option value="Anulado">Anulado</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



