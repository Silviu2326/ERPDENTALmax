import { useState } from 'react';
import { Filter, X, Calendar, User, Activity, MapPin } from 'lucide-react';
import { FiltrosRegistroAccesos, obtenerTiposAccion } from '../api/accesosApi';

interface FiltrosRegistroAccesosProps {
  filtros: FiltrosRegistroAccesos;
  onFiltrosChange: (filtros: FiltrosRegistroAccesos) => void;
  usuarios?: Array<{ _id: string; nombre: string; apellidos?: string }>;
  sedes?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosRegistroAccesos({
  filtros,
  onFiltrosChange,
  usuarios = [],
  sedes = [],
}: FiltrosRegistroAccesosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const tiposAccion = obtenerTiposAccion();

  const handleChange = (key: keyof FiltrosRegistroAccesos, value: string | number | undefined) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const limpiarFiltros = () => {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 7); // Últimos 7 días por defecto
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    onFiltrosChange({
      page: 1,
      limit: 20,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      sortBy: 'timestamp',
      sortOrder: 'desc',
    });
  };

  const tieneFiltrosActivos =
    filtros.usuarioId || filtros.tipoAccion || filtros.sedeId || filtros.fechaInicio || filtros.fechaFin;

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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Usuario
            </label>
            <select
              value={filtros.usuarioId || ''}
              onChange={(e) => handleChange('usuarioId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los usuarios</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre} {usuario.apellidos || ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4 inline mr-1" />
              Tipo de Acción
            </label>
            <select
              value={filtros.tipoAccion || ''}
              onChange={(e) => handleChange('tipoAccion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las acciones</option>
              {tiposAccion.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
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
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha Inicio
            </label>
            <input
              type="datetime-local"
              value={filtros.fechaInicio ? new Date(filtros.fechaInicio).toISOString().slice(0, 16) : ''}
              onChange={(e) =>
                handleChange('fechaInicio', e.target.value ? new Date(e.target.value).toISOString() : undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha Fin
            </label>
            <input
              type="datetime-local"
              value={filtros.fechaFin ? new Date(filtros.fechaFin).toISOString().slice(0, 16) : ''}
              onChange={(e) =>
                handleChange('fechaFin', e.target.value ? new Date(e.target.value).toISOString() : undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={filtros.sortBy || 'timestamp'}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="timestamp">Fecha y Hora</option>
              <option value="nombreUsuario">Usuario</option>
              <option value="tipoAccion">Tipo de Acción</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <select
              value={filtros.sortOrder || 'desc'}
              onChange={(e) => handleChange('sortOrder', e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}



