import { LineChart, Loader2, TrendingUp } from 'lucide-react';
import { EvolucionCosteMargen } from '../api/analiticaApi';

interface GraficoEvolucionCosteMargenProps {
  datos: EvolucionCosteMargen[];
  loading?: boolean;
  agrupacion?: 'dia' | 'semana' | 'mes';
}

export default function GraficoEvolucionCosteMargen({
  datos,
  loading = false,
  agrupacion = 'semana',
}: GraficoEvolucionCosteMargenProps) {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    if (agrupacion === 'dia') {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } else if (agrupacion === 'semana') {
      // Calcular número de semana
      const startDate = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
      return `Sem ${weekNumber}`;
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <LineChart size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Evolución de Costes y Márgenes</h3>
            <p className="text-sm text-gray-600">Tendencia temporal</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <LineChart size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Evolución de Costes y Márgenes</h3>
            <p className="text-sm text-gray-600">Tendencia temporal</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
          <p className="text-gray-600">No se encontraron datos de evolución para el período seleccionado</p>
        </div>
      </div>
    );
  }

  const maxValor = Math.max(
    ...datos.map((d) => Math.max(d.ingresos, d.costes, d.margen)),
    1
  );

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <LineChart size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Evolución de Costes y Márgenes</h3>
          <p className="text-sm text-gray-600">Tendencia temporal</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Leyenda */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Ingresos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span className="text-gray-600">Costes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span className="text-gray-600">Margen</span>
          </div>
        </div>

        {/* Gráfico simplificado con barras */}
        <div className="space-y-2">
          {datos.map((item, index) => {
            const porcentajeIngresos = (item.ingresos / maxValor) * 100;
            const porcentajeCostes = (item.costes / maxValor) * 100;
            const porcentajeMargen = (item.margen / maxValor) * 100;

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium text-gray-900">{formatearFecha(item.fecha)}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-medium">
                      Margen: {formatearMoneda(item.margen)} ({item.margenPorcentual.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                  {/* Ingresos */}
                  <div
                    className="absolute left-0 top-0 h-full bg-blue-500 opacity-60"
                    style={{ width: `${porcentajeIngresos}%` }}
                    title={`Ingresos: ${formatearMoneda(item.ingresos)}`}
                  />
                  {/* Costes */}
                  <div
                    className="absolute left-0 top-0 h-full bg-red-500 opacity-60"
                    style={{ width: `${porcentajeCostes}%` }}
                    title={`Costes: ${formatearMoneda(item.costes)}`}
                  />
                  {/* Margen */}
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500"
                    style={{ width: `${porcentajeMargen}%` }}
                    title={`Margen: ${formatearMoneda(item.margen)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

