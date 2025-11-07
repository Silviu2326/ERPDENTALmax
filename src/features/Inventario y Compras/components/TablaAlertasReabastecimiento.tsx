import { RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Loader2, Package } from 'lucide-react';
import { AlertaReabastecimiento, FiltrosAlertas } from '../api/alertasApi';
import ItemAlertaFila from './ItemAlertaFila';

interface TablaAlertasReabastecimientoProps {
  alertas: AlertaReabastecimiento[];
  loading?: boolean;
  filtros: FiltrosAlertas;
  onFiltrosChange: (filtros: FiltrosAlertas) => void;
  onAccion: (alerta: AlertaReabastecimiento, accion: 'revisar' | 'crear_orden' | 'resolver') => void;
  onRefresh?: () => void;
}

export default function TablaAlertasReabastecimiento({
  alertas,
  loading = false,
  filtros,
  onFiltrosChange,
  onAccion,
  onRefresh,
}: TablaAlertasReabastecimientoProps) {
  const handleSort = (campo: string) => {
    const nuevoSortOrder =
      filtros.sortBy === campo && filtros.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltrosChange({
      ...filtros,
      sortBy: campo,
      sortOrder: nuevoSortOrder,
    });
  };

  const renderSortIcon = (campo: string) => {
    if (filtros.sortBy !== campo) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return filtros.sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando alertas...</p>
      </div>
    );
  }

  if (alertas.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron alertas</h3>
        <p className="text-gray-600 mb-4">No hay alertas de reabastecimiento en este momento</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('producto.nombre')}
              >
                <div className="flex items-center gap-2">
                  <span>Producto</span>
                  {renderSortIcon('producto.nombre')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('sede.nombre')}
              >
                <div className="flex items-center gap-2">
                  <span>Sede</span>
                  {renderSortIcon('sede.nombre')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('stock_actual')}
              >
                <div className="flex items-center gap-2">
                  <span>Stock Actual</span>
                  {renderSortIcon('stock_actual')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Diferencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Cantidad Sugerida
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('estado')}
              >
                <div className="flex items-center gap-2">
                  <span>Estado</span>
                  {renderSortIcon('estado')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('fecha_creacion')}
              >
                <div className="flex items-center gap-2">
                  <span>Fecha Creación</span>
                  {renderSortIcon('fecha_creacion')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alertas.map((alerta) => (
              <ItemAlertaFila key={alerta._id} alerta={alerta} onAccion={onAccion} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



