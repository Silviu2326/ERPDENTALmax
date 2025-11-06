import { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { obtenerTratamientos, Tratamiento } from '../api/conveniosApi';

interface SelectorTratamientosProps {
  tratamientosSeleccionados: string[];
  onTratamientoSeleccionado: (tratamientoId: string) => void;
  onTratamientoEliminado: (tratamientoId: string) => void;
  tratamientosDisponibles?: Tratamiento[];
  disabled?: boolean;
}

export default function SelectorTratamientos({
  tratamientosSeleccionados,
  onTratamientoSeleccionado,
  onTratamientoEliminado,
  tratamientosDisponibles: tratamientosProp,
  disabled = false,
}: SelectorTratamientosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>(tratamientosProp || []);
  const [loading, setLoading] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    if (tratamientosProp) {
      setTratamientos(tratamientosProp);
    } else {
      cargarTratamientos();
    }
  }, [tratamientosProp]);

  const cargarTratamientos = async () => {
    setLoading(true);
    try {
      const datos = await obtenerTratamientos(busqueda || undefined);
      setTratamientos(datos);
    } catch (error) {
      console.error('Error al cargar tratamientos:', error);
      setTratamientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tratamientosProp) {
      const timeoutId = setTimeout(() => {
        if (busqueda.length > 2 || busqueda.length === 0) {
          cargarTratamientos();
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [busqueda]);

  const tratamientosFiltrados = tratamientos.filter((t) => {
    const yaSeleccionado = tratamientosSeleccionados.includes(t._id);
    const coincideBusqueda = !busqueda || 
      t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (t.codigo && t.codigo.toLowerCase().includes(busqueda.toLowerCase()));
    return !yaSeleccionado && coincideBusqueda;
  });

  const handleSeleccionar = (tratamientoId: string) => {
    onTratamientoSeleccionado(tratamientoId);
    setBusqueda('');
    setMostrarLista(false);
  };

  const tratamientosSeleccionadosData = tratamientos.filter((t) =>
    tratamientosSeleccionados.includes(t._id)
  );

  return (
    <div className="space-y-3">
      {/* Búsqueda de tratamientos */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar tratamiento..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarLista(true);
          }}
          onFocus={() => setMostrarLista(true)}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {mostrarLista && tratamientosFiltrados.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              tratamientosFiltrados.map((tratamiento) => (
                <button
                  key={tratamiento._id}
                  onClick={() => handleSeleccionar(tratamiento._id)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{tratamiento.nombre}</div>
                    {tratamiento.codigo && (
                      <div className="text-sm text-gray-500">Código: {tratamiento.codigo}</div>
                    )}
                  </div>
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Lista de tratamientos seleccionados */}
      {tratamientosSeleccionadosData.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tratamientos seleccionados ({tratamientosSeleccionadosData.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {tratamientosSeleccionadosData.map((tratamiento) => (
              <span
                key={tratamiento._id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
              >
                {tratamiento.nombre}
                {!disabled && (
                  <button
                    onClick={() => onTratamientoEliminado(tratamiento._id)}
                    className="hover:text-red-600 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay tratamientos disponibles */}
      {!loading && tratamientosFiltrados.length === 0 && busqueda && (
        <div className="text-sm text-gray-500 text-center py-2">
          No se encontraron tratamientos
        </div>
      )}
    </div>
  );
}


