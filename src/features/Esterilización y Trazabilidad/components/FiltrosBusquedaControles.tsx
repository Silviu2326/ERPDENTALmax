import { Search, Filter, X } from 'lucide-react';
import { FiltrosControles, TipoControl, ResultadoControl } from '../api/controlesApi';
import { Autoclave, obtenerAutoclaves } from '../api/esterilizacionApi';
import { useState, useEffect } from 'react';

interface FiltrosBusquedaControlesProps {
  filtros: FiltrosControles;
  onFiltrosChange: (filtros: FiltrosControles) => void;
}

export default function FiltrosBusquedaControles({
  filtros,
  onFiltrosChange,
}: FiltrosBusquedaControlesProps) {
  const [autoclaves, setAutoclaves] = useState<Autoclave[]>([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarAutoclaves();
  }, []);

  const cargarAutoclaves = async () => {
    try {
      const datos = await obtenerAutoclaves();
      setAutoclaves(datos);
    } catch (error) {
      console.error('Error al cargar autoclaves:', error);
    }
  };

  const handleFiltroChange = (key: keyof FiltrosControles, value: any) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
      page: 1, // Resetear a la primera página cuando cambien los filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: 20,
    });
  };

  const tieneFiltrosActivos = Boolean(
    filtros.fechaInicio ||
    filtros.fechaFin ||
    filtros.tipoControl ||
    filtros.resultado ||
    filtros.idEsterilizador
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros de Búsqueda</span>
          {tieneFiltrosActivos && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Activos
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio || ''}
              onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin || ''}
              onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Tipo de Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Control
            </label>
            <select
              value={filtros.tipoControl || ''}
              onChange={(e) => handleFiltroChange('tipoControl', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="biologico">Biológico</option>
              <option value="quimico">Químico</option>
            </select>
          </div>

          {/* Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultado
            </label>
            <select
              value={filtros.resultado || ''}
              onChange={(e) => handleFiltroChange('resultado', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="negativo">Negativo</option>
              <option value="positivo">Positivo</option>
              <option value="fallido">Fallido</option>
            </select>
          </div>

          {/* Autoclave */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autoclave
            </label>
            <select
              value={filtros.idEsterilizador || ''}
              onChange={(e) => handleFiltroChange('idEsterilizador', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Todos</option>
              {autoclaves.map((autoclave) => (
                <option key={autoclave._id} value={autoclave._id}>
                  {autoclave.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

