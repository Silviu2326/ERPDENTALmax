import { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { FiltrosPagos } from '../api/pagosApi';

interface FiltrosHistorialPagosProps {
  filtros: FiltrosPagos;
  onFiltrosChange: (filtros: FiltrosPagos) => void;
  mostrarPaciente?: boolean;
  mostrarProfesional?: boolean;
}

export default function FiltrosHistorialPagos({
  filtros,
  onFiltrosChange,
  mostrarPaciente = false,
  mostrarProfesional = false,
}: FiltrosHistorialPagosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleChange = (key: keyof FiltrosPagos, value: any) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
      page: 1, // Resetear a primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 20,
    });
  };

  const tieneFiltrosActivos = 
    filtros.fechaInicio || 
    filtros.fechaFin || 
    filtros.metodoPago || 
    filtros.estado ||
    (mostrarProfesional && filtros.profesionalId) ||
    (mostrarPaciente && filtros.pacienteId);

  const metodosPago = [
    { value: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
    { value: 'tarjeta_debito', label: 'Tarjeta de Débito' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'financiacion', label: 'Financiación' },
  ];

  const estados = [
    { value: 'completado', label: 'Completado' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'fallido', label: 'Fallido' },
    { value: 'reembolsado', label: 'Reembolsado' },
  ];

  // Obtener fecha de inicio del mes actual
  const getFechaInicioMes = () => {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return primerDia.toISOString().split('T')[0];
  };

  // Obtener fecha de hoy
  const getFechaHoy = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {tieneFiltrosActivos && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              Activos
            </span>
          )}
        </button>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
                max={filtros.fechaFin || getFechaHoy()}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => handleChange('fechaInicio', getFechaInicioMes())}
              className="mt-1 text-xs text-blue-600 hover:text-blue-800"
            >
              Este mes
            </button>
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleChange('fechaFin', e.target.value)}
                min={filtros.fechaInicio}
                max={getFechaHoy()}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => handleChange('fechaFin', getFechaHoy())}
              className="mt-1 text-xs text-blue-600 hover:text-blue-800"
            >
              Hoy
            </button>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              value={filtros.metodoPago || ''}
              onChange={(e) => handleChange('metodoPago', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {metodosPago.map((metodo) => (
                <option key={metodo.value} value={metodo.value}>
                  {metodo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {tieneFiltrosActivos && !mostrarFiltros && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filtros.fechaInicio && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Desde: {new Date(filtros.fechaInicio).toLocaleDateString('es-ES')}
            </span>
          )}
          {filtros.fechaFin && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Hasta: {new Date(filtros.fechaFin).toLocaleDateString('es-ES')}
            </span>
          )}
          {filtros.metodoPago && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {metodosPago.find(m => m.value === filtros.metodoPago)?.label}
            </span>
          )}
          {filtros.estado && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {estados.find(e => e.value === filtros.estado)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}


