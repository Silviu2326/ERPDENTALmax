import { useState, useEffect } from 'react';
import { Filter, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosInformeCostes as FiltrosInformeCostesType } from '../api/informesEquipamientoApi';

interface FiltrosInformeCostesProps {
  filtros: FiltrosInformeCostesType;
  onFiltrosChange: (filtros: FiltrosInformeCostesType) => void;
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

  const numFiltrosActivos = sedesSeleccionadas.length + (categoriaSeleccionada ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda con fechas */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex flex-col gap-4">
            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <Filter size={18} className="opacity-70" />
                <span>Filtros Avanzados</span>
                {numFiltrosActivos > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                    {numFiltrosActivos}
                  </span>
                )}
                {mostrarFiltros ? (
                  <ChevronUp size={18} className="opacity-70" />
                ) : (
                  <ChevronDown size={18} className="opacity-70" />
                )}
              </button>

              <div className="flex gap-2">
                {tieneFiltrosActivos && (
                  <button
                    onClick={handleLimpiarFiltros}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  >
                    <X size={18} className="opacity-70" />
                    <span>Limpiar</span>
                  </button>
                )}
                <button
                  onClick={handleAplicarFiltros}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            {/* Sedes */}
            {sedes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sedes
                </label>
                <div className="flex flex-wrap gap-2">
                  {sedes.map((sede) => (
                    <button
                      key={sede._id}
                      onClick={() => toggleSede(sede._id)}
                      className={`px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                        sedesSeleccionadas.includes(sede._id)
                          ? 'bg-blue-600 text-white border-blue-600 ring-1 ring-blue-200'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 ring-1 ring-slate-200'
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoría de Equipo
                </label>
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
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



