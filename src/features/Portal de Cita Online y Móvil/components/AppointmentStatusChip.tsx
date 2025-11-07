import { CitaProfesional } from '../api/agendaProfesionalApi';

interface AppointmentStatusChipProps {
  estado: CitaProfesional['estado'];
}

export default function AppointmentStatusChip({ estado }: AppointmentStatusChipProps) {
  const getStatusStyles = (estado: CitaProfesional['estado']) => {
    switch (estado) {
      case 'Confirmada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Paciente en espera':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En box':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Cancelada':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
        estado
      )}`}
    >
      {estado}
    </span>
  );
}



