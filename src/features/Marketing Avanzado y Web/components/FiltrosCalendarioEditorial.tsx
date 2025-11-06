import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { EstadoPublicacion, PlataformaSocial, FiltrosPublicaciones } from '../api/publicacionesSocialesApi';

interface FiltrosCalendarioEditorialProps {
  filtros: FiltrosPublicaciones;
  onFiltrosChange: (filtros: FiltrosPublicaciones) => void;
}

export default function FiltrosCalendarioEditorial({
  filtros,
  onFiltrosChange,
}: FiltrosCalendarioEditorialProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados: EstadoPublicacion[] = ['borrador', 'programado', 'publicado', 'error', 'archivado'];
  const plataformas: PlataformaSocial[] = ['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok'];

  const handleEstadoChange = (estado: EstadoPublicacion | 'todos') => {
    onFiltrosChange({
      ...filtros,
      estado: estado === 'todos' ? undefined : estado,
    });
  };

  const handlePlataformaChange = (plataforma: PlataformaSocial | 'todas') => {
    onFiltrosChange({
      ...filtros,
      plataforma: plataforma === 'todas' ? undefined : plataforma,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });
  };

  const tieneFiltrosActivos = filtros.estado || filtros.plataforma;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
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
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado || 'todos'}
                onChange={(e) => handleEstadoChange(e.target.value as EstadoPublicacion | 'todos')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma
              </label>
              <select
                value={filtros.plataforma || 'todas'}
                onChange={(e) => handlePlataformaChange(e.target.value as PlataformaSocial | 'todas')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todas">Todas las plataformas</option>
                {plataformas.map((plataforma) => (
                  <option key={plataforma} value={plataforma}>
                    {plataforma.charAt(0).toUpperCase() + plataforma.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


