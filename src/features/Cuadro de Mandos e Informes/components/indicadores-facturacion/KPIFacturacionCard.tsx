import { DollarSign, CreditCard, AlertCircle, Receipt } from 'lucide-react';

interface KPIFacturacionCardProps {
  titulo: string;
  valor: number;
  formato?: 'moneda' | 'numero';
  icono?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red';
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
      border: 'border-blue-400',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      border: 'border-green-400',
      text: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      border: 'border-orange-400',
      text: 'text-orange-600',
      bgLight: 'bg-orange-50',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      border: 'border-red-400',
      text: 'text-red-600',
      bgLight: 'bg-red-50',
    },
  };

  const colorClasses = colores[color];
  const iconoDefault = icono || <DollarSign className="w-6 h-6 text-white" />;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 ${colorClasses.border} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
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
        {iconoDefault && (
          <div className={`${colorClasses.bg} p-3 rounded-lg shadow-md`}>
            {iconoDefault}
          </div>
        )}
      </div>
    </div>
  );
}


