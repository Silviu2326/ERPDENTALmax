import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { FiltrosAlertas } from '../api/alertasApi';

interface Sede {
  _id: string;
  nombre: string;
}

interface FiltrosAlertasProps {
  filtros: FiltrosAlertas;
  onFiltrosChange: (filtros: FiltrosAlertas) => void;
  sedes: Sede[];
}

export default function FiltrosAlertasComponent({ filtros, onFiltrosChange, sedes }: FiltrosAlertasProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleSedeChange = (sedeId: string) => {
    onFiltrosChange({
      ...filtros,
      sedeId: sedeId || undefined,
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const handleEstadoChange = (estado: string) => {
    onFiltrosChange({
      ...filtros,
      estado: (estado || undefined) as FiltrosAlertas['estado'],
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltrosActivos = filtros.sedeId || filtros.estado;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
        >
          <Filter className="w-5 h-5" />
          <span>Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por Sede */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sede</label>
            <select
              value={filtros.sedeId || ''}
              onChange={(e) => handleSedeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las sedes</option>
              {sedes.map((sede) => (
                <option key={sede._id} value={sede._id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="nueva">Nueva</option>
              <option value="revisada">Revisada</option>
              <option value="en_proceso_compra">En Proceso de Compra</option>
              <option value="resuelta">Resuelta</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}


