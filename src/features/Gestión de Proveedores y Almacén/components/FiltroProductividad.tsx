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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        <button
          onClick={limpiarFiltros}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Limpiar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rango de fechas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Selector de profesional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profesional
          </label>
          <select
            value={profesionalId}
            onChange={(e) => setProfesionalId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sede
            </label>
            <select
              value={sedeId}
              onChange={(e) => setSedeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Períodos rápidos:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => aplicarFiltrosRapidos('mes')}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            disabled={loading}
          >
            Este mes
          </button>
          <button
            onClick={() => aplicarFiltrosRapidos('trimestre')}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            disabled={loading}
          >
            Este trimestre
          </button>
          <button
            onClick={() => aplicarFiltrosRapidos('ano')}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            disabled={loading}
          >
            Este año
          </button>
        </div>
      </div>
    </div>
  );
}


