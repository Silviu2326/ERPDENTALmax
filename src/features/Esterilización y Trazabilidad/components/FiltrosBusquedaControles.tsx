import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
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

  const filtrosActivosCount = [
    filtros.fechaInicio,
    filtros.fechaFin,
    filtros.tipoControl,
    filtros.resultado,
    filtros.idEsterilizador,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-0">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda - placeholder para futura implementación */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar controles..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                disabled
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {filtrosActivosCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {filtrosActivosCount}
                </span>
              )}
              {mostrarFiltros ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
              >
                <X size={18} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin || ''}
                  onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Tipo de Control */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Control
                </label>
                <select
                  value={filtros.tipoControl || ''}
                  onChange={(e) => handleFiltroChange('tipoControl', e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="biologico">Biológico</option>
                  <option value="quimico">Químico</option>
                </select>
              </div>

              {/* Resultado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resultado
                </label>
                <select
                  value={filtros.resultado || ''}
                  onChange={(e) => handleFiltroChange('resultado', e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Autoclave
                </label>
                <select
                  value={filtros.idEsterilizador || ''}
                  onChange={(e) => handleFiltroChange('idEsterilizador', e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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

            {/* Resumen de resultados */}
            {tieneFiltrosActivos && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filtrosActivosCount} {filtrosActivosCount === 1 ? 'filtro aplicado' : 'filtros aplicados'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

