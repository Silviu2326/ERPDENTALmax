import { TrendingUp, TrendingDown, DollarSign, Users, Target, Percent } from 'lucide-react';

interface KPIsCampanaCardProps {
  titulo: string;
  valor: string | number;
  icono?: 'inversion' | 'pacientes' | 'cpa' | 'roi' | 'ingresos' | 'target';
  tendencia?: 'up' | 'down' | 'neutral';
  variacion?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const iconosMap = {
  inversion: DollarSign,
  pacientes: Users,
  cpa: Target,
  roi: Percent,
  ingresos: DollarSign,
  target: Target,
};

const coloresMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
};

export default function KPIsCampanaCard({
  titulo,
  valor,
  icono = 'target',
  tendencia,
  variacion,
  color = 'blue',
}: KPIsCampanaCardProps) {
  const Icono = iconosMap[icono];
  const colorGradiente = coloresMap[color];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-br ${colorGradiente} p-3 rounded-lg`}>
          <Icono className="w-6 h-6 text-white" />
        </div>
        {tendencia && variacion && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            tendencia === 'up' ? 'text-green-600' : tendencia === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {tendencia === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : tendencia === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span>{variacion}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{titulo}</h3>
      <p className="text-2xl font-bold text-gray-900">{valor}</p>
    </div>
  );
}


