import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndicadorCardProps {
  titulo: string;
  valor: number;
  formato?: 'numero' | 'porcentaje' | 'moneda';
  icono?: ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  tendencia?: 'up' | 'down';
  cambioPorcentual?: number;
  unidad?: string;
}

export default function IndicadorCard({
  titulo,
  valor,
  formato = 'numero',
  icono,
  color = 'blue',
  tendencia,
  cambioPorcentual,
  unidad,
}: IndicadorCardProps) {
  const colores = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      text: 'text-orange-600',
      bgLight: 'bg-orange-50',
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      bgLight: 'bg-red-50',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
  };

  const colorConfig = colores[color];

  const formatearValor = (): string => {
    switch (formato) {
      case 'porcentaje':
        return `${valor.toFixed(1)}%`;
      case 'moneda':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(valor);
      case 'numero':
      default:
        return new Intl.NumberFormat('es-ES').format(valor) + (unidad ? ` ${unidad}` : '');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{titulo}</h3>
        {icono && (
          <div className={`bg-gradient-to-br ${colorConfig.bg} p-2 rounded-lg`}>{icono}</div>
        )}
      </div>

      <div className="mb-2">
        <p className={`text-3xl font-bold ${colorConfig.text}`}>{formatearValor()}</p>
      </div>

      {tendencia && cambioPorcentual !== undefined && (
        <div className="flex items-center space-x-1 mt-2">
          {tendencia === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              tendencia === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {Math.abs(cambioPorcentual).toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500">vs período anterior</span>
        </div>
      )}
    </div>
  );
}


