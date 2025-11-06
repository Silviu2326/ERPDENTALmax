import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import KPIWidget from '../../Cuadro de Mandos e Informes/components/KPIWidget';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <KPIWidget
        titulo="Facturación Total"
        valor={totalRevenue}
        formato="moneda"
        icono={<DollarSign className="w-6 h-6 text-white" />}
        color="blue"
      />
      <KPIWidget
        titulo="Pacientes Nuevos"
        valor={totalNewPatients}
        formato="numero"
        icono={<Users className="w-6 h-6 text-white" />}
        color="green"
      />
      <KPIWidget
        titulo="Tasa de Ocupación Promedio"
        valor={averageOccupancyRate}
        formato="porcentaje"
        icono={<TrendingUp className="w-6 h-6 text-white" />}
        color="purple"
      />
    </div>
  );
}


