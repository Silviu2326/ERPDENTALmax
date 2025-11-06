import { EstadisticasDashboard } from '../api/campanasApi';
import KPIsCampanaCard from './KPIsCampanaCard';

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPIsCampanaCard
          titulo="Inversión Total"
          valor={formatearMoneda(estadisticas.inversionTotal)}
          icono="inversion"
          color="blue"
        />
        <KPIsCampanaCard
          titulo="Pacientes Captados"
          valor={estadisticas.totalPacientesCaptados}
          icono="pacientes"
          color="purple"
        />
        <KPIsCampanaCard
          titulo="CPA Promedio"
          valor={formatearMoneda(estadisticas.cpaPromedio)}
          icono="cpa"
          color="orange"
        />
        <KPIsCampanaCard
          titulo="ROI Global"
          valor={`${estadisticas.roiGlobal.toFixed(1)}%`}
          icono="roi"
          color="green"
          tendencia={estadisticas.roiGlobal > 0 ? 'up' : estadisticas.roiGlobal < 0 ? 'down' : 'neutral'}
        />
        <KPIsCampanaCard
          titulo="Ingresos Generados"
          valor={formatearMoneda(estadisticas.ingresosGenerados)}
          icono="ingresos"
          color="green"
        />
      </div>
    </div>
  );
}


