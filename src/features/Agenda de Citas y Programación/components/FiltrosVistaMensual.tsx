import { useState } from 'react';
import { Filter, X, Users, MapPin, AlertCircle } from 'lucide-react';
import { FiltrosResumenMensual } from '../api/citasApi';

interface FiltrosVistaMensualProps {
  filtros: FiltrosResumenMensual;
  onFiltrosChange: (filtros: FiltrosResumenMensual) => void;
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string }>;
  sedes?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosVistaMensual({
  filtros,
  onFiltrosChange,
  profesionales = [],
  sedes = [],
}: FiltrosVistaMensualProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados = [
    { value: 'programada', label: 'Programada' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'realizada', label: 'Realizada' },
    { value: 'no-asistio', label: 'No Asistió' },
  ];

  const handleChange = (key: keyof FiltrosResumenMensual, value: string | number) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const limpiarFiltros = () => {
    // Mantener mes y año, solo limpiar los filtros opcionales
    onFiltrosChange({
      mes: filtros.mes,
      anio: filtros.anio,
    });
  };

  const tieneFiltrosActivos = filtros.profesionalId || filtros.sedeId || filtros.estado;

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 items-center justify-between">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {[filtros.profesionalId, filtros.sedeId, filtros.estado].filter(Boolean).length}
                </span>
              )}
            </button>

            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
              >
                <X className="w-5 h-5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de Filtros Avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Profesional
                </label>
                <select
                  value={filtros.profesionalId || ''}
                  onChange={(e) => handleChange('profesionalId', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los profesionales</option>
                  {profesionales.map((prof) => (
                    <option key={prof._id} value={prof._id}>
                      {prof.nombre} {prof.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
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
                  <AlertCircle size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleChange('estado', e.target.value)}
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
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>Filtros aplicados: {[filtros.profesionalId, filtros.sedeId, filtros.estado].filter(Boolean).length}</span>
            <div className="flex flex-wrap gap-2">
              {filtros.profesionalId && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Profesional
                </span>
              )}
              {filtros.sedeId && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Sede
                </span>
              )}
              {filtros.estado && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {estados.find(e => e.value === filtros.estado)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

