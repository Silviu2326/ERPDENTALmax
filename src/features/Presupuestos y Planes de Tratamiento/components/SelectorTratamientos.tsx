import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Tratamiento, obtenerTratamientos } from '../api/planesTratamientoApi';

interface SelectorTratamientosProps {
  onTratamientoSeleccionado: (tratamiento: Tratamiento) => void;
  tratamientoSeleccionado?: Tratamiento | null;
}

export default function SelectorTratamientos({
  onTratamientoSeleccionado,
  tratamientoSeleccionado,
}: SelectorTratamientosProps) {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarTratamientos();
  }, []);

  const cargarTratamientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerTratamientos();
      setTratamientos(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tratamientos');
      // Datos mock para desarrollo
      setTratamientos([
        {
          _id: '1',
          codigo: 'LIM-001',
          nombre: 'Limpieza Dental',
          descripcion: 'Limpieza dental profesional',
          precioBase: 60,
          categoria: 'Higiene',
        },
        {
          _id: '2',
          codigo: 'END-001',
          nombre: 'Endodoncia',
          descripcion: 'Tratamiento de conductos',
          precioBase: 250,
          categoria: 'Endodoncia',
        },
        {
          _id: '3',
          codigo: 'IMP-001',
          nombre: 'Implante Dental',
          descripcion: 'Implante unitario',
          precioBase: 1500,
          categoria: 'Implantología',
        },
        {
          _id: '4',
          codigo: 'ORT-001',
          nombre: 'Ortodoncia',
          descripcion: 'Tratamiento ortodóncico',
          precioBase: 3000,
          categoria: 'Ortodoncia',
        },
        {
          _id: '5',
          codigo: 'RAD-001',
          nombre: 'Radiografía Panorámica',
          descripcion: 'Radiografía panorámica digital',
          precioBase: 50,
          categoria: 'Diagnóstico',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const tratamientosFiltrados = tratamientos.filter((tratamiento) => {
    const coincideBusqueda =
      tratamiento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      tratamiento.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      tratamiento.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria = !categoriaFiltro || tratamiento.categoria === categoriaFiltro;

    return coincideBusqueda && coincideCategoria;
  });

  const categorias = Array.from(new Set(tratamientos.map((t) => t.categoria)));

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Selector de Tratamientos</h3>

        {/* Barra de búsqueda */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar tratamiento por nombre, código o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por categoría */}
        {categorias.length > 0 && (
          <div className="mb-4">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tratamiento seleccionado */}
        {tratamientoSeleccionado && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-medium text-blue-900">{tratamientoSeleccionado.nombre}</div>
              <div className="text-sm text-blue-700">
                {tratamientoSeleccionado.codigo} - €{tratamientoSeleccionado.precioBase}
              </div>
            </div>
            <button
              onClick={() => onTratamientoSeleccionado(null as any)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Lista de tratamientos */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando tratamientos...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : tratamientosFiltrados.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron tratamientos con los filtros aplicados
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto space-y-2">
          {tratamientosFiltrados.map((tratamiento) => (
            <button
              key={tratamiento._id}
              onClick={() => onTratamientoSeleccionado(tratamiento)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{tratamiento.nombre}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {tratamiento.codigo} - {tratamiento.categoria}
                  </div>
                  {tratamiento.descripcion && (
                    <div className="text-xs text-gray-500 mt-1">{tratamiento.descripcion}</div>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <div className="font-semibold text-blue-600">€{tratamiento.precioBase}</div>
                  <Plus className="w-4 h-4 text-gray-400 mt-1 mx-auto" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



