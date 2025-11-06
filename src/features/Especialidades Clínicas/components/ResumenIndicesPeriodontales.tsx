import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface IndicesPeriodontales {
  porcentajeSangrado: number;
  porcentajePlaca: number;
  totalSitios: number;
}

interface ResumenIndicesPeriodontalesProps {
  indices: IndicesPeriodontales | null;
}

export default function ResumenIndicesPeriodontales({ indices }: ResumenIndicesPeriodontalesProps) {
  if (!indices) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Índices Periodontales</h3>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No hay datos para calcular</p>
        </div>
      </div>
    );
  }

  const getColorSangrado = (porcentaje: number) => {
    if (porcentaje < 10) return 'text-green-600 bg-green-50';
    if (porcentaje < 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getColorPlaca = (porcentaje: number) => {
    if (porcentaje < 20) return 'text-green-600 bg-green-50';
    if (porcentaje < 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getInterpretacionSangrado = (porcentaje: number) => {
    if (porcentaje < 10) return 'Saludable';
    if (porcentaje < 30) return 'Leve';
    return 'Moderado a Severo';
  };

  const getInterpretacionPlaca = (porcentaje: number) => {
    if (porcentaje < 20) return 'Bajo control';
    if (porcentaje < 50) return 'Moderado';
    return 'Alto';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Índices Periodontales</h3>
      </div>

      <div className="space-y-4">
        {/* Índice de Sangrado */}
        <div className={`p-4 rounded-lg ${getColorSangrado(indices.porcentajeSangrado)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Índice de Sangrado al Sondaje</span>
            <span className="text-2xl font-bold">{indices.porcentajeSangrado.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2 mb-2">
            <div
              className="bg-current h-2 rounded-full transition-all"
              style={{ width: `${Math.min(indices.porcentajeSangrado, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm font-medium">{getInterpretacionSangrado(indices.porcentajeSangrado)}</p>
        </div>

        {/* Índice de Placa */}
        <div className={`p-4 rounded-lg ${getColorPlaca(indices.porcentajePlaca)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Índice de Placa Bacteriana</span>
            <span className="text-2xl font-bold">{indices.porcentajePlaca.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2 mb-2">
            <div
              className="bg-current h-2 rounded-full transition-all"
              style={{ width: `${Math.min(indices.porcentajePlaca, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm font-medium">{getInterpretacionPlaca(indices.porcentajePlaca)}</p>
        </div>

        {/* Resumen general */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-semibold">Total de sitios evaluados:</span>{' '}
              {indices.totalSitios}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


