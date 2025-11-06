import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        <div className="flex items-center space-x-2">
          {tieneFiltrosActivos && (
            <button
              onClick={onLimpiarFiltros}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Limpiar</span>
            </button>
          )}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Prótesis
            </label>
            <select
              value={filtros.tipoProtesis || ''}
              onChange={(e) => handleFiltroChange('tipoProtesis', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio || ''}
              onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por ID de Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Paciente
            </label>
            <input
              type="text"
              value={filtros.pacienteId || ''}
              onChange={(e) => handleFiltroChange('pacienteId', e.target.value)}
              placeholder="Buscar por ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por ID de Laboratorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Laboratorio
            </label>
            <input
              type="text"
              value={filtros.laboratorioId || ''}
              onChange={(e) => handleFiltroChange('laboratorioId', e.target.value)}
              placeholder="Buscar por ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}


