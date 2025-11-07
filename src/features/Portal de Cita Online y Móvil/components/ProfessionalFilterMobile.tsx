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
    <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-5 h-5 text-slate-600" />
        <h3 className="text-sm font-medium text-slate-700">Profesional</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {mostrarTodos && (
          <button
            onClick={() => onSeleccionarProfesional(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !profesionalSeleccionadoId
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>
        )}

        {profesionales.map((profesional) => (
          <button
            key={profesional._id}
            onClick={() => onSeleccionarProfesional(profesional._id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              profesionalSeleccionadoId === profesional._id
                ? 'text-white shadow-sm ring-1'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            style={
              profesionalSeleccionadoId === profesional._id && profesional.colorAgenda
                ? { 
                    backgroundColor: profesional.colorAgenda,
                    borderColor: profesional.colorAgenda
                  }
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



