import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosBusquedaPacientes } from '../api/pacientesApi';

interface FiltrosBusquedaPacientesProps {
  filtros: FiltrosBusquedaPacientes;
  onFiltrosChange: (filtros: FiltrosBusquedaPacientes) => void;
}

export default function FiltrosBusquedaPacientesComponent({
  filtros,
  onFiltrosChange,
}: FiltrosBusquedaPacientesProps) {
  const [searchTerm, setSearchTerm] = useState(filtros.search || '');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Sincronizar searchTerm con filtros.search cuando cambia desde fuera
  useEffect(() => {
    if (filtros.search !== searchTerm) {
      setSearchTerm(filtros.search || '');
    }
  }, [filtros.search]);

  // Debouncing para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filtros.search) {
        onFiltrosChange({
          ...filtros,
          search: searchTerm || undefined,
          page: 1, // Resetear a página 1 cuando cambia la búsqueda
        });
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleStatusChange = (status: string) => {
    onFiltrosChange({
      ...filtros,
      status: status || undefined,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 20,
    });
  };

  const filtrosActivos = (filtros.search ? 1 : 0) + (filtros.status ? 1 : 0);

  return (
    <div className="bg-white shadow-sm rounded-xl p-0">
      <div className="p-4">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, apellidos, DNI, teléfono o número de historia clínica..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>

              {/* Botón de filtros avanzados */}
              <button
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300"
              >
                <Filter size={18} />
                <span className="hidden md:inline">Filtros</span>
                {filtrosActivos > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                    {filtrosActivos}
                  </span>
                )}
                {mostrarFiltrosAvanzados ? (
                  <ChevronUp size={18} className="opacity-70" />
                ) : (
                  <ChevronDown size={18} className="opacity-70" />
                )}
              </button>

              {/* Botón limpiar filtros */}
              {(filtros.search || filtros.status) && (
                <button
                  onClick={limpiarFiltros}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300"
                >
                  <X size={18} />
                  <span className="hidden md:inline">Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {mostrarFiltrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select
                    value={filtros.status || ''}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="archivado">Archivado</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          {(filtros.search || filtros.status) && (
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{filtrosActivos} {filtrosActivos === 1 ? 'filtro aplicado' : 'filtros aplicados'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

