import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, Calendar, User, Building2, Stethoscope } from 'lucide-react';
import { FiltrosFabricacion, EstadoFabricacion } from '../api/fabricacionApi';

interface FiltrosBusquedaFabricacionProps {
  filtros: FiltrosFabricacion;
  onFiltrosChange: (filtros: FiltrosFabricacion) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosBusquedaFabricacion({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
}: FiltrosBusquedaFabricacionProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados: EstadoFabricacion[] = [
    'Pendiente de Aceptación',
    'Recibido en laboratorio',
    'En Proceso',
    'Diseño CAD',
    'Fresado/Impresión',
    'Acabado y Pulido',
    'Control de Calidad',
    'Enviado a clínica',
    'Lista para Entrega',
    'Recibido en Clínica',
    'Cancelada',
  ];

  const handleFiltroChange = (key: keyof FiltrosFabricacion, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const tieneFiltrosActivos = Object.values(filtros).some((v) => v !== undefined && v !== '');
  const numFiltrosActivos = Object.values(filtros).filter((v) => v !== undefined && v !== '').length;

  return (
    <div className="mb-6 bg-white shadow-sm rounded-lg">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar órdenes de fabricación..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              {numFiltrosActivos > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {numFiltrosActivos}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltrosActivos && (
              <button
                onClick={onLimpiarFiltros}
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
              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Paciente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  ID Paciente
                </label>
                <input
                  type="text"
                  value={filtros.pacienteId || ''}
                  onChange={(e) => handleFiltroChange('pacienteId', e.target.value)}
                  placeholder="Buscar por ID de paciente"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por Laboratorio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Building2 size={16} className="inline mr-1" />
                  ID Laboratorio
                </label>
                <input
                  type="text"
                  value={filtros.laboratorioId || ''}
                  onChange={(e) => handleFiltroChange('laboratorioId', e.target.value)}
                  placeholder="Buscar por ID de laboratorio"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin || ''}
                  onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por Odontólogo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Stethoscope size={16} className="inline mr-1" />
                  ID Odontólogo
                </label>
                <input
                  type="text"
                  value={filtros.odontologoId || ''}
                  onChange={(e) => handleFiltroChange('odontologoId', e.target.value)}
                  placeholder="Buscar por ID de odontólogo"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            {tieneFiltrosActivos && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{numFiltrosActivos} filtro{numFiltrosActivos > 1 ? 's' : ''} aplicado{numFiltrosActivos > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



