import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { EvolutivoFacturacion } from '../../api/informesFacturacionApi';

interface GraficoFacturacionEvolutivoProps {
  datos: EvolutivoFacturacion[];
  loading?: boolean;
  agrupacion?: 'dia' | 'mes' | 'año';
}

export default function GraficoFacturacionEvolutivo({
  datos,
  loading = false,
  agrupacion = 'mes',
}: GraficoFacturacionEvolutivoProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución de Facturación</h3>
            <p className="text-sm text-gray-500">Facturado vs Cobrado</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución de Facturación</h3>
            <p className="text-sm text-gray-500">Facturado vs Cobrado</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const formatearPeriodo = (periodo: string): string => {
    if (agrupacion === 'dia') {
      const fecha = new Date(periodo);
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } else if (agrupacion === 'mes') {
      const [anio, mes] = periodo.split('-');
      const fecha = new Date(parseInt(anio), parseInt(mes) - 1);
      return fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    } else {
      return periodo;
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const maxValor = Math.max(
    ...datos.map((d) => Math.max(d.facturado, d.cobrado)),
    1
  );
  const ancho = 800;
  const alto = 350;
  const margenX = 60;
  const margenY = 40;
  const anchoGrafico = ancho - margenX * 2;
  const altoGrafico = alto - margenY * 2;
  const pasoX = anchoGrafico / (datos.length - 1 || 1);

  // Generar puntos para las líneas
  const puntosFacturado = datos
    .map((dato, index) => {
      const x = margenX + index * pasoX;
      const y = margenY + altoGrafico - (dato.facturado / maxValor) * altoGrafico;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const puntosCobrado = datos
    .map((dato, index) => {
      const x = margenX + index * pasoX;
      const y = margenY + altoGrafico - (dato.cobrado / maxValor) * altoGrafico;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evolución de Facturación</h3>
            <p className="text-sm text-gray-500">Facturado vs Cobrado</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Facturado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Cobrado</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${ancho} ${alto}`}
          className="w-full h-80"
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

          {/* Línea de facturado */}
          <path
            d={puntosFacturado}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Área bajo la línea de facturado */}
          <path
            d={`${puntosFacturado} L ${margenX + anchoGrafico} ${margenY + altoGrafico} L ${margenX} ${margenY + altoGrafico} Z`}
            fill="url(#gradientFacturado)"
            opacity="0.2"
          />

          {/* Línea de cobrado */}
          <path
            d={puntosCobrado}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Área bajo la línea de cobrado */}
          <path
            d={`${puntosCobrado} L ${margenX + anchoGrafico} ${margenY + altoGrafico} L ${margenX} ${margenY + altoGrafico} Z`}
            fill="url(#gradientCobrado)"
            opacity="0.15"
          />

          <defs>
            <linearGradient id="gradientFacturado" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradientCobrado" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Puntos y tooltips */}
          {datos.map((dato, index) => {
            const x = margenX + index * pasoX;
            const yFacturado = margenY + altoGrafico - (dato.facturado / maxValor) * altoGrafico;
            const yCobrado = margenY + altoGrafico - (dato.cobrado / maxValor) * altoGrafico;
            const isHovered = hoveredIndex === index;

            return (
              <g key={index}>
                {/* Punto facturado */}
                <circle
                  cx={x}
                  cy={yFacturado}
                  r={isHovered ? 6 : 4}
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
                {/* Punto cobrado */}
                <circle
                  cx={x}
                  cy={yCobrado}
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
                      x={x - 70}
                      y={yFacturado - 60}
                      width="140"
                      height="50"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={x}
                      y={yFacturado - 40}
                      textAnchor="middle"
                      className="text-xs fill-gray-800 font-semibold"
                      fontSize="10"
                    >
                      {formatearPeriodo(dato.periodo)}
                    </text>
                    <text
                      x={x}
                      y={yFacturado - 25}
                      textAnchor="middle"
                      className="text-xs fill-blue-600 font-medium"
                      fontSize="10"
                    >
                      Facturado: {formatearMoneda(dato.facturado)}
                    </text>
                    <text
                      x={x}
                      y={yFacturado - 10}
                      textAnchor="middle"
                      className="text-xs fill-green-600 font-medium"
                      fontSize="10"
                    >
                      Cobrado: {formatearMoneda(dato.cobrado)}
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
                  {formatearPeriodo(dato.periodo)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}


