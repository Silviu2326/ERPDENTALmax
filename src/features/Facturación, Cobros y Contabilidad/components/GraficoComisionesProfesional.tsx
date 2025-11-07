import { ReporteComisionProfesional } from '../api/comisionesApi';
import { TrendingUp } from 'lucide-react';

interface GraficoComisionesProfesionalProps {
  reportes: ReporteComisionProfesional[];
}

export default function GraficoComisionesProfesional({
  reportes,
}: GraficoComisionesProfesionalProps) {
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (reportes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
        <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos para mostrar</h3>
        <p className="text-gray-600 mb-4">Ajusta los filtros para ver resultados</p>
      </div>
    );
  }

  // Calcular el valor máximo para escalar el gráfico
  const maxValor = Math.max(
    ...reportes.map((r) => Math.max(r.totalComisionesPendientes, r.totalComisionesLiquidadas)),
    1
  );

  // Calcular altura máxima del gráfico
  const alturaMaxima = 250;
  const anchoBarra = 30;
  const espacioEntreBarras = 10;
  const espacioEntreGrupos = 40;
  const anchoTotal = reportes.length * (anchoBarra * 2 + espacioEntreBarras + espacioEntreGrupos) + 60;

  return (
    <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <TrendingUp size={18} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Comisiones por Profesional
          </h3>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-sm text-slate-700">Comisiones Pendientes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-slate-700">Comisiones Liquidadas</span>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${anchoTotal} ${alturaMaxima + 80}`}
          className="w-full h-80"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Eje Y - Etiquetas de valores */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const valor = maxValor * ratio;
            const y = alturaMaxima - alturaMaxima * ratio + 40;
            return (
              <g key={ratio}>
                <line
                  x1="40"
                  y1={y}
                  x2={anchoTotal - 20}
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
                  fontSize="12"
                >
                  {formatearMoneda(valor)}
                </text>
              </g>
            );
          })}

          {/* Barras del gráfico */}
          {reportes.map((reporte, index) => {
            const x = index * (anchoBarra * 2 + espacioEntreBarras + espacioEntreGrupos) + 50;
            const alturaPendientes = (reporte.totalComisionesPendientes / maxValor) * alturaMaxima;
            const alturaLiquidadas = (reporte.totalComisionesLiquidadas / maxValor) * alturaMaxima;
            const yBase = alturaMaxima + 40;
            const nombreCorto = `${reporte.profesional.nombre} ${reporte.profesional.apellidos}`.substring(0, 15);

            return (
              <g key={reporte.profesional._id}>
                {/* Barra de comisiones pendientes */}
                <rect
                  x={x}
                  y={yBase - alturaPendientes}
                  width={anchoBarra}
                  height={alturaPendientes}
                  fill="#f59e0b"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Barra de comisiones liquidadas */}
                <rect
                  x={x + anchoBarra + espacioEntreBarras}
                  y={yBase - alturaLiquidadas}
                  width={anchoBarra}
                  height={alturaLiquidadas}
                  fill="#10b981"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Etiqueta del profesional */}
                <text
                  x={x + anchoBarra}
                  y={yBase + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                  transform={`rotate(-45 ${x + anchoBarra} ${yBase + 20})`}
                >
                  {nombreCorto}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tabla de datos debajo del gráfico */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                Profesional
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-700 uppercase">
                Pendientes
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-700 uppercase">
                Liquidadas
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-700 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {reportes.map((reporte) => (
              <tr key={reporte.profesional._id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-gray-900">
                  {reporte.profesional.nombre} {reporte.profesional.apellidos}
                </td>
                <td className="px-4 py-2 text-right font-medium text-amber-600">
                  {formatearMoneda(reporte.totalComisionesPendientes)}
                </td>
                <td className="px-4 py-2 text-right font-medium text-green-600">
                  {formatearMoneda(reporte.totalComisionesLiquidadas)}
                </td>
                <td className="px-4 py-2 text-right font-bold text-blue-600">
                  {formatearMoneda(reporte.totalComisiones)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <p className="text-sm font-medium text-slate-700 mb-1">Total Comisiones</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatearMoneda(
              reportes.reduce((sum, r) => sum + r.totalComisiones, 0)
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <p className="text-sm font-medium text-slate-700 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600">
            {formatearMoneda(
              reportes.reduce((sum, r) => sum + r.totalComisionesPendientes, 0)
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <p className="text-sm font-medium text-slate-700 mb-1">Liquidadas</p>
          <p className="text-2xl font-bold text-green-600">
            {formatearMoneda(
              reportes.reduce((sum, r) => sum + r.totalComisionesLiquidadas, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

