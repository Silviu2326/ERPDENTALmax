import MetricCards from './MetricCards';

interface GlobalKPIGridProps {
  totalRevenue: number;
  totalNewPatients: number;
  averageOccupancyRate: number;
}

export default function GlobalKPIGrid({
  totalRevenue,
  totalNewPatients,
  averageOccupancyRate,
}: GlobalKPIGridProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <MetricCards
      data={[
        {
          id: 'revenue',
          title: 'Facturación Total',
          value: formatCurrency(totalRevenue),
          color: 'info',
        },
        {
          id: 'patients',
          title: 'Pacientes Nuevos',
          value: totalNewPatients,
          color: 'success',
        },
        {
          id: 'occupancy',
          title: 'Tasa de Ocupación Promedio',
          value: `${averageOccupancyRate.toFixed(1)}%`,
          color: 'info',
        },
      ]}
    />
  );
}



