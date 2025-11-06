import { useState, useEffect } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { FiltrosReporteComisiones, ProfesionalComision } from '../api/comisionesApi';
import { obtenerProfesionalesComision, obtenerSedes } from '../api/comisionesApi';

interface FiltrosComisionesProps {
  filtros: FiltrosReporteComisiones;
  onFiltrosChange: (filtros: FiltrosReporteComisiones) => void;
  onAplicarFiltros: () => void;
  loading?: boolean;
}

export default function FiltrosComisiones({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  loading = false,
}: FiltrosComisionesProps) {
  const [profesionales, setProfesionales] = useState<ProfesionalComision[]>([]);
  const [sedes, setSedes] = useState<Array<{ _id: string; nombre: string }>>([]);
  const [loadingProfesionales, setLoadingProfesionales] = useState(false);
  const [loadingSedes, setLoadingSedes] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingProfesionales(true);
      setLoadingSedes(true);

      try {
        const [profesionalesData, sedesData] = await Promise.all([
          obtenerProfesionalesComision().catch(() => []),
          obtenerSedes().catch(() => []),
        ]);

        setProfesionales(profesionalesData);
        setSedes(sedesData);
      } catch (error) {
        console.error('Error al cargar datos de filtros:', error);
      } finally {
        setLoadingProfesionales(false);
        setLoadingSedes(false);
      }
    };

    cargarDatos();
  }, []);

  const handleCambioFiltro = (campo: keyof FiltrosReporteComisiones, valor: string | undefined) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
    });
  };

  const limpiarFiltros = () => {
    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    onFiltrosChange({
      fechaInicio: primerDiaMes.toISOString().split('T')[0],
      fechaFin: ultimoDiaMes.toISOString().split('T')[0],
      profesionalId: undefined,
      sedeId: undefined,
      estadoLiquidacion: undefined,
    });
  };

  const tieneFiltrosAdicionales = filtros.profesionalId || filtros.sedeId || filtros.estadoLiquidacion;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
        </div>
        {tieneFiltrosAdicionales && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => handleCambioFiltro('fechaInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => handleCambioFiltro('fechaFin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Profesional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profesional</label>
          <select
            value={filtros.profesionalId || ''}
            onChange={(e) => handleCambioFiltro('profesionalId', e.target.value || undefined)}
            disabled={loadingProfesionales}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Todos los profesionales</option>
            {profesionales.map((prof) => (
              <option key={prof._id} value={prof._id}>
                {prof.nombre} {prof.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* Sede */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sede</label>
          <select
            value={filtros.sedeId || ''}
            onChange={(e) => handleCambioFiltro('sedeId', e.target.value || undefined)}
            disabled={loadingSedes}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Todas las sedes</option>
            {sedes.map((sede) => (
              <option key={sede._id} value={sede._id}>
                {sede.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estado de Liquidación */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Liquidación</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="estadoLiquidacion"
              value=""
              checked={!filtros.estadoLiquidacion}
              onChange={() => handleCambioFiltro('estadoLiquidacion', undefined)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Todos</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="estadoLiquidacion"
              value="pendiente"
              checked={filtros.estadoLiquidacion === 'pendiente'}
              onChange={(e) => handleCambioFiltro('estadoLiquidacion', e.target.value as 'pendiente')}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Pendientes</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="estadoLiquidacion"
              value="liquidado"
              checked={filtros.estadoLiquidacion === 'liquidado'}
              onChange={(e) => handleCambioFiltro('estadoLiquidacion', e.target.value as 'liquidado')}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Liquidadas</span>
          </label>
        </div>
      </div>

      {/* Botón Aplicar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onAplicarFiltros}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Cargando...</span>
            </span>
          ) : (
            'Aplicar Filtros'
          )}
        </button>
      </div>
    </div>
  );
}


