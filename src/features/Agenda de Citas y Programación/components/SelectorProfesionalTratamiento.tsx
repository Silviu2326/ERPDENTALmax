import { useState, useEffect } from 'react';
import { Stethoscope, Clock, AlertCircle } from 'lucide-react';
import { Profesional, Tratamiento, obtenerProfesionales, obtenerTratamientos } from '../api/citasApi';

interface SelectorProfesionalTratamientoProps {
  profesionalSeleccionado: Profesional | null;
  tratamientoSeleccionado: Tratamiento | null;
  onProfesionalChange: (profesional: Profesional | null) => void;
  onTratamientoChange: (tratamiento: Tratamiento | null) => void;
  disabled?: boolean;
}

export default function SelectorProfesionalTratamiento({
  profesionalSeleccionado,
  tratamientoSeleccionado,
  onProfesionalChange,
  onTratamientoChange,
  disabled = false,
}: SelectorProfesionalTratamientoProps) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [loadingProfesionales, setLoadingProfesionales] = useState(false);
  const [loadingTratamientos, setLoadingTratamientos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingProfesionales(true);
      setLoadingTratamientos(true);
      setError(null);

      try {
        const [profs, trat] = await Promise.all([
          obtenerProfesionales(),
          obtenerTratamientos(),
        ]);
        setProfesionales(profs);
        setTratamientos(trat);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      } finally {
        setLoadingProfesionales(false);
        setLoadingTratamientos(false);
      }
    };

    cargarDatos();
  }, []);

  const handleProfesionalSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const profesional = id ? profesionales.find((p) => p._id === id) || null : null;
    onProfesionalChange(profesional);
  };

  const handleTratamientoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const tratamiento = id ? tratamientos.find((t) => t._id === id) || null : null;
    onTratamientoChange(tratamiento);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Profesional */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Stethoscope className="w-4 h-4" />
            <span>Profesional *</span>
          </label>
          <select
            value={profesionalSeleccionado?._id || ''}
            onChange={handleProfesionalSelect}
            disabled={disabled || loadingProfesionales}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingProfesionales ? 'Cargando...' : 'Seleccionar profesional'}
            </option>
            {profesionales.map((prof) => (
              <option key={prof._id} value={prof._id}>
                {prof.nombre} {prof.apellidos} ({prof.rol})
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Tratamiento */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            <span>Tratamiento</span>
          </label>
          <select
            value={tratamientoSeleccionado?._id || ''}
            onChange={handleTratamientoSelect}
            disabled={disabled || loadingTratamientos}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingTratamientos ? 'Cargando...' : 'Seleccionar tratamiento (opcional)'}
            </option>
            {tratamientos.map((trat) => (
              <option key={trat._id} value={trat._id}>
                {trat.nombre} ({trat.duracionEstimadaMinutos} min)
              </option>
            ))}
          </select>
          {tratamientoSeleccionado && (
            <p className="mt-1 text-xs text-gray-500">
              Duración estimada: {tratamientoSeleccionado.duracionEstimadaMinutos} minutos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


