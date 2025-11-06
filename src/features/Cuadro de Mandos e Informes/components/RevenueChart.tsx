import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  datos: Array<{
    fecha: string;
    ingresos: number;
  }>;
}

export default function RevenueChart({ datos }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const datosFormateados = datos.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
    ingresos: item.ingresos,
  }));

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución de Ingresos</h3>
            <p className="text-sm text-gray-500">Ingresos por período</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const maxValor = Math.max(...datosFormateados.map((d) => d.ingresos), 1);
  const ancho = 800;
  const alto = 300;
  const margenX = 60;
  const margenY = 40;
  const anchoGrafico = ancho - margenX * 2;
  const altoGrafico = alto - margenY * 2;
  const pasoX = anchoGrafico / (datosFormateados.length - 1 || 1);

  // Generar puntos para la línea
  const puntos = datosFormateados
    .map((dato, index) => {
      const x = margenX + index * pasoX;
      const y = margenY + altoGrafico - (dato.ingresos / maxValor) * altoGrafico;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución de Ingresos</h3>
            <p className="text-sm text-gray-500">Ingresos por período</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${ancho} ${alto}`} className="w-full h-64" preserveAspectRatio="xMidYMid meet">
          {/* Grid horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = margenY + altoGrafico - altoGrafico * ratio;
            const valor = maxValor * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={margenX}
                  y1={y}
                  x2={margenX + anchoGrafico}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={margenX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                  fontSize="12"
                >
                  {maxValor >= 1000 ? `€${(valor / 1000).toFixed(0)}k` : formatearMoneda(valor)}
                </text>
              </g>
            );
          })}

          {/* Línea del gráfico */}
          <path
            d={puntos}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Área bajo la línea */}
          <path
            d={`${puntos} L ${margenX + anchoGrafico} ${margenY + altoGrafico} L ${margenX} ${margenY + altoGrafico} Z`}
            fill="url(#gradient)"
            opacity="0.2"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Puntos y tooltips */}
          {datosFormateados.map((dato, index) => {
            const x = margenX + index * pasoX;
            const y = margenY + altoGrafico - (dato.ingresos / maxValor) * altoGrafico;
            const isHovered = hoveredIndex === index;

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
                {isHovered && (
                  <g>
                    <rect
                      x={x - 50}
                      y={y - 40}
                      width="100"
                      height="30"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={x}
                      y={y - 20}
                      textAnchor="middle"
                      className="text-xs fill-gray-800 font-semibold"
                      fontSize="11"
                    >
                      {formatearMoneda(dato.ingresos)}
                    </text>
                  </g>
                )}
                {/* Etiqueta del eje X */}
                <text
                  x={x}
                  y={alto - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                >
                  {dato.fecha}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

