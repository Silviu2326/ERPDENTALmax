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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Filtros de Liquidación</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Selector de Mutua */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mutua/Seguro <span className="text-red-500">*</span>
          </label>
          <select
            value={mutuaId}
            onChange={(e) => setMutuaId(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Desde <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Hasta <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Botón Buscar */}
        <div className="flex items-end">
          <button
            onClick={handleBuscar}
            disabled={loading || !mutuaId || !fechaDesde || !fechaHasta}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md font-medium flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {filtros.mutuaId && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Mutua seleccionada:</span>{' '}
            {mutuas.find((m) => m._id === filtros.mutuaId)?.nombre || 'N/A'}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Período: {new Date(filtros.fechaDesde).toLocaleDateString('es-ES')} -{' '}
            {new Date(filtros.fechaHasta).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}
    </div>
  );
}


