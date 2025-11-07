import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, User, Building2, Calendar } from 'lucide-react';
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

  const filtrosActivosCount = [
    filtros.pacienteId,
    filtros.mutuaId,
    filtros.estado,
    filtros.fechaDesde,
    filtros.fechaHasta,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código de solicitud o autorización..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
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
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                tieneFiltrosActivos
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100'
                  : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50'
              }`}
            >
              <Filter size={18} className="opacity-70" />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs font-medium rounded-full px-2 py-0.5">
                  {filtrosActivosCount}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={16} className="opacity-70" />
              ) : (
                <ChevronDown size={16} className="opacity-70" />
              )}
            </button>
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-300 rounded-xl hover:bg-slate-50 transition-all"
              >
                <X size={16} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por paciente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Paciente
                </label>
                <select
                  value={filtros.pacienteId || ''}
                  onChange={(e) => handleFiltroChange('pacienteId', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Building2 size={16} className="inline mr-1" />
                  Mutua/Seguro
                </label>
                <select
                  value={filtros.mutuaId || ''}
                  onChange={(e) => handleFiltroChange('mutuaId', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por rango de fechas */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={filtros.fechaDesde || ''}
                  onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Filtro fecha hasta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={filtros.fechaHasta || ''}
                  onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            {tieneFiltrosActivos && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filtrosActivosCount} filtros aplicados</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



