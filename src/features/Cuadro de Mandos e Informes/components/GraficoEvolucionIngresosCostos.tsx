import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { EvolucionFinanciera } from '../api/rentabilidadApi';

interface GraficoEvolucionIngresosCostosProps {
  datos: EvolucionFinanciera[];
  loading?: boolean;
}

export default function GraficoEvolucionIngresosCostos({
  datos,
  loading = false,
}: GraficoEvolucionIngresosCostosProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución Ingresos vs Costos</h3>
            <p className="text-sm text-gray-500">Tendencia financiera en el tiempo</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución Ingresos vs Costos</h3>
            <p className="text-sm text-gray-500">Tendencia financiera en el tiempo</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const datosFormateados = datos.map((item) => ({
    periodo: new Date(item.periodo).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
    ingresos: item.ingresos,
    costos: item.costos,
  }));

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const maxValor = Math.max(
    ...datosFormateados.map((d) => Math.max(d.ingresos, d.costos)),
    1
  );
  const ancho = 800;
  const alto = 300;
  const margenX = 60;
  const margenY = 40;
  const anchoGrafico = ancho - margenX * 2;
  const altoGrafico = alto - margenY * 2;
  const pasoX = anchoGrafico / (datosFormateados.length - 1 || 1);

  // Generar puntos para las líneas
  const puntosIngresos = datosFormateados
    .map((dato, index) => {
      const x = margenX + index * pasoX;
      const y = margenY + altoGrafico - (dato.ingresos / maxValor) * altoGrafico;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const puntosCostos = datosFormateados
    .map((dato, index) => {
      const x = margenX + index * pasoX;
      const y = margenY + altoGrafico - (dato.costos / maxValor) * altoGrafico;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución Ingresos vs Costos</h3>
            <p className="text-sm text-gray-500">Tendencia financiera en el tiempo</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Ingresos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Costos</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${ancho} ${alto}`}
          className="w-full h-64"
          preserveAspectRatio="xMidYMid meet"
        >
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

          {/* Línea de ingresos */}
          <path
            d={puntosIngresos}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Línea de costos */}
          <path
            d={puntosCostos}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Área bajo ingresos */}
          <path
            d={`${puntosIngresos} L ${margenX + anchoGrafico} ${margenY + altoGrafico} L ${margenX} ${margenY + altoGrafico} Z`}
            fill="url(#gradientIngresos)"
            opacity="0.2"
          />
          <defs>
            <linearGradient id="gradientIngresos" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Puntos y tooltips */}
          {datosFormateados.map((dato, index) => {
            const xIngresos = margenX + index * pasoX;
            const yIngresos =
              margenY + altoGrafico - (dato.ingresos / maxValor) * altoGrafico;
            const xCostos = margenX + index * pasoX;
            const yCostos = margenY + altoGrafico - (dato.costos / maxValor) * altoGrafico;
            const isHovered = hoveredIndex === index;

            return (
              <g key={index}>
                {/* Punto de ingresos */}
                <circle
                  cx={xIngresos}
                  cy={yIngresos}
                  r={isHovered ? 6 : 4}
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
                {/* Punto de costos */}
                <circle
                  cx={xCostos}
                  cy={yCostos}
                  r={isHovered ? 6 : 4}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
                {isHovered && (
                  <g>
                    <rect
                      x={xIngresos - 80}
                      y={yIngresos - 60}
                      width="160"
                      height="50"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={xIngresos}
                      y={yIngresos - 40}
                      textAnchor="middle"
                      className="text-xs fill-gray-800 font-semibold"
                      fontSize="11"
                    >
                      {dato.periodo}
                    </text>
                    <text
                      x={xIngresos}
                      y={yIngresos - 25}
                      textAnchor="middle"
                      className="text-xs fill-green-600 font-medium"
                      fontSize="10"
                    >
                      Ingresos: {formatearMoneda(dato.ingresos)}
                    </text>
                    <text
                      x={xIngresos}
                      y={yIngresos - 10}
                      textAnchor="middle"
                      className="text-xs fill-red-600 font-medium"
                      fontSize="10"
                    >
                      Costos: {formatearMoneda(dato.costos)}
                    </text>
                  </g>
                )}
                {/* Etiqueta del eje X */}
                {index % Math.ceil(datosFormateados.length / 8) === 0 && (
                  <text
                    x={xIngresos}
                    y={alto - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    fontSize="10"
                  >
                    {dato.periodo}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}


