import { DollarSign, TrendingUp, Package, Percent } from 'lucide-react';
import { CosteTratamientoKPIs } from '../api/analiticaApi';

interface IndicadoresCosteTratamientoProps {
  kpis: CosteTratamientoKPIs | null;
  loading?: boolean;
}

export default function IndicadoresCosteTratamiento({
  kpis,
  loading = false,
}: IndicadoresCosteTratamientoProps) {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white shadow-sm rounded-xl p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!kpis) {
    return null;
  }

  const indicadores = [
    {
      id: 'ingresos',
      title: 'Ingresos Totales',
      value: formatearMoneda(kpis.ingresosTotales),
      icono: DollarSign,
      color: 'success' as const,
    },
    {
      id: 'coste',
      title: 'Coste Total',
      value: formatearMoneda(kpis.costeTotal),
      icono: Package,
      color: 'danger' as const,
    },
    {
      id: 'margen',
      title: 'Margen Bruto',
      value: formatearMoneda(kpis.margenBruto),
      icono: TrendingUp,
      color: 'info' as const,
    },
    {
      id: 'margen-porcentual',
      title: 'Margen %',
      value: `${kpis.margenPorcentual.toFixed(1)}%`,
      icono: Percent,
      color: 'warning' as const,
    },
  ];

  const getColorClasses = (color: 'info' | 'success' | 'warning' | 'danger') => {
    switch (color) {
      case 'info':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          ring: 'ring-blue-200/70',
        };
      case 'success':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          ring: 'ring-green-200/70',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          icon: 'text-yellow-600',
          ring: 'ring-yellow-200/70',
        };
      case 'danger':
        return {
          bg: 'bg-red-100',
          icon: 'text-red-600',
          ring: 'ring-red-200/70',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {indicadores.map((indicador) => {
        const Icono = indicador.icono;
        const colors = getColorClasses(indicador.color);
        return (
          <div
            key={indicador.id}
            className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${colors.bg} rounded-xl ring-1 ${colors.ring}`}>
                <Icono size={20} className={colors.icon} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                {indicador.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{indicador.value}</p>
              {indicador.id === 'margen' && kpis.tratamientoMasRentable && (
                <p className="text-xs text-gray-500 mt-2">
                  Más rentable: {kpis.tratamientoMasRentable.tratamientoNombre}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}



