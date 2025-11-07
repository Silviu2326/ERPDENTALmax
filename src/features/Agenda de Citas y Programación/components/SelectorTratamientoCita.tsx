import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Tratamiento, obtenerTratamientos } from '../api/citasApi';

interface SelectorTratamientoCitaProps {
  tratamientoId: string;
  onTratamientoChange: (tratamientoId: string) => void;
  disabled?: boolean;
  onDuracionChange?: (duracion: number) => void;
}

export default function SelectorTratamientoCita({
  tratamientoId,
  onTratamientoChange,
  disabled = false,
  onDuracionChange,
}: SelectorTratamientoCitaProps) {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarTratamientos = async () => {
      setLoading(true);
      setError(null);

      try {
        const trat = await obtenerTratamientos();
        setTratamientos(trat);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los tratamientos');
      } finally {
        setLoading(false);
      }
    };

    cargarTratamientos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    onTratamientoChange(id);
    
    if (id && onDuracionChange) {
      const tratamiento = tratamientos.find((t) => t._id === id);
      if (tratamiento) {
        onDuracionChange(tratamiento.duracionEstimadaMinutos);
      }
    }
  };

  const tratamientoSeleccionado = tratamientos.find((t) => t._id === tratamientoId);

  return (
    <div>
      {error && (
        <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
        <Clock className="w-4 h-4" />
        <span>Tratamiento</span>
      </label>
      <select
        value={tratamientoId}
        onChange={handleChange}
        disabled={disabled || loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">
          {loading ? 'Cargando...' : 'Seleccionar tratamiento (opcional)'}
        </option>
        {tratamientos.map((trat) => (
          <option key={trat._id} value={trat._id}>
            {trat.nombre} {trat.duracionEstimadaMinutos && `(${trat.duracionEstimadaMinutos} min)`}
          </option>
        ))}
      </select>
      {tratamientoSeleccionado && (
        <p className="mt-1 text-xs text-gray-500">
          Duración estimada: {tratamientoSeleccionado.duracionEstimadaMinutos} minutos
        </p>
      )}
    </div>
  );
}



