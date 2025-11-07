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
      border: 'border-blue-500',
      iconBg: 'bg-blue-600',
      iconColor: 'text-blue-600',
    },
    green: {
      border: 'border-green-500',
      iconBg: 'bg-green-600',
      iconColor: 'text-green-600',
    },
    purple: {
      border: 'border-purple-500',
      iconBg: 'bg-purple-600',
      iconColor: 'text-purple-600',
    },
    orange: {
      border: 'border-orange-500',
      iconBg: 'bg-orange-600',
      iconColor: 'text-orange-600',
    },
    red: {
      border: 'border-red-500',
      iconBg: 'bg-red-600',
      iconColor: 'text-red-600',
    },
  };

  const colorClasses = colores[color];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${colorClasses.border} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700">{titulo}</h3>
        {Icon && (
          <div className={`${colorClasses.iconBg} p-2 rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">
          {formatearValor(valor)}
        </span>
      </div>
      {descripcion && (
        <p className="text-xs text-gray-600 mt-2">{descripcion}</p>
      )}
    </div>
  );
}



