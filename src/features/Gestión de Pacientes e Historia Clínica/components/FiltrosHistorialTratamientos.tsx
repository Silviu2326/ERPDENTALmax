import { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { FiltrosTratamientosRealizados } from '../api/tratamientosRealizadosApi';

interface FiltrosHistorialTratamientosProps {
  filtros: FiltrosTratamientosRealizados;
  onFiltrosChange: (filtros: FiltrosTratamientosRealizados) => void;
  odontologos?: Array<{ _id: string; nombre: string; apellidos: string }>;
}

export default function FiltrosHistorialTratamientos({
  filtros,
  onFiltrosChange,
  odontologos = [],
}: FiltrosHistorialTratamientosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaInicio: e.target.value || undefined,
      page: 1, // Resetear a página 1
    });
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaFin: e.target.value || undefined,
      page: 1,
    });
  };

  const handleOdontologoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      odontologoId: e.target.value || undefined,
      page: 1,
    });
  };

  const handlePiezaDentalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      piezaDental: e.target.value || undefined,
      page: 1,
    });
  };

  const handleEstadoPagoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      estadoPago: e.target.value || undefined,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: filtros.page || 1,
      limit: filtros.limit || 20,
    });
  };

  const tieneFiltrosActivos = 
    filtros.fechaInicio || 
    filtros.fechaFin || 
    filtros.odontologoId || 
    filtros.piezaDental || 
    filtros.estadoPago;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio || ''}
              onChange={handleFechaInicioChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin || ''}
              onChange={handleFechaFinChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Odontólogo */}
          {odontologos.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Odontólogo
              </label>
              <select
                value={filtros.odontologoId || ''}
                onChange={handleOdontologoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                {odontologos.map((odontologo) => (
                  <option key={odontologo._id} value={odontologo._id}>
                    {odontologo.nombre} {odontologo.apellidos}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pieza Dental */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pieza Dental
            </label>
            <input
              type="text"
              value={filtros.piezaDental || ''}
              onChange={handlePiezaDentalChange}
              placeholder="Ej: 11, 21, 36..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Estado de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado de Pago
            </label>
            <select
              value={filtros.estadoPago || ''}
              onChange={handleEstadoPagoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado Parcial">Pagado Parcial</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}


