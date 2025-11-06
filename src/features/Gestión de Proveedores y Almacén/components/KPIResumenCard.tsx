import { DollarSign, Briefcase, Clock, TrendingUp, Package, Users } from 'lucide-react';
import { ResumenKPIs } from '../api/reportesProductividadApi';

interface KPIResumenCardProps {
  resumen: ResumenKPIs;
  loading?: boolean;
}

export default function KPIResumenCard({ resumen, loading = false }: KPIResumenCardProps) {
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearNumero = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 1,
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      titulo: 'Ingresos Totales',
      valor: formatearMoneda(resumen.totalIngresos),
      icono: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      titulo: 'Tratamientos',
      valor: resumen.totalTratamientos.toLocaleString('es-ES'),
      icono: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
    },
    {
      titulo: 'Horas de Sillón',
      valor: formatearNumero(resumen.totalHoras),
      icono: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
    },
    {
      titulo: 'Rentabilidad',
      valor: formatearMoneda(resumen.rentabilidadTotal),
      icono: TrendingUp,
      color: resumen.rentabilidadTotal >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: resumen.rentabilidadTotal >= 0 ? 'bg-emerald-50' : 'bg-red-50',
      iconBg: resumen.rentabilidadTotal >= 0 ? 'bg-emerald-100' : 'bg-red-100',
    },
    {
      titulo: 'Coste de Materiales',
      valor: formatearMoneda(resumen.totalCosteMateriales),
      icono: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
    },
    {
      titulo: 'Productividad/Hora',
      valor: formatearMoneda(resumen.promedioProductividadPorHora),
      icono: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
    },
    {
      titulo: 'Profesionales',
      valor: resumen.numeroProfesionales.toString(),
      icono: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      iconBg: 'bg-cyan-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icono;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow ${kpi.bgColor}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${kpi.iconBg}`}>
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{kpi.titulo}</h3>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.valor}</p>
          </div>
        );
      })}
    </div>
  );
}


