import { useState } from 'react';
import { Search, Filter, Eye, Edit, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LoteEsterilizacion, FiltrosLotes } from '../api/esterilizacionApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TablaLotesEsterilizacionProps {
  lotes: LoteEsterilizacion[];
  loading?: boolean;
  onVerDetalle: (lote: LoteEsterilizacion) => void;
  onEditar?: (lote: LoteEsterilizacion) => void;
  filtros: FiltrosLotes;
  onFiltrosChange: (filtros: FiltrosLotes) => void;
}

export default function TablaLotesEsterilizacion({
  lotes,
  loading = false,
  onVerDetalle,
  onEditar,
  filtros,
  onFiltrosChange,
}: TablaLotesEsterilizacionProps) {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      en_proceso: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      validado: 'bg-green-100 text-green-800 border-green-200',
      fallido: 'bg-red-100 text-red-800 border-red-200',
    };

    const iconos = {
      en_proceso: <Clock className="w-4 h-4" />,
      validado: <CheckCircle className="w-4 h-4" />,
      fallido: <XCircle className="w-4 h-4" />,
    };

    const etiquetas = {
      en_proceso: 'En Proceso',
      validado: 'Validado',
      fallido: 'Fallido',
    };

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${estilos[estado as keyof typeof estilos] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
      >
        {iconos[estado as keyof typeof iconos]}
        <span>{etiquetas[estado as keyof typeof etiquetas] || estado}</span>
      </span>
    );
  };

  const lotesFiltrados = lotes.filter((lote) => {
    if (!busqueda) return true;
    const busquedaLower = busqueda.toLowerCase();
    return (
      lote.loteId.toLowerCase().includes(busquedaLower) ||
      lote.autoclave.nombre.toLowerCase().includes(busquedaLower) ||
      lote.operador.nombre.toLowerCase().includes(busquedaLower) ||
      lote.sede.nombre.toLowerCase().includes(busquedaLower)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Registro de Lotes</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por lote, autoclave, operador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center space-x-2 ${
                mostrarFiltros
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {mostrarFiltros && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                value={filtros.fechaDesde || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, fechaDesde: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filtros.fechaHasta || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, fechaHasta: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) =>
                  onFiltrosChange({
                    ...filtros,
                    estado: e.target.value as 'en_proceso' | 'validado' | 'fallido' | undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="en_proceso">En Proceso</option>
                <option value="validado">Validado</option>
                <option value="fallido">Fallido</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => onFiltrosChange({})}
                className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Cargando lotes...</p>
        </div>
      ) : lotesFiltrados.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No se encontraron lotes de esterilización</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lote ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autoclave
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paquetes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lotesFiltrados.map((lote) => (
                <tr key={lote._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lote.loteId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lote.autoclave.nombre}</div>
                    {lote.autoclave.modelo && (
                      <div className="text-xs text-gray-500">{lote.autoclave.modelo}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lote.operador.nombre} {lote.operador.apellidos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {format(new Date(lote.fechaInicio), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(lote.estado)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lote.paquetes.length} paquetes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onVerDetalle(lote)}
                        className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {onEditar && lote.estado === 'en_proceso' && (
                        <button
                          onClick={() => onEditar(lote)}
                          className="text-indigo-600 hover:text-indigo-900 p-1.5 hover:bg-indigo-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


