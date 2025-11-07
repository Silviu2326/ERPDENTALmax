import { TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { ProductividadProfesional } from '../api/reportesProductividadApi';

interface ProductividadChartContainerProps {
  datos: ProductividadProfesional[];
  loading?: boolean;
}

export default function ProductividadChartContainer({
  datos,
  loading = false,
}: ProductividadChartContainerProps) {
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando gráficos...</p>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600 mb-4">Seleccione un rango de fechas para ver los gráficos</p>
      </div>
    );
  }

  // Ordenar por ingresos para mejor visualización
  const datosOrdenados = [...datos].sort((a, b) => b.ingresosTotales - a.ingresosTotales);
  const maxIngresos = Math.max(...datosOrdenados.map((d) => d.ingresosTotales), 1);
  const maxRentabilidad = Math.max(
    ...datosOrdenados.map((d) => d.rentabilidad),
    Math.max(...datosOrdenados.map((d) => Math.abs(d.rentabilidad)), 1)
  );

  const alturaMaxima = 200;
  const anchoBarra = 30;
  const espacioEntreBarras = 20;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Ingresos */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Ingresos por Profesional
          </h3>
          <p className="text-sm text-gray-600">Comparación de ingresos totales generados</p>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${datosOrdenados.length * (anchoBarra + espacioEntreBarras) + 40} ${alturaMaxima + 80}`}
            className="w-full h-64"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Eje Y - Etiquetas de valores */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const valor = maxIngresos * ratio;
              const y = alturaMaxima - alturaMaxima * ratio + 40;
              return (
                <g key={ratio}>
                  <line
                    x1="40"
                    y1={y}
                    x2={datosOrdenados.length * (anchoBarra + espacioEntreBarras) + 40}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text
                    x="35"
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-600"
                    fontSize="10"
                  >
                    {formatearMoneda(valor)}
                  </text>
                </g>
              );
            })}

            {/* Barras del gráfico */}
            {datosOrdenados.map((dato, index) => {
              const x = index * (anchoBarra + espacioEntreBarras) + 50;
              const altura = (dato.ingresosTotales / maxIngresos) * alturaMaxima;
              const yBase = alturaMaxima + 40;

              return (
                <g key={dato.profesionalId}>
                  <rect
                    x={x}
                    y={yBase - altura}
                    width={anchoBarra}
                    height={altura}
                    fill="#3b82f6"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  {/* Etiqueta del nombre (abreviado) */}
                  <text
                    x={x + anchoBarra / 2}
                    y={yBase + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    fontSize="9"
                    transform={`rotate(-45 ${x + anchoBarra / 2} ${yBase + 20})`}
                  >
                    {dato.nombreCompleto.length > 12
                      ? dato.nombreCompleto.substring(0, 12) + '...'
                      : dato.nombreCompleto}
                  </text>
                  {/* Tooltip con valor */}
                  <title>{`${dato.nombreCompleto}: ${formatearMoneda(dato.ingresosTotales)}`}</title>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Gráfico de Rentabilidad */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            Rentabilidad por Profesional
          </h3>
          <p className="text-sm text-gray-600">Ingresos menos coste de materiales</p>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${datosOrdenados.length * (anchoBarra + espacioEntreBarras) + 40} ${alturaMaxima + 80}`}
            className="w-full h-64"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Línea de referencia en cero */}
            <line
              x1="40"
              y1={alturaMaxima / 2 + 40}
              x2={datosOrdenados.length * (anchoBarra + espacioEntreBarras) + 40}
              y2={alturaMaxima / 2 + 40}
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="4,4"
            />

            {/* Eje Y - Etiquetas de valores */}
            {[-1, -0.5, 0, 0.5, 1].map((ratio) => {
              const valor = maxRentabilidad * ratio;
              const y = alturaMaxima / 2 - (alturaMaxima / 2) * ratio + 40;
              return (
                <g key={ratio}>
                  <line
                    x1="40"
                    y1={y}
                    x2={datosOrdenados.length * (anchoBarra + espacioEntreBarras) + 40}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text
                    x="35"
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-600"
                    fontSize="10"
                  >
                    {formatearMoneda(valor)}
                  </text>
                </g>
              );
            })}

            {/* Barras del gráfico */}
            {datosOrdenados.map((dato, index) => {
              const x = index * (anchoBarra + espacioEntreBarras) + 50;
              const altura = Math.abs((dato.rentabilidad / maxRentabilidad) * (alturaMaxima / 2));
              const yBase = alturaMaxima / 2 + 40;
              const color = dato.rentabilidad >= 0 ? '#10b981' : '#ef4444';
              const y = dato.rentabilidad >= 0 ? yBase - altura : yBase;

              return (
                <g key={dato.profesionalId}>
                  <rect
                    x={x}
                    y={y}
                    width={anchoBarra}
                    height={altura}
                    fill={color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  {/* Etiqueta del nombre (abreviado) */}
                  <text
                    x={x + anchoBarra / 2}
                    y={yBase + alturaMaxima / 2 + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    fontSize="9"
                    transform={`rotate(-45 ${x + anchoBarra / 2} ${yBase + alturaMaxima / 2 + 20})`}
                  >
                    {dato.nombreCompleto.length > 12
                      ? dato.nombreCompleto.substring(0, 12) + '...'
                      : dato.nombreCompleto}
                  </text>
                  {/* Tooltip con valor */}
                  <title>{`${dato.nombreCompleto}: ${formatearMoneda(dato.rentabilidad)}`}</title>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}



