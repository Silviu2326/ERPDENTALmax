import { PieChart } from 'lucide-react';
import { CitasPorOrigen } from '../api/indicadoresApi';

interface GraficoOrigenCitasProps {
  datos: CitasPorOrigen[];
  loading?: boolean;
}

export default function GraficoOrigenCitas({
  datos,
  loading = false,
}: GraficoOrigenCitasProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Distribución por Origen</h3>
            <p className="text-sm text-gray-500">Citas según canal de origen</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const total = datos.reduce((sum, item) => sum + item.cantidad, 0);

  const colores = {
    web: '#3b82f6', // blue
    telefono: '#10b981', // green
    presencial: '#f59e0b', // orange
    referido: '#8b5cf6', // purple
  };

  const etiquetas = {
    web: 'Web',
    telefono: 'Teléfono',
    presencial: 'Presencial',
    referido: 'Referido',
  };

  // Calcular ángulos para el gráfico de tarta
  let anguloAcumulado = -90; // Empezar desde arriba
  const radio = 80;
  const centroX = 150;
  const centroY = 150;

  const segmentos = datos.map((item) => {
    const porcentaje = (item.cantidad / total) * 100;
    const angulo = (porcentaje / 100) * 360;
    const anguloInicio = anguloAcumulado;
    const anguloFin = anguloAcumulado + angulo;
    const anguloMedio = anguloInicio + angulo / 2; // Ángulo medio para la etiqueta

    // Convertir ángulos a radianes
    const anguloInicioRad = (anguloInicio * Math.PI) / 180;
    const anguloFinRad = (anguloFin * Math.PI) / 180;
    const anguloMedioRad = (anguloMedio * Math.PI) / 180;

    // Calcular puntos para el arco
    const x1 = centroX + radio * Math.cos(anguloInicioRad);
    const y1 = centroY + radio * Math.sin(anguloInicioRad);
    const x2 = centroX + radio * Math.cos(anguloFinRad);
    const y2 = centroY + radio * Math.sin(anguloFinRad);

    const largeArcFlag = angulo > 180 ? 1 : 0;

    const pathD = `M ${centroX} ${centroY} L ${x1} ${y1} A ${radio} ${radio} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    anguloAcumulado = anguloFin;

    return {
      ...item,
      porcentaje,
      pathD,
      anguloMedioRad,
      color: colores[item.origen] || '#6b7280',
      etiqueta: etiquetas[item.origen] || item.origen,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
          <PieChart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Distribución por Origen</h3>
          <p className="text-sm text-gray-500">Citas según canal de origen</p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="300" height="300" viewBox="0 0 300 300">
            {segmentos.map((segmento, index) => (
              <g key={index}>
                <path
                  d={segmento.pathD}
                  fill={segmento.color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                {/* Etiqueta en el centro de cada segmento */}
                {segmento.porcentaje > 5 && (
                  <text
                    x={centroX + (radio * 0.6) * Math.cos(segmento.anguloMedioRad)}
                    y={centroY + (radio * 0.6) * Math.sin(segmento.anguloMedioRad)}
                    textAnchor="middle"
                    className="text-xs fill-white font-semibold"
                    fontSize="11"
                  >
                    {segmento.porcentaje.toFixed(0)}%
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Leyenda */}
        <div className="ml-8 space-y-3">
          {segmentos.map((segmento, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: segmento.color }}
              ></div>
              <div>
                <p className="text-sm font-medium text-gray-800">{segmento.etiqueta}</p>
                <p className="text-xs text-gray-500">
                  {segmento.cantidad} citas ({segmento.porcentaje.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

