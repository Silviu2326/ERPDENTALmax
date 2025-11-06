import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { EstadoOrden, FiltrosOrdenes } from '../api/ordenesLaboratorioApi';

interface FiltrosBusquedaOrdenesProps {
  filtros: FiltrosOrdenes;
  onFiltrosChange: (filtros: FiltrosOrdenes) => void;
}

const ESTADOS: EstadoOrden[] = [
  'Borrador',
  'Enviada',
  'Recibida',
  'En Proceso',
  'Control Calidad',
  'Enviada a Clínica',
  'Recibida en Clínica',
  'Completada',
];

export default function FiltrosBusquedaOrdenes({
  filtros,
  onFiltrosChange,
}: FiltrosBusquedaOrdenesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleChange = (campo: keyof FiltrosOrdenes, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
      page: 1, // Resetear a primera página
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: 10,
    });
  };

  const tieneFiltrosActivos =
    filtros.estado || filtros.pacienteId || filtros.laboratorioId || filtros.fechaDesde || filtros.fechaHasta;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filtros</span>
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleChange('estado', e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
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
              onChange={(e) => handleChange('fechaDesde', e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              onChange={(e) => handleChange('fechaHasta', e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por Laboratorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Laboratorio
            </label>
            <input
              type="text"
              value={filtros.laboratorioId || ''}
              onChange={(e) => handleChange('laboratorioId', e.target.value || null)}
              placeholder="ID del laboratorio"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {tieneFiltrosActivos && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filtros.estado && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Estado: {filtros.estado}
                <button
                  onClick={() => handleChange('estado', null)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filtros.fechaDesde && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Desde: {new Date(filtros.fechaDesde).toLocaleDateString()}
                <button
                  onClick={() => handleChange('fechaDesde', null)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filtros.fechaHasta && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Hasta: {new Date(filtros.fechaHasta).toLocaleDateString()}
                <button
                  onClick={() => handleChange('fechaHasta', null)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filtros.laboratorioId && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Lab: {filtros.laboratorioId}
                <button
                  onClick={() => handleChange('laboratorioId', null)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


