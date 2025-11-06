import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FiltrosAutorizaciones } from '../api/autorizacionesApi';

interface FiltrosAutorizacionesProps {
  filtros: FiltrosAutorizaciones;
  onFiltrosChange: (filtros: FiltrosAutorizaciones) => void;
  pacientes?: Array<{ _id: string; nombre: string; apellidos: string }>;
  mutuas?: Array<{ _id: string; nombreComercial: string }>;
}

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Aprobada', label: 'Aprobada' },
  { value: 'Rechazada', label: 'Rechazada' },
  { value: 'Requiere Información Adicional', label: 'Requiere Información Adicional' },
];

export default function FiltrosAutorizacionesComponent({
  filtros,
  onFiltrosChange,
  pacientes = [],
  mutuas = [],
}: FiltrosAutorizacionesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const handleFiltroChange = (campo: keyof FiltrosAutorizaciones, valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
    setBusqueda('');
  };

  const tieneFiltrosActivos = !!(
    filtros.pacienteId ||
    filtros.mutuaId ||
    filtros.estado ||
    filtros.fechaDesde ||
    filtros.fechaHasta
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
      {/* Barra de búsqueda y botón de filtros */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código de solicitud o autorización..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // Aquí se podría implementar búsqueda por código
                // Por ahora solo manejamos filtros
              }
            }}
          />
        </div>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            tieneFiltrosActivos
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              Activos
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Panel de filtros expandible */}
      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paciente
            </label>
            <select
              value={filtros.pacienteId || ''}
              onChange={(e) => handleFiltroChange('pacienteId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los pacientes</option>
              {pacientes.map((paciente) => (
                <option key={paciente._id} value={paciente._id}>
                  {paciente.nombre} {paciente.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por mutua */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mutua/Seguro
            </label>
            <select
              value={filtros.mutuaId || ''}
              onChange={(e) => handleFiltroChange('mutuaId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las mutuas</option>
              {mutuas.map((mutua) => (
                <option key={mutua._id} value={mutua._id}>
                  {mutua.nombreComercial}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ESTADOS.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por rango de fechas */}
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde || ''}
              onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro fecha hasta */}
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta || ''}
              onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}


