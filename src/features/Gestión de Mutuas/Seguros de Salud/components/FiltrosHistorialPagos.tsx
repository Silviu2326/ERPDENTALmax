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
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 mb-6">
      <div className="flex flex-col gap-4">
        {/* Primera fila: Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => handleFechaInicioChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={(e) => handleFechaFinChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Segunda fila: Aseguradora y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aseguradora
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtros.idAseguradora || ''}
                onChange={(e) => handleAseguradoraChange(e.target.value)}
                disabled={cargandoAseguradoras}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtros.estado || 'todos'}
                onChange={(e) => handleEstadoChange(e.target.value as 'conciliado' | 'parcial' | 'pendiente' | 'todos')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="conciliado">Conciliado</option>
                <option value="parcial">Parcial</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {tieneFiltros && (
          <div className="flex justify-end">
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Limpiar Filtros</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


