import { TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';

interface DashboardKpiCardProps {
  titulo: string;
  valor: number;
  icono?: 'facturado' | 'cobrado' | 'pendiente' | 'facturas';
  formato?: 'moneda' | 'numero';
  tendencia?: {
    valor: number;
    esPositivo: boolean;
  };
}

export default function DashboardKpiCard({
  titulo,
  valor,
  icono,
  formato = 'moneda',
  tendencia,
}: DashboardKpiCardProps) {
  const formatearValor = (val: number): string => {
    if (formato === 'moneda') {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }).format(val);
    }
    return val.toLocaleString('es-ES');
  };

  const getIcon = () => {
    switch (icono) {
      case 'facturado':
        return <DollarSign className="w-6 h-6" />;
      case 'cobrado':
        return <TrendingUp className="w-6 h-6" />;
      case 'pendiente':
        return <TrendingDown className="w-6 h-6" />;
      case 'facturas':
        return <FileText className="w-6 h-6" />;
      default:
        return <DollarSign className="w-6 h-6" />;
    }
  };

  const getColorClasses = () => {
    switch (icono) {
      case 'facturado':
        return 'from-blue-500 to-blue-600';
      case 'cobrado':
        return 'from-green-500 to-green-600';
      case 'pendiente':
        return 'from-yellow-500 to-yellow-600';
      case 'facturas':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses()} text-white`}>
          {getIcon()}
        </div>
        {tendencia && (
          <div className={`flex items-center space-x-1 text-sm ${
            tendencia.esPositivo ? 'text-green-600' : 'text-red-600'
          }`}>
            {tendencia.esPositivo ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {Math.abs(tendencia.valor).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{titulo}</h3>
      <p className="text-3xl font-bold text-gray-900">{formatearValor(valor)}</p>
    </div>
  );
}


