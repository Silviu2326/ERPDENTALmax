import { BarChart3, TrendingUp, Users, Target, Building2 } from 'lucide-react';
import { EstadoEmpresa, EstadoCampana } from '../api/abmApi';

interface AbmAnalyticsWidgetProps {
  totalEmpresas: number;
  empresasPorEstado: Record<EstadoEmpresa, number>;
  totalContactos: number;
  totalCampanas: number;
  campanasPorEstado: Record<EstadoCampana, number>;
}

const ESTADO_COLORS: Record<EstadoEmpresa, string> = {
  Identificada: 'bg-gray-500',
  Contactada: 'bg-blue-500',
  Negociando: 'bg-yellow-500',
  Cliente: 'bg-green-500',
  Descartada: 'bg-red-500',
};

export default function AbmAnalyticsWidget({
  totalEmpresas,
  empresasPorEstado,
  totalContactos,
  totalCampanas,
  campanasPorEstado,
}: AbmAnalyticsWidgetProps) {
  const tasaConversion =
    totalEmpresas > 0 ? ((empresasPorEstado.Cliente || 0) / totalEmpresas) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Empresas</p>
            <p className="text-2xl font-bold text-gray-900">{totalEmpresas}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Contactos</p>
            <p className="text-2xl font-bold text-gray-900">{totalContactos}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Campañas</p>
            <p className="text-2xl font-bold text-gray-900">{totalCampanas}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Target className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tasa de Conversión</p>
            <p className="text-2xl font-bold text-gray-900">{tasaConversion.toFixed(1)}%</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}


