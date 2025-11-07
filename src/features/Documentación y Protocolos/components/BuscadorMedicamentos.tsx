import { useState, useEffect, useRef } from 'react';
import { Search, Pill, X } from 'lucide-react';
import { buscarMedicamentos, Medicamento } from '../api/recetasApi';

interface BuscadorMedicamentosProps {
  onMedicamentoSeleccionado: (medicamento: Medicamento) => void;
  placeholder?: string;
}

export default function BuscadorMedicamentos({
  onMedicamentoSeleccionado,
  placeholder = 'Buscar medicamento...',
}: BuscadorMedicamentosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Medicamento[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<Medicamento | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si la búsqueda es muy corta, no buscar
    if (busqueda.length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    // Debounce: esperar 300ms antes de buscar
    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const medicamentos = await buscarMedicamentos(busqueda);
        setResultados(medicamentos);
        setMostrarResultados(true);
      } catch (error) {
        console.error('Error al buscar medicamentos:', error);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [busqueda]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSeleccionar = (medicamento: Medicamento) => {
    setMedicamentoSeleccionado(medicamento);
    setBusqueda(medicamento.nombre_comercial || medicamento.nombre_generico);
    setMostrarResultados(false);
    onMedicamentoSeleccionado(medicamento);
  };

  const handleLimpiar = () => {
    setBusqueda('');
    setMedicamentoSeleccionado(null);
    setResultados([]);
    setMostrarResultados(false);
  };

  const getNombreMostrar = (medicamento: Medicamento) => {
    if (medicamento.nombre_comercial) {
      return `${medicamento.nombre_comercial} (${medicamento.nombre_generico})`;
    }
    return medicamento.nombre_generico;
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Buscar Medicamento
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => busqueda.length >= 2 && setMostrarResultados(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {busqueda && (
          <button
            onClick={handleLimpiar}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white ring-1 ring-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {resultados.map((medicamento, index) => (
              <li
                key={medicamento._id || index}
                onClick={() => handleSeleccionar(medicamento)}
                className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ring-1 ring-blue-200/70">
                      <Pill className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {getNombreMostrar(medicamento)}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      {medicamento.presentacion && (
                        <p className="text-xs text-slate-500">
                          {medicamento.presentacion}
                        </p>
                      )}
                      {medicamento.concentracion && (
                        <p className="text-xs text-slate-500">
                          {medicamento.concentracion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="absolute z-10 w-full mt-1 bg-white ring-1 ring-slate-200 rounded-xl shadow-lg p-4">
          <p className="text-sm text-slate-500 text-center">Buscando medicamentos...</p>
        </div>
      )}

      {mostrarResultados && !loading && busqueda.length >= 2 && resultados.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white ring-1 ring-slate-200 rounded-xl shadow-lg p-4">
          <p className="text-sm text-slate-500 text-center">No se encontraron medicamentos</p>
        </div>
      )}

      {medicamentoSeleccionado && (
        <div className="mt-2 p-3 bg-green-50 rounded-xl ring-1 ring-green-200/70">
          <div className="flex items-center space-x-2">
            <Pill size={16} className="text-green-600" />
            <p className="text-sm font-medium text-green-900">
              Medicamento seleccionado: {getNombreMostrar(medicamentoSeleccionado)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



