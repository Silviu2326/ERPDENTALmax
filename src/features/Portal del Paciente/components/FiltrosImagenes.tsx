import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { TipoImagen, FiltrosImagenes } from '../api/imagenesApi';

interface FiltrosImagenesProps {
  filtros: FiltrosImagenes;
  onFiltrosChange: (filtros: FiltrosImagenes) => void;
}

const tipoLabels: Record<TipoImagen, string> = {
  RX_PERIAPICAL: 'RX Periapical',
  RX_BITEWING: 'RX Bitewing',
  RX_PANORAMICA: 'RX Panorámica',
  FOTO_INTRAORAL: 'Foto Intraoral',
  FOTO_EXTRAORAL: 'Foto Extraoral',
  TOMOGRAFIA: 'Tomografía',
  OTRO: 'Otro',
};

const tiposImagen: TipoImagen[] = [
  'RX_PERIAPICAL',
  'RX_BITEWING',
  'RX_PANORAMICA',
  'FOTO_INTRAORAL',
  'FOTO_EXTRAORAL',
  'TOMOGRAFIA',
  'OTRO',
];

export default function FiltrosImagenesComponent({ filtros, onFiltrosChange }: FiltrosImagenesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleTipoChange = (tipo: TipoImagen | '') => {
    onFiltrosChange({
      ...filtros,
      tipo: tipo || undefined,
      page: 1, // Reset a la primera página
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
      page: 1,
      limit: filtros.limit,
    });
  };

  const tieneFiltrosActivos = filtros.tipo || filtros.fechaDesde || filtros.fechaHasta;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Imagen
            </label>
            <select
              value={filtros.tipo || ''}
              onChange={(e) => handleTipoChange(e.target.value as TipoImagen | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Todos los tipos</option>
              {tiposImagen.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipoLabels[tipo]}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde || ''}
              onChange={(e) => handleFechaDesdeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Filtro por Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta || ''}
              onChange={(e) => handleFechaHastaChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}


