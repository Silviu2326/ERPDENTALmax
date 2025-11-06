import { DollarSign, TrendingUp, TrendingDown, Package, Percent } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
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
      titulo: 'Ingresos Totales',
      valor: formatearMoneda(kpis.ingresosTotales),
      icono: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      titulo: 'Coste Total',
      valor: formatearMoneda(kpis.costeTotal),
      icono: Package,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      titulo: 'Margen Bruto',
      valor: formatearMoneda(kpis.margenBruto),
      icono: TrendingUp,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      titulo: 'Margen %',
      valor: `${kpis.margenPorcentual.toFixed(1)}%`,
      icono: Percent,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {indicadores.map((indicador, index) => {
        const Icono = indicador.icono;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-lg p-6 border-2 ${indicador.borderColor} hover:shadow-xl transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${indicador.color}`}>
                <Icono className="w-6 h-6 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${indicador.bgColor} text-gray-700`}>
                {indicador.titulo}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{indicador.valor}</p>
              {index === 2 && kpis.tratamientoMasRentable && (
                <p className="text-xs text-gray-500">
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


