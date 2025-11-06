import { Plus } from 'lucide-react';

interface BotonCrearEmpleadoProps {
  onClick: () => void;
}

export default function BotonCrearEmpleado({ onClick }: BotonCrearEmpleadoProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
    >
      <Plus className="w-5 h-5" />
      <span className="font-medium">Añadir Empleado</span>
    </button>
  );
}


