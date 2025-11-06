import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FiltrosFabricacion, EstadoFabricacion } from '../api/fabricacionApi';

interface FiltrosBusquedaFabricacionProps {
  filtros: FiltrosFabricacion;
  onFiltrosChange: (filtros: FiltrosFabricacion) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosBusquedaFabricacion({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
}: FiltrosBusquedaFabricacionProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados: EstadoFabricacion[] = [
    'Pendiente de Aceptación',
    'Recibido en laboratorio',
    'En Proceso',
    'Diseño CAD',
    'Fresado/Impresión',
    'Acabado y Pulido',
    'Control de Calidad',
    'Enviado a clínica',
    'Lista para Entrega',
    'Recibido en Clínica',
    'Cancelada',
  ];

  const handleFiltroChange = (key: keyof FiltrosFabricacion, value: string) => {
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
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
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

          {/* Filtro por Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Paciente
            </label>
            <input
              type="text"
              value={filtros.pacienteId || ''}
              onChange={(e) => handleFiltroChange('pacienteId', e.target.value)}
              placeholder="Buscar por ID de paciente"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por Laboratorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Laboratorio
            </label>
            <input
              type="text"
              value={filtros.laboratorioId || ''}
              onChange={(e) => handleFiltroChange('laboratorioId', e.target.value)}
              placeholder="Buscar por ID de laboratorio"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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

          {/* Filtro por Odontólogo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Odontólogo
            </label>
            <input
              type="text"
              value={filtros.odontologoId || ''}
              onChange={(e) => handleFiltroChange('odontologoId', e.target.value)}
              placeholder="Buscar por ID de odontólogo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}


