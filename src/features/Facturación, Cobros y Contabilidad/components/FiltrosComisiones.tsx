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
    <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-0">
      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-600" />
              <h3 className="text-sm font-medium text-slate-700">Filtros de Búsqueda</h3>
            </div>
            {tieneFiltrosAdicionales && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X size={16} />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>

          {/* Panel de Filtros Avanzados */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => handleCambioFiltro('fechaInicio', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => handleCambioFiltro('fechaFin', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Profesional */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Profesional</label>
                <select
                  value={filtros.profesionalId || ''}
                  onChange={(e) => handleCambioFiltro('profesionalId', e.target.value || undefined)}
                  disabled={loadingProfesionales}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Sede</label>
                <select
                  value={filtros.sedeId || ''}
                  onChange={(e) => handleCambioFiltro('sedeId', e.target.value || undefined)}
                  disabled={loadingSedes}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map((sede) => (
                    <option key={sede._id} value={sede._id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado de Liquidación */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado de Liquidación</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="estadoLiquidacion"
                      value=""
                      checked={!filtros.estadoLiquidacion}
                      onChange={() => handleCambioFiltro('estadoLiquidacion', undefined)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Todos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="estadoLiquidacion"
                      value="pendiente"
                      checked={filtros.estadoLiquidacion === 'pendiente'}
                      onChange={(e) => handleCambioFiltro('estadoLiquidacion', e.target.value as 'pendiente')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Pendientes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="estadoLiquidacion"
                      value="liquidado"
                      checked={filtros.estadoLiquidacion === 'liquidado'}
                      onChange={(e) => handleCambioFiltro('estadoLiquidacion', e.target.value as 'liquidado')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Liquidadas</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Botón Aplicar */}
            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={onAplicarFiltros}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Cargando...</span>
                  </span>
                ) : (
                  'Aplicar Filtros'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



