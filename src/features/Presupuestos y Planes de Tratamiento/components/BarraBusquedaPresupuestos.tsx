import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface BarraBusquedaPresupuestosProps {
  onBuscar: (termino: string) => void;
  placeholder?: string;
}

export default function BarraBusquedaPresupuestos({
  onBuscar,
  placeholder = 'Buscar por nombre de paciente, DNI, número de presupuesto...',
}: BarraBusquedaPresupuestosProps) {
  const [termino, setTermino] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce: esperar 500ms después de que el usuario deje de escribir
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onBuscar(termino);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [termino, onBuscar]);

  const handleClear = () => {
    setTermino('');
    onBuscar('');
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {termino && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}

