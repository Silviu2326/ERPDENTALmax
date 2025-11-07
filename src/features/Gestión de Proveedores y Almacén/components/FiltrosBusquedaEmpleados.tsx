import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const filtrosActivos = [filtros.rol, filtros.sedeId, filtros.estado].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o email..."
                value={busqueda}
                onChange={(e) => handleBusquedaChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 bg-white/50 ring-1 ring-slate-200"
            >
              <Filter size={18} className={mostrarFiltros || filtrosActivos > 0 ? 'opacity-100' : 'opacity-70'} />
              <span>Filtros</span>
              {filtrosActivos > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                  {filtrosActivos}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>

            {/* Botón limpiar filtros */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 bg-white/50 ring-1 ring-slate-200"
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
                  Rol
                </label>
                <select
                  value={filtros.rol || ''}
                  onChange={(e) => handleFiltroChange('rol', e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Search size={16} className="inline mr-1" />
                  Sede
                </label>
                <select
                  value={filtros.sedeId || ''}
                  onChange={(e) => handleFiltroChange('sedeId', e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleFiltroChange('estado', e.target.value as 'Activo' | 'Inactivo' | undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filtrosActivos + (filtros.search ? 1 : 0)} filtro{(filtrosActivos + (filtros.search ? 1 : 0)) > 1 ? 's' : ''} aplicado{(filtrosActivos + (filtros.search ? 1 : 0)) > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}



