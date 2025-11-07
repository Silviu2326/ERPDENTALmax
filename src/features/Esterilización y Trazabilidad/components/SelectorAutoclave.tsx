import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { obtenerAutoclaves, Autoclave } from '../api/esterilizacionApi';

interface SelectorAutoclaveProps {
  autoclaveSeleccionado: Autoclave | null;
  onAutoclaveSeleccionado: (autoclave: Autoclave | null) => void;
  disabled?: boolean;
}

export default function SelectorAutoclave({
  autoclaveSeleccionado,
  onAutoclaveSeleccionado,
  disabled = false,
}: SelectorAutoclaveProps) {
  const [autoclaves, setAutoclaves] = useState<Autoclave[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    cargarAutoclaves();
  }, []);

  const cargarAutoclaves = async () => {
    try {
      setLoading(true);
      const datos = await obtenerAutoclaves();
      setAutoclaves(datos);
    } catch (error) {
      console.error('Error al cargar autoclaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionar = (autoclave: Autoclave) => {
    onAutoclaveSeleccionado(autoclave);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Autoclave
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`w-full px-3 py-2.5 text-left bg-white rounded-xl ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:ring-slate-400'
          }`}
        >
          {loading ? (
            <span className="text-gray-500">Cargando autoclaves...</span>
          ) : autoclaveSeleccionado ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-900">{autoclaveSeleccionado.nombre}</span>
              {autoclaveSeleccionado.modelo && (
                <span className="text-sm text-gray-500 ml-2">({autoclaveSeleccionado.modelo})</span>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Seleccione un autoclave</span>
          )}
          <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white rounded-xl ring-1 ring-slate-200 shadow-lg max-h-60 overflow-auto">
              {autoclaves.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No hay autoclaves disponibles
                </div>
              ) : (
                autoclaves.map((autoclave) => (
                  <button
                    key={autoclave._id}
                    type="button"
                    onClick={() => handleSeleccionar(autoclave)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                      autoclaveSeleccionado?._id === autoclave._id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">{autoclave.nombre}</span>
                      {autoclave.modelo && (
                        <span className="text-sm text-gray-500">({autoclave.modelo})</span>
                      )}
                    </div>
                    {autoclave.numeroSerie && (
                      <div className="text-xs text-gray-500 mt-1">S/N: {autoclave.numeroSerie}</div>
                    )}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}



