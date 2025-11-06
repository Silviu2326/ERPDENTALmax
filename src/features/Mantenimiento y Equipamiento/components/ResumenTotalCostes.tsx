import { DollarSign, Package, Wrench, TrendingDown } from 'lucide-react';
import { ResumenCostes } from '../api/informesEquipamientoApi';

interface ResumenTotalCostesProps {
  resumen: ResumenCostes;
  loading?: boolean;
}

export default function ResumenTotalCostes({
  resumen,
  loading = false,
}: ResumenTotalCostesProps) {
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const tarjetas = [
    {
      titulo: 'Total Adquisición',
      valor: resumen.totalAdquisicion,
      icono: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      titulo: 'Total Mantenimiento',
      valor: resumen.totalMantenimiento,
      icono: Wrench,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      titulo: 'Total Reparaciones',
      valor: resumen.totalReparaciones,
      icono: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      titulo: 'Coste General',
      valor: resumen.costeGeneral,
      icono: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      titulo: 'Depreciación',
      valor: resumen.totalDepreciacion,
      icono: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      titulo: 'Total Equipos',
      valor: resumen.totalEquipos,
      icono: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      esNumero: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {tarjetas.map((tarjeta, index) => {
        const Icono = tarjeta.icono;
        return (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${tarjeta.bgColor}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {tarjeta.titulo}
              </h3>
              <Icono className={`w-5 h-5 ${tarjeta.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {tarjeta.esNumero
                ? tarjeta.valor.toLocaleString('es-ES')
                : formatearMoneda(tarjeta.valor)}
            </p>
          </div>
        );
      })}
    </div>
  );
}


