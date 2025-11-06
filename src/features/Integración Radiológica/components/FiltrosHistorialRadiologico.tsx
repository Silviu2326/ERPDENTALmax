import { useState } from 'react';
import { Filter, X, Calendar } from 'lucide-react';
import { FiltrosRadiologias, Radiologia } from '../api/radiologiaApi';

interface FiltrosHistorialRadiologicoProps {
  filtros: FiltrosRadiologias;
  onFiltrosChange: (filtros: FiltrosRadiologias) => void;
}

const TIPOS_RADIOGRAFIA: Radiologia['tipoRadiografia'][] = [
  'Periapical',
  'Bitewing',
  'Oclusal',
  'Panorámica',
  'CBCT',
];

export default function FiltrosHistorialRadiologico({
  filtros,
  onFiltrosChange,
}: FiltrosHistorialRadiologicoProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleTipoChange = (tipo: Radiologia['tipoRadiografia'] | '') => {
    onFiltrosChange({
      ...filtros,
      tipo: tipo === '' ? undefined : tipo,
      page: 1, // Resetear a primera página al filtrar
    });
  };

  const handleFechaDesdeChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaDesde: fecha || undefined,
      page: 1,
    });
  };

  const handleFechaHastaChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaHasta: fecha || undefined,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: filtros.page || 1,
      limit: filtros.limit || 20,
    });
  };

  const tieneFiltrosActivos = Boolean(filtros.tipo || filtros.fechaDesde || filtros.fechaHasta);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
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
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Radiografía
            </label>
            <select
              value={filtros.tipo || ''}
              onChange={(e) => handleTipoChange(e.target.value as Radiologia['tipoRadiografia'] | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {TIPOS_RADIOGRAFIA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Fecha Desde</span>
              </div>
            </label>
            <input
              type="date"
              value={filtros.fechaDesde || ''}
              onChange={(e) => handleFechaDesdeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Fecha Hasta</span>
              </div>
            </label>
            <input
              type="date"
              value={filtros.fechaHasta || ''}
              onChange={(e) => handleFechaHastaChange(e.target.value)}
              min={filtros.fechaDesde}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}


