import { EstadisticasDashboard } from '../api/campanasApi';
import MetricCards from './MetricCards';

interface CampanaDashboardProps {
  estadisticas: EstadisticasDashboard;
}

export default function CampanaDashboard({ estadisticas }: CampanaDashboardProps) {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <MetricCards
      data={[
        {
          id: 'inversion-total',
          title: 'Inversión Total',
          value: formatearMoneda(estadisticas.inversionTotal),
          color: 'info',
        },
        {
          id: 'pacientes-captados',
          title: 'Pacientes Captados',
          value: estadisticas.totalPacientesCaptados.toString(),
          color: 'info',
        },
        {
          id: 'cpa-promedio',
          title: 'CPA Promedio',
          value: formatearMoneda(estadisticas.cpaPromedio),
          color: 'warning',
        },
        {
          id: 'roi-global',
          title: 'ROI Global',
          value: `${estadisticas.roiGlobal.toFixed(1)}%`,
          color: estadisticas.roiGlobal > 0 ? 'success' : 'danger',
        },
        {
          id: 'ingresos-generados',
          title: 'Ingresos Generados',
          value: formatearMoneda(estadisticas.ingresosGenerados),
          color: 'success',
        },
      ]}
    />
  );
}



