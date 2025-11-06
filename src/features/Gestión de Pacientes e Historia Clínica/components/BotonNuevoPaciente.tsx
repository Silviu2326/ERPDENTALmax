import { UserPlus } from 'lucide-react';

interface BotonNuevoPacienteProps {
  onClick: () => void;
}

export default function BotonNuevoPaciente({ onClick }: BotonNuevoPacienteProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
    >
      <UserPlus className="w-5 h-5" />
      <span>Nuevo Paciente</span>
    </button>
  );
}


