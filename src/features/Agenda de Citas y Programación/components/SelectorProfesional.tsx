import { useState, useEffect } from 'react';
import { Stethoscope, AlertCircle } from 'lucide-react';
import { Profesional, obtenerProfesionales } from '../api/citasApi';

interface SelectorProfesionalProps {
  profesionalId: string;
  onProfesionalChange: (profesionalId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function SelectorProfesional({
  profesionalId,
  onProfesionalChange,
  disabled = false,
  required = true,
}: SelectorProfesionalProps) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarProfesionales = async () => {
      setLoading(true);
      setError(null);

      try {
        const profs = await obtenerProfesionales();
        setProfesionales(profs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los profesionales');
      } finally {
        setLoading(false);
      }
    };

    cargarProfesionales();
  }, []);

  return (
    <div>
      {error && (
        <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
        <Stethoscope className="w-4 h-4" />
        <span>Profesional {required && '*'}</span>
      </label>
      <select
        value={profesionalId}
        onChange={(e) => onProfesionalChange(e.target.value)}
        disabled={disabled || loading}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">
          {loading ? 'Cargando...' : 'Seleccionar profesional'}
        </option>
        {profesionales.map((prof) => (
          <option key={prof._id} value={prof._id}>
            {prof.nombre} {prof.apellidos} {prof.rol && `(${prof.rol})`}
          </option>
        ))}
      </select>
    </div>
  );
}


