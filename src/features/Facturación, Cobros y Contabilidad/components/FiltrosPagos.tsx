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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fechaInicio || ''}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fechaFin || ''}
            onChange={(e) => handleChange('fechaFin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* ID Paciente (se puede mejorar con un buscador) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            ID Paciente
          </label>
          <input
            type="text"
            value={filtros.pacienteId || ''}
            onChange={(e) => handleChange('pacienteId', e.target.value)}
            placeholder="Buscar por ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Método de Pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 inline mr-1" />
            Método de Pago
          </label>
          <select
            value={filtros.metodoPago || ''}
            onChange={(e) => handleChange('metodoPago', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filtros.estado || ''}
            onChange={(e) => handleChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="Completado">Completado</option>
            <option value="Anulado">Anulado</option>
          </select>
        </div>
      </div>
    </div>
  );
}


