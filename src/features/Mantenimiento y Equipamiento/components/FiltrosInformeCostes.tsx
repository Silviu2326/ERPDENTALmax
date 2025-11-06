import { useState, useEffect } from 'react';
import { Filter, Calendar, X } from 'lucide-react';
import { FiltrosInformeCostes } from '../api/informesEquipamientoApi';

interface FiltrosInformeCostesProps {
  filtros: FiltrosInformeCostes;
  onFiltrosChange: (filtros: FiltrosInformeCostes) => void;
  sedes?: Array<{ _id: string; nombre: string }>;
  categorias?: Array<{ _id: string; nombre: string }>;
  onAplicarFiltros: () => void;
}

export default function FiltrosInformeCostes({
  filtros,
  onFiltrosChange,
  sedes = [],
  categorias = [],
  onAplicarFiltros,
}: FiltrosInformeCostesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(
    filtros.fechaInicio || obtenerFechaHaceUnMes()
  );
  const [fechaFin, setFechaFin] = useState(
    filtros.fechaFin || obtenerFechaHoy()
  );
  const [sedesSeleccionadas, setSedesSeleccionadas] = useState<string[]>(
    filtros.sedes || []
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>(
    filtros.categoria || ''
  );

  function obtenerFechaHoy(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  function obtenerFechaHaceUnMes(): string {
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    return haceUnMes.toISOString().split('T')[0];
  }

  const handleAplicarFiltros = () => {
    onFiltrosChange({
      fechaInicio,
      fechaFin,
      sedes: sedesSeleccionadas.length > 0 ? sedesSeleccionadas : undefined,
      categoria: categoriaSeleccionada || undefined,
    });
    onAplicarFiltros();
  };

  const handleLimpiarFiltros = () => {
    const fechaInicioDefault = obtenerFechaHaceUnMes();
    const fechaFinDefault = obtenerFechaHoy();
    setFechaInicio(fechaInicioDefault);
    setFechaFin(fechaFinDefault);
    setSedesSeleccionadas([]);
    setCategoriaSeleccionada('');
    onFiltrosChange({
      fechaInicio: fechaInicioDefault,
      fechaFin: fechaFinDefault,
    });
    onAplicarFiltros();
  };

  const toggleSede = (sedeId: string) => {
    setSedesSeleccionadas((prev) => {
      if (prev.includes(sedeId)) {
        return prev.filter((id) => id !== sedeId);
      } else {
        return [...prev, sedeId];
      }
    });
  };

  const tieneFiltrosActivos =
    sedesSeleccionadas.length > 0 || categoriaSeleccionada !== '';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Fechas */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Botón para mostrar filtros avanzados */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              mostrarFiltros || tieneFiltrosActivos
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filtros Avanzados</span>
          </button>

          <div className="flex gap-2">
            {tieneFiltrosActivos && (
              <button
                onClick={handleLimpiarFiltros}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
            <button
              onClick={handleAplicarFiltros}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>

        {/* Filtros avanzados */}
        {mostrarFiltros && (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
            {/* Sedes */}
            {sedes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sedes
                </label>
                <div className="flex flex-wrap gap-2">
                  {sedes.map((sede) => (
                    <button
                      key={sede._id}
                      onClick={() => toggleSede(sede._id)}
                      className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                        sedesSeleccionadas.includes(sede._id)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {sede.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categoría */}
            {categorias.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría de Equipo
                </label>
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((categoria) => (
                    <option key={categoria._id} value={categoria._id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


