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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 border-l-4 border-blue-200 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">Total Empresas</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-blue-600">{totalEmpresas}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 border-l-4 border-green-200 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">Total Contactos</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-green-600">{totalContactos}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 border-l-4 border-yellow-200 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">Total Campañas</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-yellow-600">{totalCampanas}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 border-l-4 border-blue-200 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">Tasa de Conversión</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-blue-600">{tasaConversion.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}



