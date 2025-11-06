import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Barra de búsqueda principal */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos, DNI, teléfono o número de historia clínica..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botón de filtros avanzados */}
        <button
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
          className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
            mostrarFiltrosAvanzados || filtros.status
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden md:inline">Filtros</span>
        </button>

        {/* Botón limpiar filtros */}
        {(filtros.search || filtros.status) && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span className="hidden md:inline">Limpiar</span>
          </button>
        )}
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.status || ''}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </div>
  );
}

