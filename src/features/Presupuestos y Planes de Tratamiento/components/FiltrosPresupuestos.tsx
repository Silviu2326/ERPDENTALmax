import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { FiltrosPresupuestos as FiltrosPresupuestosType } from '../api/presupuestosApi';

interface FiltrosPresupuestosProps {
  filtros: FiltrosPresupuestosType;
  onFiltrosChange: (filtros: FiltrosPresupuestosType) => void;
  profesionales: Array<{ _id: string; nombre: string; apellidos: string }>;
  sedes: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosPresupuestos({
  filtros,
  onFiltrosChange,
  profesionales,
  sedes,
}: FiltrosPresupuestosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados = ['Pendiente', 'Aceptado', 'Rechazado', 'Completado', 'Anulado'] as const;

  const handleFiltroChange = (campo: keyof FiltrosPresupuestosType, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor === '' ? undefined : valor,
      page: 1, // Resetear a la primera página cuando se cambian los filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: 10,
    });
  };

  const tieneFiltrosActivos = Boolean(
    filtros.estado || filtros.pacienteId || filtros.profesionalId || filtros.sedeId || filtros.fechaDesde || filtros.fechaHasta
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-semibold">Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todos</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Profesional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profesional
            </label>
            <select
              value={filtros.profesionalId || ''}
              onChange={(e) => handleFiltroChange('profesionalId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todos</option>
              {profesionales.map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.nombre} {prof.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Sede */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sede
            </label>
            <select
              value={filtros.sedeId || ''}
              onChange={(e) => handleFiltroChange('sedeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todas</option>
              {sedes.map((sede) => (
                <option key={sede._id} value={sede._id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde || ''}
              onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filtro por Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta || ''}
              onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}


