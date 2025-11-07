import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface AppointmentStatusPieChartProps {
  datos: Array<{
    estado: string;
    cantidad: number;
    porcentaje: number;
  }>;
}

const COLORS = {
  completada: '#10b981',
  cancelada: '#ef4444',
  'no-asistio': '#f59e0b',
  programada: '#3b82f6',
  confirmada: '#8b5cf6',
};

const LABELS = {
  completada: 'Completadas',
  cancelada: 'Canceladas',
  'no-asistio': 'No asistió',
  programada: 'Programadas',
  confirmada: 'Confirmadas',
};

export default function AppointmentStatusPieChart({ datos }: AppointmentStatusPieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const datosFormateados = datos.map((item) => ({
    name: LABELS[item.estado as keyof typeof LABELS] || item.estado,
    value: item.cantidad,
    porcentaje: item.porcentaje,
    color: COLORS[item.estado as keyof typeof COLORS] || '#6b7280',
  }));

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Estado de Citas</h3>
            <p className="text-sm text-gray-600">Distribución por estado</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const total = datosFormateados.reduce((sum, item) => sum + item.value, 0);
  const centroX = 150;
  const centroY = 150;
  const radio = 100;
  const radioInterno = hoveredIndex !== null ? 115 : 100;

  let anguloActual = -90; // Empezar desde arriba

  const generarArco = (porcentaje: number, color: string, index: number) => {
    const angulo = (porcentaje / 100) * 360;
    const anguloInicio = anguloActual;
    const anguloFin = anguloActual + angulo;

    const x1 = centroX + radio * Math.cos((anguloInicio * Math.PI) / 180);
    const y1 = centroY + radio * Math.sin((anguloInicio * Math.PI) / 180);
    const x2 = centroX + radio * Math.cos((anguloFin * Math.PI) / 180);
    const y2 = centroY + radio * Math.sin((anguloFin * Math.PI) / 180);

    const largeArcFlag = angulo > 180 ? 1 : 0;

    const path = `M ${centroX} ${centroY} L ${x1} ${y1} A ${radio} ${radio} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    anguloActual += angulo;

    const anguloMedio = (anguloInicio + anguloFin) / 2;
    const labelX = centroX + (radio * 0.7) * Math.cos((anguloMedio * Math.PI) / 180);
    const labelY = centroY + (radio * 0.7) * Math.sin((anguloMedio * Math.PI) / 180);

    return { path, color, labelX, labelY, anguloMedio, index };
  };

  const arcos = datosFormateados.map((item, index) =>
    generarArco(item.porcentaje, item.color, index)
  );

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
          <Calendar size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Estado de Citas</h3>
          <p className="text-sm text-gray-600">Distribución por estado</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <svg viewBox="0 0 300 300" className="w-full max-w-sm h-64" preserveAspectRatio="xMidYMid meet">
          {arcos.map((arco, index) => {
            const isHovered = hoveredIndex === index;
            const item = datosFormateados[index];

            return (
              <g key={index}>
                <path
                  d={arco.path}
                  fill={arco.color}
                  stroke="white"
                  strokeWidth="2"
                  opacity={isHovered ? 1 : hoveredIndex === null ? 1 : 0.5}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer transition-opacity"
                />
                {isHovered && (
                  <g>
                    <circle
                      cx={centroX}
                      cy={centroY}
                      r="60"
                      fill="white"
                      opacity="0.9"
                    />
                    <text
                      x={centroX}
                      y={centroY - 10}
                      textAnchor="middle"
                      className="text-lg fill-gray-800 font-bold"
                      fontSize="16"
                    >
                      {item.name}
                    </text>
                    <text
                      x={centroX}
                      y={centroY + 10}
                      textAnchor="middle"
                      className="text-sm fill-gray-600"
                      fontSize="12"
                    >
                      {item.value} ({item.porcentaje.toFixed(1)}%)
                    </text>
                  </g>
                )}
                {!isHovered && hoveredIndex === null && (
                  <text
                    x={arco.labelX}
                    y={arco.labelY}
                    textAnchor="middle"
                    className="text-xs fill-white font-semibold"
                    fontSize="11"
                    pointerEvents="none"
                  >
                    {item.porcentaje.toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Leyenda */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {datosFormateados.map((entry, index) => (
            <div
              key={index}
              className="flex items-center space-x-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

