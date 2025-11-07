import { EstadoFacturasSummary } from '../api/facturacionApi';
import { PieChart as PieChartIcon } from 'lucide-react';

interface EstadoFacturasPieChartProps {
  datos: EstadoFacturasSummary;
  loading?: boolean;
}

export default function EstadoFacturasPieChart({
  datos,
  loading = false,
}: EstadoFacturasPieChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const estados = [
    { nombre: 'Pagada', valor: datos.pagada, color: '#10b981', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { nombre: 'Pendiente', valor: datos.pendiente, color: '#f59e0b', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { nombre: 'Vencida', valor: datos.vencida, color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    { nombre: 'Anulada', valor: datos.anulada, color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  ];

  const total = estados.reduce((sum, estado) => sum + estado.valor, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <PieChartIcon className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay facturas en este período</p>
          <p className="text-sm">Seleccione un rango de fechas diferente</p>
        </div>
      </div>
    );
  }

  // Calcular ángulos para el gráfico circular
  let anguloAcumulado = -90; // Empezar desde arriba
  const segmentos = estados
    .filter((estado) => estado.valor > 0)
    .map((estado) => {
      const porcentaje = (estado.valor / total) * 100;
      const angulo = (porcentaje / 100) * 360;
      const anguloInicio = anguloAcumulado;
      anguloAcumulado += angulo;
      return {
        ...estado,
        porcentaje,
        anguloInicio,
        anguloFin: anguloAcumulado,
      };
    });

  // Función para calcular coordenadas del arco
  const calcularArco = (anguloInicio: number, anguloFin: number, radio: number) => {
    const anguloInicioRad = (anguloInicio * Math.PI) / 180;
    const anguloFinRad = (anguloFin * Math.PI) / 180;
    const x1 = 100 + radio * Math.cos(anguloInicioRad);
    const y1 = 100 + radio * Math.sin(anguloInicioRad);
    const x2 = 100 + radio * Math.cos(anguloFinRad);
    const y2 = 100 + radio * Math.sin(anguloFinRad);
    const largeArc = anguloFin - anguloInicio > 180 ? 1 : 0;
    return `M 100 100 L ${x1} ${y1} A ${radio} ${radio} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Estado de Facturas
        </h3>
        <p className="text-sm text-gray-600">
          Distribución por estado de pago
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Gráfico circular SVG */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 200 200" className="w-64 h-64">
            {segmentos.map((segmento, index) => {
              const radio = 80;
              return (
                <path
                  key={index}
                  d={calcularArco(segmento.anguloInicio, segmento.anguloFin, radio)}
                  fill={segmento.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
            {/* Centro del gráfico con total */}
            <circle cx="100" cy="100" r="50" fill="white" />
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-2xl font-bold fill-gray-900"
              fontSize="24"
            >
              {total}
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="text-sm fill-gray-600"
              fontSize="12"
            >
              Total
            </text>
          </svg>
        </div>

        {/* Leyenda y estadísticas */}
        <div className="flex-1 space-y-4">
          {estados.map((estado) => {
            const porcentaje = (estado.valor / total) * 100;
            return (
              <div key={estado.nombre} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: estado.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {estado.nombre}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {estado.valor}
                  </span>
                  <span className="text-xs text-gray-500 w-16 text-right">
                    {porcentaje.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



