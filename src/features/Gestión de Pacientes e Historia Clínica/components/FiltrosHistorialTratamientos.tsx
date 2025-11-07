import { useState } from 'react';
import { Calendar, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
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

  const numFiltrosActivos = [
    filtros.fechaInicio,
    filtros.fechaFin,
    filtros.odontologoId,
    filtros.piezaDental,
    filtros.estadoPago,
  ].filter(Boolean).length;

  return (
    <div className="mb-6 bg-white shadow-sm rounded-lg">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white/70 rounded-xl transition-all"
            >
              <Filter size={18} className={mostrarFiltros ? 'opacity-100' : 'opacity-70'} />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {numFiltrosActivos}
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
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 rounded-xl transition-all"
              >
                <X size={16} />
                <span>Limpiar filtros</span>
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
                <input
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={handleFechaInicioChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin || ''}
                  onChange={handleFechaFinChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Odontólogo */}
              {odontologos.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Odontólogo
                  </label>
                  <select
                    value={filtros.odontologoId || ''}
                    onChange={handleOdontologoChange}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pieza Dental
                </label>
                <input
                  type="text"
                  value={filtros.piezaDental || ''}
                  onChange={handlePiezaDentalChange}
                  placeholder="Ej: 11, 21, 36..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Estado de Pago */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado de Pago
                </label>
                <select
                  value={filtros.estadoPago || ''}
                  onChange={handleEstadoPagoChange}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado Parcial">Pagado Parcial</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



