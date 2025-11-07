import { useState } from 'react';
import { Search, Filter, Eye, Edit, Calendar, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Loader2, Package } from 'lucide-react';
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

  const tieneFiltrosActivos = filtros.fechaDesde || filtros.fechaHasta || filtros.estado;
  const cantidadFiltrosActivos = [filtros.fechaDesde, filtros.fechaHasta, filtros.estado].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por lote, autoclave, operador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {cantidadFiltrosActivos > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {cantidadFiltrosActivos}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {tieneFiltrosActivos && (
              <button
                onClick={() => {
                  onFiltrosChange({ page: filtros.page, limit: filtros.limit });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Panel de Filtros Avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={filtros.fechaDesde || ''}
                  onChange={(e) => onFiltrosChange({ ...filtros, fechaDesde: e.target.value || undefined })}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={filtros.fechaHasta || ''}
                  onChange={(e) => onFiltrosChange({ ...filtros, fechaHasta: e.target.value || undefined })}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
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
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="validado">Validado</option>
                  <option value="fallido">Fallido</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {!loading && lotesFiltrados.length > 0 && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{lotesFiltrados.length} {lotesFiltrados.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</span>
            {cantidadFiltrosActivos > 0 && (
              <span>{cantidadFiltrosActivos} {cantidadFiltrosActivos === 1 ? 'filtro aplicado' : 'filtros aplicados'}</span>
            )}
          </div>
        )}
      </div>

      {/* Contenido: Loading, Empty o Tabla */}
      {loading ? (
        <div className="p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      ) : lotesFiltrados.length === 0 ? (
        <div className="p-8 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron lotes</h3>
          <p className="text-gray-600 mb-4">
            {busqueda || tieneFiltrosActivos
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'No hay lotes de esterilización registrados'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border-t border-gray-200">
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



