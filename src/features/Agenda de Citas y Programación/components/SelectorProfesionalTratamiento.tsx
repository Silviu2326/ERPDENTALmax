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
        <div className="bg-white shadow-sm rounded-xl p-4 ring-1 ring-red-200/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Profesional */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Stethoscope size={16} />
            <span>Profesional *</span>
          </label>
          <select
            value={profesionalSeleccionado?._id || ''}
            onChange={handleProfesionalSelect}
            disabled={disabled || loadingProfesionales}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500"
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
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Clock size={16} />
            <span>Tratamiento</span>
          </label>
          <select
            value={tratamientoSeleccionado?._id || ''}
            onChange={handleTratamientoSelect}
            disabled={disabled || loadingTratamientos}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500"
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
            <p className="mt-1 text-xs text-slate-600">
              Duración estimada: {tratamientoSeleccionado.duracionEstimadaMinutos} minutos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}



