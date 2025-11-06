import { RefreshCw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return filtros.sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Cargando alertas...</p>
      </div>
    );
  }

  if (alertas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No se encontraron alertas de reabastecimiento</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Actualizar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('producto.nombre')}
              >
                <div className="flex items-center space-x-1">
                  <span>Producto</span>
                  {renderSortIcon('producto.nombre')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('sede.nombre')}
              >
                <div className="flex items-center space-x-1">
                  <span>Sede</span>
                  {renderSortIcon('sede.nombre')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('stock_actual')}
              >
                <div className="flex items-center space-x-1">
                  <span>Stock Actual</span>
                  {renderSortIcon('stock_actual')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diferencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad Sugerida
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('estado')}
              >
                <div className="flex items-center space-x-1">
                  <span>Estado</span>
                  {renderSortIcon('estado')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('fecha_creacion')}
              >
                <div className="flex items-center space-x-1">
                  <span>Fecha Creación</span>
                  {renderSortIcon('fecha_creacion')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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


