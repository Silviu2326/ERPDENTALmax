import { PresupuestoPaciente, PresupuestoResumen } from '../api/presupuestosApi';

type Presupuesto = PresupuestoPaciente | PresupuestoResumen;

interface PresupuestoStatusBadgeProps {
  estado: Presupuesto['estado'];
}

export default function PresupuestoStatusBadge({ estado }: PresupuestoStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aprobado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Expirado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {estado}
    </span>
  );
}


