import { useState, useEffect } from 'react';
import { Search, Filter, Package } from 'lucide-react';
import { ImplanteVirtual, obtenerImplantesVirtuales } from '../api/planificacion3DApi';

interface SelectorImplantesVirtualesProps {
  onImplanteSeleccionado: (implante: ImplanteVirtual) => void;
  implanteSeleccionado?: ImplanteVirtual | null;
}

export default function SelectorImplantesVirtuales({
  onImplanteSeleccionado,
  implanteSeleccionado,
}: SelectorImplantesVirtualesProps) {
  const [implantes, setImplantes] = useState<ImplanteVirtual[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroMarca, setFiltroMarca] = useState<string>('');
  const [filtroDiametro, setFiltroDiametro] = useState<string>('');

  useEffect(() => {
    cargarImplantes();
  }, [filtroMarca, filtroDiametro]);

  const cargarImplantes = async () => {
    setCargando(true);
    setError(null);
    try {
      const filtros: { marca?: string; diametro?: number } = {};
      if (filtroMarca) filtros.marca = filtroMarca;
      if (filtroDiametro) filtros.diametro = parseFloat(filtroDiametro);

      const data = await obtenerImplantesVirtuales(filtros);
      setImplantes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar implantes');
      setImplantes([]);
    } finally {
      setCargando(false);
    }
  };

  const marcasUnicas = Array.from(new Set(implantes.map((i) => i.marca)));
  const diametrosUnicos = Array.from(new Set(implantes.map((i) => i.diametro))).sort((a, b) => a - b);

  const implantesFiltrados = implantes.filter((implante) => {
    const coincideBusqueda =
      !busqueda ||
      implante.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      implante.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
      implante.sistema.toLowerCase().includes(busqueda.toLowerCase());
    return coincideBusqueda;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Biblioteca de Implantes</h3>
        </div>

        {/* Buscador */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo o sistema..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todas las marcas</option>
            {marcasUnicas.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
          <select
            value={filtroDiametro}
            onChange={(e) => setFiltroDiametro(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos los diámetros</option>
            {diametrosUnicos.map((diametro) => (
              <option key={diametro} value={diametro.toString()}>
                {diametro} mm
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de implantes */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {cargando && (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando implantes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!cargando && !error && implantesFiltrados.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron implantes</p>
          </div>
        )}

        {!cargando && !error && implantesFiltrados.length > 0 && (
          <div className="space-y-2">
            {implantesFiltrados.map((implante) => {
              const seleccionado = implanteSeleccionado?._id === implante._id;
              return (
                <button
                  key={implante._id}
                  onClick={() => onImplanteSeleccionado(implante)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    seleccionado
                      ? 'bg-blue-50 border-blue-500 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{implante.marca}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{implante.sistema}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{implante.modelo}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Ø {implante.diametro} mm</span>
                        <span>L {implante.longitud} mm</span>
                        <span>Conexión: {implante.tipoConexion}</span>
                      </div>
                    </div>
                    {seleccionado && (
                      <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


