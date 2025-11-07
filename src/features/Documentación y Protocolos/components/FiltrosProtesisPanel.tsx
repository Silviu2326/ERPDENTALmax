import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosProtesis, EstadoProtesis } from '../api/protesisApi';

interface FiltrosProtesisPanelProps {
  filtros: FiltrosProtesis;
  onFiltrosChange: (filtros: FiltrosProtesis) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosProtesisPanel({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
}: FiltrosProtesisPanelProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados: EstadoProtesis[] = [
    'Prescrita',
    'Enviada a Laboratorio',
    'Recibida de Laboratorio',
    'Prueba en Paciente',
    'Ajustes en Laboratorio',
    'Instalada',
    'Cancelada',
  ];

  const tiposProtesis = [
    'Corona',
    'Puente',
    'Implante',
    'Prótesis Removible',
    'Prótesis Fija',
    'Carilla',
    'Inlay/Onlay',
  ];

  const handleFiltroChange = (key: keyof FiltrosProtesis, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const tieneFiltrosActivos = Object.values(filtros).some((v) => v !== undefined && v !== '');
  const cantidadFiltrosActivos = Object.values(filtros).filter((v) => v !== undefined && v !== '').length;

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda - placeholder para futura implementación */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por paciente, tipo, material..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {cantidadFiltrosActivos > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                  {cantidadFiltrosActivos}
                </span>
              )}
              {mostrarFiltros ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltrosActivos && (
              <button
                onClick={onLimpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-red-600 hover:bg-red-50 ring-1 ring-red-200"
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
              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Tipo de Prótesis */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Prótesis
                </label>
                <select
                  value={filtros.tipoProtesis || ''}
                  onChange={(e) => handleFiltroChange('tipoProtesis', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los tipos</option>
                  {tiposProtesis.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin || ''}
                  onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por ID de Paciente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ID Paciente
                </label>
                <input
                  type="text"
                  value={filtros.pacienteId || ''}
                  onChange={(e) => handleFiltroChange('pacienteId', e.target.value)}
                  placeholder="Buscar por ID..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro por ID de Laboratorio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ID Laboratorio
                </label>
                <input
                  type="text"
                  value={filtros.laboratorioId || ''}
                  onChange={(e) => handleFiltroChange('laboratorioId', e.target.value)}
                  placeholder="Buscar por ID..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{cantidadFiltrosActivos} filtro{cantidadFiltrosActivos > 1 ? 's' : ''} aplicado{cantidadFiltrosActivos > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}



