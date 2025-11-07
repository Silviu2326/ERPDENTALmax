import { DollarSign, CreditCard, AlertCircle, Receipt } from 'lucide-react';

interface KPIFacturacionCardProps {
  titulo: string;
  valor: number;
  formato?: 'moneda' | 'numero';
  icono?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  descripcion?: string;
}

export default function KPIFacturacionCard({
  titulo,
  valor,
  formato = 'moneda',
  icono,
  color = 'blue',
  descripcion,
}: KPIFacturacionCardProps) {
  const formatearValor = (val: number): string => {
    if (formato === 'moneda') {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat('es-ES').format(val);
  };

  const colores = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      border: 'border-blue-600',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      border: 'border-green-600',
      text: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      border: 'border-orange-600',
      text: 'text-orange-600',
      bgLight: 'bg-orange-50',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      border: 'border-red-600',
      text: 'text-red-600',
      bgLight: 'bg-red-50',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      border: 'border-purple-600',
      text: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
  };

  const colorClasses = colores[color];
  const iconoDefault = icono || <DollarSign className="w-6 h-6 text-white" />;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${colorClasses.border} hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700">{titulo}</h3>
        {iconoDefault && (
          <div className={`${colorClasses.bg} p-2 rounded-lg`}>
            {iconoDefault}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-3xl font-bold ${colorClasses.text}`}>
          {formatearValor(valor)}
        </span>
      </div>
      {descripcion && (
        <p className="text-sm text-gray-600">{descripcion}</p>
      )}
    </div>
  );
}



