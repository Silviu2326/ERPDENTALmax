import { UserPlus } from 'lucide-react';

interface BotonNuevoPacienteProps {
  onClick: () => void;
}

export default function BotonNuevoPaciente({ onClick }: BotonNuevoPacienteProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
    >
      <UserPlus size={20} />
      <span>Nuevo Paciente</span>
    </button>
  );
}



