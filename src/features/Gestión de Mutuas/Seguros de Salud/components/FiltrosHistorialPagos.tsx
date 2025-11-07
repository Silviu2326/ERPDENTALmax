import { Search, Filter, X, Calendar } from 'lucide-react';
import { FiltrosPagosSeguro } from '../api/pagosSeguroApi';
import { useState, useEffect } from 'react';
import { obtenerAseguradoras } from '../api/pagosSeguroApi';

interface FiltrosHistorialPagosProps {
  filtros: FiltrosPagosSeguro;
  onFiltrosChange: (filtros: FiltrosPagosSeguro) => void;
}

export default function FiltrosHistorialPagos({
  filtros,
  onFiltrosChange,
}: FiltrosHistorialPagosProps) {
  const [aseguradoras, setAseguradoras] = useState<Array<{ _id: string; nombreComercial: string }>>([]);
  const [cargandoAseguradoras, setCargandoAseguradoras] = useState(false);

  useEffect(() => {
    const cargarAseguradoras = async () => {
      setCargandoAseguradoras(true);
      try {
        const data = await obtenerAseguradoras();
        setAseguradoras(data);
      } catch (error) {
        console.error('Error al cargar aseguradoras:', error);
      } finally {
        setCargandoAseguradoras(false);
      }
    };
    cargarAseguradoras();
  }, []);

  const handleFechaInicioChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaInicio: fecha || undefined,
      page: 1,
    });
  };

  const handleFechaFinChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaFin: fecha || undefined,
      page: 1,
    });
  };

  const handleAseguradoraChange = (idAseguradora: string) => {
    onFiltrosChange({
      ...filtros,
      idAseguradora: idAseguradora || undefined,
      page: 1,
    });
  };

  const handleEstadoChange = (estado: 'conciliado' | 'parcial' | 'pendiente' | 'todos') => {
    onFiltrosChange({
      ...filtros,
      estado: estado === 'todos' ? undefined : estado,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltros = filtros.fechaInicio || filtros.fechaFin || filtros.idAseguradora || filtros.estado;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="p-4 space-y-4">
        {/* Panel de filtros avanzados */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleFechaInicioChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleFechaFinChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Aseguradora
              </label>
              <select
                value={filtros.idAseguradora || ''}
                onChange={(e) => handleAseguradoraChange(e.target.value)}
                disabled={cargandoAseguradoras}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100"
              >
                <option value="">Todas las aseguradoras</option>
                {aseguradoras.map((aseguradora) => (
                  <option key={aseguradora._id} value={aseguradora._id}>
                    {aseguradora.nombreComercial}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Estado
              </label>
              <select
                value={filtros.estado || 'todos'}
                onChange={(e) => handleEstadoChange(e.target.value as 'conciliado' | 'parcial' | 'pendiente' | 'todos')}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="todos">Todos los estados</option>
                <option value="conciliado">Conciliado</option>
                <option value="parcial">Parcial</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resumen de resultados y botón limpiar */}
        {tieneFiltros && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>Filtros aplicados</span>
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <X size={16} />
              <span>Limpiar Filtros</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



