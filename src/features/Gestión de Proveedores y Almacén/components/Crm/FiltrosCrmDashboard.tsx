import { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en comunicaciones..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              mostrarFiltros || tieneFiltros
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros</span>
            {tieneFiltros && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {[
                  filtros.proveedorId && 1,
                  filtros.tipo && 1,
                  filtros.fechaInicio && 1,
                  filtros.fechaFin && 1,
                ].filter(Boolean).length}
              </span>
            )}
          </button>
          {tieneFiltros && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor
            </label>
            <select
              value={filtros.proveedorId || ''}
              onChange={(e) => handleProveedorChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Comunicación
            </label>
            <select
              value={filtros.tipo || ''}
              onChange={(e) => handleTipoChange(e.target.value as 'Email' | 'Llamada' | 'Reunión' | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="Email">Email</option>
              <option value="Llamada">Llamada</option>
              <option value="Reunión">Reunión</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleFechaInicioChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleFechaFinChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


