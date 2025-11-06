import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { FiltrosCampana as FiltrosCampanaType } from '../api/campanasApi';

interface FiltrosCampanaProps {
  filtros: FiltrosCampanaType;
  onFiltrosChange: (filtros: FiltrosCampanaType) => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosCampana({ filtros, onFiltrosChange, clinicas = [] }: FiltrosCampanaProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleCambio = (campo: keyof FiltrosCampanaType, valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const tieneFiltros = filtros.status || filtros.clinicaId || filtros.fechaInicio || filtros.fechaFin;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar campañas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              tieneFiltros
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {tieneFiltros && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {[filtros.status, filtros.clinicaId, filtros.fechaInicio, filtros.fechaFin].filter(Boolean).length}
              </span>
            )}
          </button>
          {tieneFiltros && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filtros.status || ''}
              onChange={(e) => handleCambio('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="Planificada">Planificada</option>
              <option value="Activa">Activa</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Archivada">Archivada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clínica</label>
            <select
              value={filtros.clinicaId || ''}
              onChange={(e) => handleCambio('clinicaId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              {clinicas.map((clinica) => (
                <option key={clinica._id} value={clinica._id}>
                  {clinica.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={filtros.fechaInicio || ''}
              onChange={(e) => handleCambio('fechaInicio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={filtros.fechaFin || ''}
              onChange={(e) => handleCambio('fechaFin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}


