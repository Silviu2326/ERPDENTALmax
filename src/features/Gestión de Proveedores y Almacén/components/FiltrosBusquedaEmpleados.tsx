import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FiltrosEmpleados } from '../api/empleadosApi';

interface FiltrosBusquedaEmpleadosProps {
  filtros: FiltrosEmpleados;
  onFiltrosChange: (filtros: FiltrosEmpleados) => void;
  sedes?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosBusquedaEmpleados({
  filtros,
  onFiltrosChange,
  sedes = [],
}: FiltrosBusquedaEmpleadosProps) {
  const [busqueda, setBusqueda] = useState(filtros.search || '');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const roles = [
    { value: 'Odontologo', label: 'Odontólogo' },
    { value: 'Asistente', label: 'Asistente' },
    { value: 'Recepcionista', label: 'Recepcionista' },
    { value: 'RR.HH.', label: 'RR.HH.' },
    { value: 'Gerente', label: 'Gerente' },
  ];

  const estados = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
  ];

  const handleBusquedaChange = (value: string) => {
    setBusqueda(value);
    onFiltrosChange({
      ...filtros,
      search: value || undefined,
      page: 1, // Resetear a la primera página al buscar
    });
  };

  const handleFiltroChange = (key: keyof FiltrosEmpleados, value: string | undefined) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
      page: 1, // Resetear a la primera página al filtrar
    });
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltrosActivos = filtros.rol || filtros.sedeId || filtros.estado || filtros.search;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Barra de búsqueda principal */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email..."
            value={busqueda}
            onChange={(e) => handleBusquedaChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            mostrarFiltros || tieneFiltrosActivos
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[filtros.rol, filtros.sedeId, filtros.estado].filter(Boolean).length}
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {/* Panel de filtros expandible */}
      {mostrarFiltros && (
        <div className="border-t border-gray-200 pt-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={filtros.rol || ''}
              onChange={(e) => handleFiltroChange('rol', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los roles</option>
              {roles.map((rol) => (
                <option key={rol.value} value={rol.value}>
                  {rol.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sede
            </label>
            <select
              value={filtros.sedeId || ''}
              onChange={(e) => handleFiltroChange('sedeId', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las sedes</option>
              {sedes.map((sede) => (
                <option key={sede._id} value={sede._id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleFiltroChange('estado', e.target.value as 'Activo' | 'Inactivo' | undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}


