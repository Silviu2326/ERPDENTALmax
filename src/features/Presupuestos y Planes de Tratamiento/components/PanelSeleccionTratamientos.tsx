import { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Tratamiento } from '../api/simuladorApi';
import { TratamientoSimulado } from '../hooks/useSimuladorState';

interface PanelSeleccionTratamientosProps {
  tratamientos: Tratamiento[];
  tratamientosSeleccionados: TratamientoSimulado[];
  onAgregarTratamiento: (tratamiento: Tratamiento) => void;
  loading?: boolean;
}

export default function PanelSeleccionTratamientos({
  tratamientos,
  tratamientosSeleccionados,
  onAgregarTratamiento,
  loading = false,
}: PanelSeleccionTratamientosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    const cats = new Set<string>();
    tratamientos.forEach((t) => {
      if (t.categoria) {
        cats.add(t.categoria);
      }
    });
    return Array.from(cats).sort();
  }, [tratamientos]);

  // Filtrar tratamientos
  const tratamientosFiltrados = useMemo(() => {
    return tratamientos.filter((tratamiento) => {
      const coincideBusqueda =
        busqueda === '' ||
        tratamiento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        tratamiento.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        tratamiento.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

      const coincideCategoria = categoriaFiltro === '' || tratamiento.categoria === categoriaFiltro;

      return coincideBusqueda && coincideCategoria;
    });
  }, [tratamientos, busqueda, categoriaFiltro]);

  // Verificar si un tratamiento ya está seleccionado
  const estaSeleccionado = (tratamientoId: string) => {
    return tratamientosSeleccionados.some((t) => t.tratamiento._id === tratamientoId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Seleccionar Tratamientos</h3>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar tratamiento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filtro por categoría */}
      {categorias.length > 0 && (
        <div className="mb-4">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Lista de tratamientos */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tratamientosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {busqueda || categoriaFiltro
              ? 'No se encontraron tratamientos con los filtros aplicados'
              : 'No hay tratamientos disponibles'}
          </div>
        ) : (
          <div className="space-y-2">
            {tratamientosFiltrados.map((tratamiento) => {
              const seleccionado = estaSeleccionado(tratamiento._id);
              return (
                <div
                  key={tratamiento._id}
                  className={`p-3 rounded-lg border transition-all ${
                    seleccionado
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{tratamiento.nombre}</h4>
                      {tratamiento.codigo && (
                        <p className="text-xs text-gray-500 mt-1">Código: {tratamiento.codigo}</p>
                      )}
                      {tratamiento.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{tratamiento.descripcion}</p>
                      )}
                      {tratamiento.categoria && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                          {tratamiento.categoria}
                        </span>
                      )}
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        {tratamiento.precio_base.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => onAgregarTratamiento(tratamiento)}
                      disabled={seleccionado}
                      className={`ml-4 p-2 rounded-lg transition-colors ${
                        seleccionado
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      aria-label="Agregar tratamiento"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {seleccionado && (
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      Ya agregado al plan
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}



