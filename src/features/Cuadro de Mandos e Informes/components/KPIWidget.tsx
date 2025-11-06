import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIWidgetProps {
  titulo: string;
  valor: number | string;
  formato?: 'moneda' | 'numero' | 'porcentaje' | 'texto';
  tendencia?: 'up' | 'down' | 'neutral';
  cambioPorcentual?: number;
  icono?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function KPIWidget({
  titulo,
  valor,
  formato = 'texto',
  tendencia,
  cambioPorcentual,
  icono,
  color = 'blue',
}: KPIWidgetProps) {
  const formatearValor = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (formato) {
      case 'moneda':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
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
      text: 'text-blue-100',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      border: 'border-green-400',
      text: 'text-green-100',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      border: 'border-purple-400',
      text: 'text-purple-100',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      border: 'border-orange-400',
      text: 'text-orange-100',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      border: 'border-red-400',
      text: 'text-red-100',
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
        </div>
        {icono && (
          <div className={`${colorClasses.bg} p-3 rounded-lg shadow-md`}>
            {icono}
          </div>
        )}
      </div>
      
      {tendencia && cambioPorcentual !== undefined && (
        <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
          {tendencia === 'up' && (
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
          )}
          {tendencia === 'down' && (
            <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
          )}
          {tendencia === 'neutral' && (
            <Minus className="w-4 h-4 text-gray-400 mr-2" />
          )}
          <span
            className={`text-sm font-medium ${
              tendencia === 'up'
                ? 'text-green-600'
                : tendencia === 'down'
                ? 'text-red-600'
                : 'text-gray-500'
            }`}
          >
            {Math.abs(cambioPorcentual).toFixed(1)}% vs período anterior
          </span>
        </div>
      )}
    </div>
  );
}


