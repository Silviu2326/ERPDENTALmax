import { useState, useEffect } from 'react';
import { Stethoscope, Building2, AlertCircle } from 'lucide-react';
import { Profesional, obtenerProfesionales } from '../../Agenda de Citas y Programación/api/citasApi';

interface Sede {
  _id: string;
  nombre: string;
}

interface SelectorProfesionalSedeProps {
  profesionalId: string;
  sedeId: string;
  onProfesionalChange: (profesionalId: string) => void;
  onSedeChange: (sedeId: string) => void;
  disabled?: boolean;
  required?: boolean;
  sedes?: Sede[];
}

export default function SelectorProfesionalSede({
  profesionalId,
  sedeId,
  onProfesionalChange,
  onSedeChange,
  disabled = false,
  required = true,
  sedes,
}: SelectorProfesionalSedeProps) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock de sedes si no se proporcionan
  const sedesDisponibles: Sede[] = sedes || [
    { _id: '1', nombre: 'Sede Principal' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

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
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <Building2 size={16} className="inline" />
          <span>Sede {required && '*'}</span>
        </label>
        <select
          value={sedeId}
          onChange={(e) => onSedeChange(e.target.value)}
          disabled={disabled || loading}
          required={required}
          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
          <option value="">Seleccionar sede</option>
          {sedesDisponibles.map((sede) => (
            <option key={sede._id} value={sede._id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <Stethoscope size={16} className="inline" />
          <span>Profesional {required && '*'}</span>
        </label>
        <select
          value={profesionalId}
          onChange={(e) => onProfesionalChange(e.target.value)}
          disabled={disabled || loading}
          required={required}
          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
          <option value="">Seleccionar profesional</option>
          {profesionales.map((prof) => (
            <option key={prof._id} value={prof._id}>
              {prof.nombre} {prof.apellidos}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}



