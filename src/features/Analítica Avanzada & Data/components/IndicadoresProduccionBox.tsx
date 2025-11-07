import { DollarSign, Box, Users, BarChart3, Loader2 } from 'lucide-react';
import { ProduccionBoxKPIs } from '../api/analiticaApi';

interface IndicadoresProduccionBoxProps {
  kpis: ProduccionBoxKPIs | null;
  loading?: boolean;
}

export default function IndicadoresProduccionBox({
  kpis,
  loading = false,
}: IndicadoresProduccionBoxProps) {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando métricas...</p>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron métricas para el período seleccionado</p>
      </div>
    );
  }

  const metricas = [
    {
      id: 'produccion-total',
      title: 'Producción Total',
      value: formatearMoneda(kpis.produccionTotal),
      color: 'info' as const,
      icon: DollarSign,
      description: 'Total generado en el período',
    },
    {
      id: 'promedio-profesional',
      title: 'Promedio Profesional',
      value: formatearMoneda(kpis.produccionPromedioProfesional),
      color: 'success' as const,
      icon: Users,
      description: 'Por profesional',
    },
    {
      id: 'utilizacion-boxes',
      title: 'Utilización Boxes',
      value: `${kpis.utilizacionBoxes.toFixed(1)}%`,
      color: 'warning' as const,
      icon: Box,
      description: 'Porcentaje de utilización',
    },
    {
      id: 'produccion-box',
      title: 'Producción por Box',
      value: formatearMoneda(kpis.produccionPorBox),
      color: 'info' as const,
      icon: BarChart3,
      description: 'Promedio por box',
    },
    {
      id: 'total-profesionales',
      title: 'Total Profesionales',
      value: kpis.totalProfesionales.toString(),
      color: 'info' as const,
      icon: Users,
      description: 'Profesionales activos',
    },
    {
      id: 'total-boxes',
      title: 'Total Boxes',
      value: kpis.totalBoxes.toString(),
      color: 'info' as const,
      icon: Box,
      description: 'Boxes disponibles',
    },
  ];

  const colorClasses = {
    info: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      border: 'ring-blue-200/70',
    },
    success: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      border: 'ring-green-200/70',
    },
    warning: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      border: 'ring-yellow-200/70',
    },
    danger: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      border: 'ring-red-200/70',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {metricas.map((metrica) => {
        const Icon = metrica.icon;
        const colors = colorClasses[metrica.color];
        return (
          <div
            key={metrica.id}
            className="bg-white shadow-sm rounded-xl p-4 ring-1 ring-gray-200/60"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">{metrica.title}</h3>
              <div className={`p-2 ${colors.bg} rounded-xl ring-1 ${colors.border}`}>
                <Icon size={18} className={colors.icon} />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{metrica.value}</span>
            </div>
            <p className="text-xs text-gray-500">{metrica.description}</p>
          </div>
        );
      })}
    </div>
  );
}



