import { useState } from 'react';
import { Filter, X, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosRevisiones as IFiltrosRevisiones } from '../api/revisionesTecnicasApi';

interface FiltrosRevisionesProps {
  filtros: IFiltrosRevisiones;
  onFiltrosChange: (filtros: IFiltrosRevisiones) => void;
  sedes?: Array<{ _id: string; nombre: string }>;
  equipos?: Array<{ _id: string; nombre: string; marca?: string; modelo?: string }>;
}

export default function FiltrosRevisiones({
  filtros,
  onFiltrosChange,
  sedes = [],
  equipos = [],
}: FiltrosRevisionesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados = [
    { value: 'Programada', label: 'Programada' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Retrasada', label: 'Retrasada' },
    { value: 'Cancelada', label: 'Cancelada' },
  ];

  const handleChange = (key: keyof IFiltrosRevisiones, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const limpiarFiltros = () => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setHours(23, 59, 59, 999);

    onFiltrosChange({
      startDate: fechaInicio.toISOString(),
      endDate: fechaFin.toISOString(),
    });
  };

  const tieneFiltrosActivos = filtros.sedeId || filtros.equipoId || filtros.estado;

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('startDate', e.target.value ? new Date(e.target.value).toISOString() : '');
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('endDate', e.target.value ? new Date(e.target.value).toISOString() : '');
  };

  const filtrosActivosCount = [filtros.sedeId, filtros.equipoId, filtros.estado].filter(Boolean).length;

  return (
    <div className="mb-6 bg-white shadow-sm rounded-lg">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="ml-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {filtrosActivosCount}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>

            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-red-600 hover:bg-white/70"
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.startDate ? new Date(filtros.startDate).toISOString().split('T')[0] : ''}
                  onChange={handleFechaInicioChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.endDate ? new Date(filtros.endDate).toISOString().split('T')[0] : ''}
                  onChange={handleFechaFinChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sede
                </label>
                <select
                  value={filtros.sedeId || ''}
                  onChange={(e) => handleChange('sedeId', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map((sede) => (
                    <option key={sede._id} value={sede._id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Equipo
                </label>
                <select
                  value={filtros.equipoId || ''}
                  onChange={(e) => handleChange('equipoId', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los equipos</option>
                  {equipos.map((equipo) => (
                    <option key={equipo._id} value={equipo._id}>
                      {equipo.nombre} {equipo.marca && equipo.modelo ? `(${equipo.marca} ${equipo.modelo})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleChange('estado', e.target.value as any)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resumen de filtros */}
            {filtrosActivosCount > 0 && (
              <div className="flex justify-end items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filtrosActivosCount} filtros aplicados</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



