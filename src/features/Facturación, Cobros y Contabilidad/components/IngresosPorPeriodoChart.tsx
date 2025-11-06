import { IngresosPorPeriodo } from '../api/facturacionApi';
import { TrendingUp } from 'lucide-react';

interface IngresosPorPeriodoChartProps {
  datos: IngresosPorPeriodo[];
  loading?: boolean;
}

export default function IngresosPorPeriodoChart({
  datos,
  loading = false,
}: IngresosPorPeriodoChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm">Seleccione un rango de fechas para ver los ingresos</p>
        </div>
      </div>
    );
  }

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Calcular el valor máximo para escalar el gráfico
  const maxValor = Math.max(
    ...datos.map((d) => Math.max(d.ingresos, d.cobros)),
    1
  );

  // Calcular altura máxima del gráfico
  const alturaMaxima = 200;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ingresos por Período
        </h3>
        <p className="text-sm text-gray-600">
          Comparación entre facturación y cobros
        </p>
      </div>

      {/* Leyenda */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-700">Facturado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700">Cobrado</span>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${datos.length * 60} ${alturaMaxima + 60}`}
          className="w-full h-64"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Eje Y - Etiquetas de valores */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const valor = maxValor * ratio;
            const y = alturaMaxima - alturaMaxima * ratio + 40;
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2={datos.length * 60}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x="-10"
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                  fontSize="12"
                >
                  {formatearMoneda(valor)}
                </text>
              </g>
            );
          })}

          {/* Barras del gráfico */}
          {datos.map((dato, index) => {
            const x = index * 60 + 20;
            const anchoBarra = 20;
            const alturaIngresos = (dato.ingresos / maxValor) * alturaMaxima;
            const alturaCobros = (dato.cobros / maxValor) * alturaMaxima;
            const yBase = alturaMaxima + 40;

            return (
              <g key={index}>
                {/* Barra de ingresos (facturado) */}
                <rect
                  x={x}
                  y={yBase - alturaIngresos}
                  width={anchoBarra}
                  height={alturaIngresos}
                  fill="#3b82f6"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Barra de cobros */}
                <rect
                  x={x + anchoBarra + 2}
                  y={yBase - alturaCobros}
                  width={anchoBarra}
                  height={alturaCobros}
                  fill="#10b981"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Etiqueta del período */}
                <text
                  x={x + anchoBarra}
                  y={yBase + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                >
                  {dato.periodo}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tabla de datos debajo del gráfico */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Período
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Facturado
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Cobrado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {datos.map((dato, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-900">{dato.periodo}</td>
                <td className="px-4 py-2 text-right font-medium text-blue-600">
                  {formatearMoneda(dato.ingresos)}
                </td>
                <td className="px-4 py-2 text-right font-medium text-green-600">
                  {formatearMoneda(dato.cobros)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


