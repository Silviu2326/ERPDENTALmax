import { OrdenCompra } from '../api/ordenesCompraApi';

interface BadgeEstadoOrdenCompraProps {
  estado: OrdenCompra['estado'];
}

export default function BadgeEstadoOrdenCompra({ estado }: BadgeEstadoOrdenCompraProps) {
  const configEstados: Record<OrdenCompra['estado'], { className: string; label: string }> = {
    'Borrador': {
      className: 'bg-gray-100 text-gray-800 border-gray-300',
      label: 'Borrador',
    },
    'Enviada': {
      className: 'bg-blue-100 text-blue-800 border-blue-300',
      label: 'Enviada',
    },
    'Recibida Parcial': {
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      label: 'Recibida Parcial',
    },
    'Recibida Completa': {
      className: 'bg-green-100 text-green-800 border-green-300',
      label: 'Recibida Completa',
    },
    'Cancelada': {
      className: 'bg-red-100 text-red-800 border-red-300',
      label: 'Cancelada',
    },
  };

  const config = configEstados[estado];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}


