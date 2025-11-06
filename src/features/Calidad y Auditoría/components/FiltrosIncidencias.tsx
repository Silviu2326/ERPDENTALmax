import { Filter, X } from 'lucide-react';
import { FiltrosIncidencias as FiltrosIncidenciasType } from '../api/incidenciasApi';

interface FiltrosIncidenciasProps {
  filtros: FiltrosIncidenciasType;
  onFiltrosChange: (filtros: FiltrosIncidenciasType) => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosIncidencias({
  filtros,
  onFiltrosChange,
  clinicas = [],
}: FiltrosIncidenciasProps) {
  const tipos = [
    'No Conformidad Producto',
    'Incidencia Clínica',
    'Queja Paciente',
    'Incidente Seguridad',
  ] as const;

  const estados = ['Abierta', 'En Investigación', 'Resuelta', 'Cerrada'] as const;

  const handleChange = (campo: keyof FiltrosIncidenciasType, valor: string | undefined) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
      page: 1, // Resetear a primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltros = filtros.clinicaId || filtros.estado || filtros.tipo || filtros.fechaInicio || filtros.fechaFin;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        {tieneFiltros && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Clínica */}
        {clinicas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clínica
            </label>
            <select
              value={filtros.clinicaId || ''}
              onChange={(e) => handleChange('clinicaId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {clinicas.map((clinica) => (
                <option key={clinica._id} value={clinica._id}>
                  {clinica.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtro por Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={filtros.tipo || ''}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filtros.estado || ''}
            onChange={(e) => handleChange('estado', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fechaInicio || ''}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fechaFin || ''}
            onChange={(e) => handleChange('fechaFin', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}


