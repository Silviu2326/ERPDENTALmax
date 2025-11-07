import { useState, useEffect } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { FiltrosProductividad } from '../api/reportesProductividadApi';

interface FiltroProductividadProps {
  filtros: FiltrosProductividad;
  onFiltrosChange: (filtros: FiltrosProductividad) => void;
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string }>;
  sedes?: Array<{ _id: string; nombre: string }>;
  loading?: boolean;
}

export default function FiltroProductividad({
  filtros,
  onFiltrosChange,
  profesionales = [],
  sedes = [],
  loading = false,
}: FiltroProductividadProps) {
  // Inicializar con el mes actual por defecto
  const getDefaultDateRange = () => {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    return {
      fechaInicio: primerDiaMes.toISOString().split('T')[0],
      fechaFin: ultimoDiaMes.toISOString().split('T')[0],
    };
  };

  const [fechaInicio, setFechaInicio] = useState(filtros.fechaInicio || getDefaultDateRange().fechaInicio);
  const [fechaFin, setFechaFin] = useState(filtros.fechaFin || getDefaultDateRange().fechaFin);
  const [profesionalId, setProfesionalId] = useState(filtros.profesionalId || '');
  const [sedeId, setSedeId] = useState(filtros.sedeId || '');

  useEffect(() => {
    onFiltrosChange({
      fechaInicio,
      fechaFin,
      profesionalId: profesionalId || undefined,
      sedeId: sedeId || undefined,
    });
  }, [fechaInicio, fechaFin, profesionalId, sedeId]);

  const limpiarFiltros = () => {
    const defaultRange = getDefaultDateRange();
    setFechaInicio(defaultRange.fechaInicio);
    setFechaFin(defaultRange.fechaFin);
    setProfesionalId('');
    setSedeId('');
  };

  const aplicarFiltrosRapidos = (tipo: 'mes' | 'trimestre' | 'ano') => {
    const hoy = new Date();
    let fechaInicioRapida: Date;
    let fechaFinRapida: Date = hoy;

    switch (tipo) {
      case 'mes':
        fechaInicioRapida = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
      case 'trimestre':
        const mesActual = hoy.getMonth();
        const trimestreInicio = Math.floor(mesActual / 3) * 3;
        fechaInicioRapida = new Date(hoy.getFullYear(), trimestreInicio, 1);
        break;
      case 'ano':
        fechaInicioRapida = new Date(hoy.getFullYear(), 0, 1);
        break;
    }

    setFechaInicio(fechaInicioRapida.toISOString().split('T')[0]);
    setFechaFin(fechaFinRapida.toISOString().split('T')[0]);
  };

  const tieneFiltrosActivos = profesionalId || sedeId;

  return (
    <div className="bg-white shadow-sm rounded-xl p-0">
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          {tieneFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X size={16} />
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rango de fechas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
              disabled={loading}
            />
          </div>

          {/* Selector de profesional */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Profesional
            </label>
            <select
              value={profesionalId}
              onChange={(e) => setProfesionalId(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
              disabled={loading}
            >
              <option value="">Todos los profesionales</option>
              {profesionales.map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.nombre} {prof.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de sede */}
          {sedes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sede
              </label>
              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
                disabled={loading}
              >
                <option value="">Todas las sedes</option>
                {sedes.map((sede) => (
                  <option key={sede._id} value={sede._id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-2">Períodos rápidos:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => aplicarFiltrosRapidos('mes')}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all"
              disabled={loading}
            >
              Este mes
            </button>
            <button
              onClick={() => aplicarFiltrosRapidos('trimestre')}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all"
              disabled={loading}
            >
              Este trimestre
            </button>
            <button
              onClick={() => aplicarFiltrosRapidos('ano')}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all"
              disabled={loading}
            >
              Este año
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



