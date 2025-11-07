import { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';

export interface Mutua {
  _id: string;
  nombre: string;
  cif?: string;
}

export interface FiltrosLiquidacion {
  mutuaId: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface FiltroLiquidacionProps {
  filtros: FiltrosLiquidacion;
  onFiltrosChange: (filtros: FiltrosLiquidacion) => void;
  mutuas: Mutua[];
  loading?: boolean;
}

export default function FiltroLiquidacion({
  filtros,
  onFiltrosChange,
  mutuas,
  loading = false,
}: FiltroLiquidacionProps) {
  const [mutuaId, setMutuaId] = useState(filtros.mutuaId);
  const [fechaDesde, setFechaDesde] = useState(filtros.fechaDesde);
  const [fechaHasta, setFechaHasta] = useState(filtros.fechaHasta);

  // Inicializar fechas con el mes actual si no están definidas
  useEffect(() => {
    if (!filtros.fechaDesde || !filtros.fechaHasta) {
      const ahora = new Date();
      const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

      setFechaDesde(primerDiaMes.toISOString().split('T')[0]);
      setFechaHasta(ultimoDiaMes.toISOString().split('T')[0]);
    }
  }, []);

  useEffect(() => {
    if (mutuaId && fechaDesde && fechaHasta) {
      onFiltrosChange({
        mutuaId,
        fechaDesde,
        fechaHasta,
      });
    }
  }, [mutuaId, fechaDesde, fechaHasta]);

  const handleBuscar = () => {
    if (mutuaId && fechaDesde && fechaHasta) {
      onFiltrosChange({
        mutuaId,
        fechaDesde,
        fechaHasta,
      });
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Selector de Mutua */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Search size={16} className="inline mr-1" />
                  Mutua/Seguro <span className="text-red-500">*</span>
                </label>
                <select
                  value={mutuaId}
                  onChange={(e) => setMutuaId(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione una mutua</option>
                  {mutuas.map((mutua) => (
                    <option key={mutua._id} value={mutua._id}>
                      {mutua.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha Desde */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Desde <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Fecha Hasta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Hasta <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Botón Buscar */}
            <div className="flex items-end">
              <button
                onClick={handleBuscar}
                disabled={loading || !mutuaId || !fechaDesde || !fechaHasta}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm font-medium flex items-center justify-center space-x-2"
              >
                <Search size={18} />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de resultados */}
        {filtros.mutuaId && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>
              <span className="font-medium">Mutua seleccionada:</span>{' '}
              {mutuas.find((m) => m._id === filtros.mutuaId)?.nombre || 'N/A'}
            </span>
            <span>
              Período: {new Date(filtros.fechaDesde).toLocaleDateString('es-ES')} -{' '}
              {new Date(filtros.fechaHasta).toLocaleDateString('es-ES')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}



