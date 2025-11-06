import { PieChart } from 'lucide-react';
import { FacturacionPorCategoria } from '../../api/informesFacturacionApi';

interface GraficoFacturacionPorCategoriaProps {
  datos: FacturacionPorCategoria[];
  loading?: boolean;
}

export default function GraficoFacturacionPorCategoria({
  datos,
  loading = false,
}: GraficoFacturacionPorCategoriaProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Facturación por Categoría</h3>
            <p className="text-sm text-gray-500">Distribución de ingresos</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Facturación por Categoría</h3>
            <p className="text-sm text-gray-500">Distribución de ingresos</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Colores para las categorías
  const colores = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];

  // Calcular el gráfico de tarta
  const total = datos.reduce((sum, item) => sum + item.total, 0);
  const radio = 100;
  const centroX = 120;
  const centroY = 120;
  let anguloInicio = -90; // Comenzar desde arriba

  const segmentos = datos.map((item, index) => {
    const porcentaje = item.porcentaje;
    const angulo = (porcentaje / 100) * 360;
    const anguloFin = anguloInicio + angulo;

    // Convertir a radianes
    const inicioRad = (anguloInicio * Math.PI) / 180;
    const finRad = (anguloFin * Math.PI) / 180;

    // Calcular puntos para el arco
    const x1 = centroX + radio * Math.cos(inicioRad);
    const y1 = centroY + radio * Math.sin(inicioRad);
    const x2 = centroX + radio * Math.cos(finRad);
    const y2 = centroY + radio * Math.sin(finRad);

    const largeArcFlag = angulo > 180 ? 1 : 0;

    const pathData = `M ${centroX} ${centroY} L ${x1} ${y1} A ${radio} ${radio} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const color = colores[index % colores.length];

    const segmento = {
      pathData,
      color,
      categoria: item.categoria,
      total: item.total,
      porcentaje: item.porcentaje,
    };

    anguloInicio = anguloFin;
    return segmento;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
          <PieChart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Facturación por Categoría</h3>
          <p className="text-sm text-gray-500">Distribución de ingresos</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8">
        {/* Gráfico de tarta */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 240 240" className="w-64 h-64">
            {segmentos.map((segmento, index) => (
              <path
                key={index}
                d={segmento.pathData}
                fill={segmento.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              />
            ))}
          </svg>
        </div>

        {/* Leyenda */}
        <div className="flex-1 space-y-3">
          {segmentos.map((segmento, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segmento.color }}
                ></div>
                <span className="font-medium text-gray-800">{segmento.categoria}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatearMoneda(segmento.total)}
                </div>
                <div className="text-sm text-gray-500">
                  {segmento.porcentaje.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-gray-200 mt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">{formatearMoneda(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


