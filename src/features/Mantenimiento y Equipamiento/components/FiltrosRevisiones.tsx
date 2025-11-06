import { useState } from 'react';
import { Filter, X, Calendar } from 'lucide-react';
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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.startDate ? new Date(filtros.startDate).toISOString().split('T')[0] : ''}
              onChange={handleFechaInicioChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.endDate ? new Date(filtros.endDate).toISOString().split('T')[0] : ''}
              onChange={handleFechaFinChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
              Equipo
            </label>
            <select
              value={filtros.equipoId || ''}
              onChange={(e) => handleChange('equipoId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleChange('estado', e.target.value as any)}
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


