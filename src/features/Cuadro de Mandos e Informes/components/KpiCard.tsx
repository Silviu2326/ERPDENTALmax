import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  titulo: string;
  valor: number | string;
  formato?: 'moneda' | 'numero' | 'porcentaje' | 'texto';
  icono?: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  descripcion?: string;
}

export default function KpiCard({
  titulo,
  valor,
  formato = 'texto',
  icono: Icon,
  color = 'blue',
  descripcion,
}: KpiCardProps) {
  const formatearValor = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (formato) {
      case 'moneda':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'porcentaje':
        return `${val.toFixed(1)}%`;
      case 'numero':
        return new Intl.NumberFormat('es-ES').format(val);
      default:
        return val.toString();
    }
  };

  const colores = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      border: 'border-blue-400',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      border: 'border-green-400',
      text: 'text-green-600',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      border: 'border-purple-400',
      text: 'text-purple-600',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      border: 'border-orange-400',
      text: 'text-orange-600',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      border: 'border-red-400',
      text: 'text-red-600',
    },
  };

  const colorClasses = colores[color];

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 ${colorClasses.border} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
            {titulo}
          </h3>
          <p className={`text-3xl font-bold ${colorClasses.text}`}>
            {formatearValor(valor)}
          </p>
          {descripcion && (
            <p className="text-xs text-gray-500 mt-2">{descripcion}</p>
          )}
        </div>
        {Icon && (
          <div className={`${colorClasses.bg} p-3 rounded-lg shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}


