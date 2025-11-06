import { useState } from 'react';
import { Filter, X } from 'lucide-react';
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>

        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesional
            </label>
            <select
              value={filtros.profesionalId || ''}
              onChange={(e) => handleChange('profesionalId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sede
            </label>
            <select
              value={filtros.sedeId || ''}
              onChange={(e) => handleChange('sedeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      )}
    </div>
  );
}

