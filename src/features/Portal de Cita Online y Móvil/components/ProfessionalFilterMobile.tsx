import { Profesional } from '../api/agendaProfesionalApi';
import { User } from 'lucide-react';

interface ProfessionalFilterMobileProps {
  profesionales: Profesional[];
  profesionalSeleccionadoId?: string;
  onSeleccionarProfesional: (profesionalId?: string) => void;
  mostrarTodos?: boolean;
}

export default function ProfessionalFilterMobile({
  profesionales,
  profesionalSeleccionadoId,
  onSeleccionarProfesional,
  mostrarTodos = true,
}: ProfessionalFilterMobileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-5 h-5 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">Profesional</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {mostrarTodos && (
          <button
            onClick={() => onSeleccionarProfesional(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !profesionalSeleccionadoId
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
        )}

        {profesionales.map((profesional) => (
          <button
            key={profesional._id}
            onClick={() => onSeleccionarProfesional(profesional._id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              profesionalSeleccionadoId === profesional._id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={
              profesionalSeleccionadoId === profesional._id && profesional.colorAgenda
                ? { backgroundColor: profesional.colorAgenda }
                : undefined
            }
          >
            {profesional.nombreCompleto}
          </button>
        ))}
      </div>
    </div>
  );
}


