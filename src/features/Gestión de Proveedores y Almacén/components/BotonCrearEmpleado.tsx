import { Plus } from 'lucide-react';

interface BotonCrearEmpleadoProps {
  onClick: () => void;
}

export default function BotonCrearEmpleado({ onClick }: BotonCrearEmpleadoProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium text-sm"
    >
      <Plus size={20} />
      <span>Añadir Empleado</span>
    </button>
  );
}



