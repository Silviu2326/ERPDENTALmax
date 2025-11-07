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
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-xl ring-1 ring-slate-300 hover:bg-slate-50 transition-all"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {[
                    filtros.fechaInicio ? 1 : 0,
                    filtros.fechaFin ? 1 : 0,
                    filtros.metodoPago ? 1 : 0,
                    filtros.estado ? 1 : 0,
                    (mostrarProfesional && filtros.profesionalId) ? 1 : 0,
                    (mostrarPaciente && filtros.pacienteId) ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filtros.fechaInicio || ''}
                    onChange={(e) => handleChange('fechaInicio', e.target.value)}
                    max={filtros.fechaFin || getFechaHoy()}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filtros.fechaFin || ''}
                    onChange={(e) => handleChange('fechaFin', e.target.value)}
                    min={filtros.fechaInicio}
                    max={getFechaHoy()}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Método de Pago
                </label>
                <select
                  value={filtros.metodoPago || ''}
                  onChange={(e) => handleChange('metodoPago', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>Filtros aplicados</span>
            <div className="flex flex-wrap gap-2">

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
          </div>
        )}
      </div>
    </div>
  );
}



