import { useState } from 'react';
import { Search, Filter, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosComunicaciones } from '../../api/crmApi';

interface FiltrosCrmDashboardProps {
  filtros: FiltrosComunicaciones;
  onFiltrosChange: (filtros: FiltrosComunicaciones) => void;
  proveedores?: Array<{ _id: string; nombreComercial: string }>;
}

export default function FiltrosCrmDashboard({
  filtros,
  onFiltrosChange,
  proveedores = [],
}: FiltrosCrmDashboardProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleProveedorChange = (proveedorId: string) => {
    onFiltrosChange({
      ...filtros,
      proveedorId: proveedorId || undefined,
    });
  };

  const handleTipoChange = (tipo: 'Email' | 'Llamada' | 'Reunión' | '') => {
    onFiltrosChange({
      ...filtros,
      tipo: tipo || undefined,
    });
  };

  const handleFechaInicioChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaInicio: fecha || undefined,
    });
  };

  const handleFechaFinChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaFin: fecha || undefined,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const tieneFiltros = filtros.proveedorId || filtros.tipo || filtros.fechaInicio || filtros.fechaFin;
  const cantidadFiltros = [
    filtros.proveedorId && 1,
    filtros.tipo && 1,
    filtros.fechaInicio && 1,
    filtros.fechaFin && 1,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en comunicaciones..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white ring-1 ring-slate-300"
            >
              <Filter size={18} className={tieneFiltros ? 'opacity-100' : 'opacity-70'} />
              <span>Filtros</span>
              {tieneFiltros && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {cantidadFiltros}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={16} className="opacity-70" />
              ) : (
                <ChevronDown size={16} className="opacity-70" />
              )}
            </button>
            
            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltros && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white ring-1 ring-slate-300"
              >
                <X size={18} className="opacity-70" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Proveedor
                </label>
                <select
                  value={filtros.proveedorId || ''}
                  onChange={(e) => handleProveedorChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los proveedores</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor._id} value={proveedor._id}>
                      {proveedor.nombreComercial}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Tipo de Comunicación
                </label>
                <select
                  value={filtros.tipo || ''}
                  onChange={(e) => handleTipoChange(e.target.value as 'Email' | 'Llamada' | 'Reunión' | '')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los tipos</option>
                  <option value="Email">Email</option>
                  <option value="Llamada">Llamada</option>
                  <option value="Reunión">Reunión</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={(e) => handleFechaInicioChange(e.target.value)}
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
                  value={filtros.fechaFin || ''}
                  onChange={(e) => handleFechaFinChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            {tieneFiltros && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{cantidadFiltros} filtro{cantidadFiltros !== 1 ? 's' : ''} aplicado{cantidadFiltros !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



