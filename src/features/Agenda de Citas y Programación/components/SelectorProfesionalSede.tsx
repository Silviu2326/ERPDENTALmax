import { useState, useEffect } from 'react';
import { Stethoscope, Building2, AlertCircle } from 'lucide-react';
import { Profesional, obtenerProfesionales } from '../api/citasApi';

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
  sedes?: Sede[]; // Si no se proporciona, se usará un mock
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
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Building2 className="w-4 h-4" />
          <span>Sede {required && '*'}</span>
        </label>
        <select
          value={sedeId}
          onChange={(e) => onSedeChange(e.target.value)}
          disabled={disabled}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Stethoscope className="w-4 h-4" />
          <span>Profesional {required && '*'}</span>
        </label>
        <select
          value={profesionalId}
          onChange={(e) => onProfesionalChange(e.target.value)}
          disabled={disabled || loading || !sedeId}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {loading ? 'Cargando...' : !sedeId ? 'Primero seleccione una sede' : 'Seleccionar profesional'}
          </option>
          {profesionales.map((prof) => (
            <option key={prof._id} value={prof._id}>
              {prof.nombre} {prof.apellidos} {prof.rol && `(${prof.rol})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


