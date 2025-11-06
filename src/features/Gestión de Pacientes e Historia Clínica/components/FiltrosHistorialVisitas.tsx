import { useState } from 'react';
import { Filter, X, Calendar } from 'lucide-react';
import { FiltrosVisitas } from '../api/historialVisitasApi';

interface FiltrosHistorialVisitasProps {
  filtros: FiltrosVisitas;
  onFiltrosChange: (filtros: FiltrosVisitas) => void;
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string }>;
}

export default function FiltrosHistorialVisitas({
  filtros,
  onFiltrosChange,
  profesionales = [],
}: FiltrosHistorialVisitasProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFechaDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaDesde: e.target.value || undefined,
    });
  };

  const handleFechaHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaHasta: e.target.value || undefined,
    });
  };

  const handleProfesionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      profesionalId: e.target.value || undefined,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const tieneFiltrosActivos = !!(filtros.fechaDesde || filtros.fechaHasta || filtros.profesionalId);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            mostrarFiltros || tieneFiltrosActivos
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {tieneFiltrosActivos && (
            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {[
                filtros.fechaDesde && '1',
                filtros.fechaHasta && '1',
                filtros.profesionalId && '1',
              ].filter(Boolean).length}
            </span>
          )}
        </button>

        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fecha Desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Desde
              </label>
              <input
                type="date"
                value={filtros.fechaDesde || ''}
                onChange={handleFechaDesdeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filtros.fechaHasta || ''}
                onChange={handleFechaHastaChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Profesional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesional
              </label>
              <select
                value={filtros.profesionalId || ''}
                onChange={handleProfesionalChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los profesionales</option>
                {profesionales.map((prof) => (
                  <option key={prof._id} value={prof._id}>
                    {prof.nombre} {prof.apellidos}
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


