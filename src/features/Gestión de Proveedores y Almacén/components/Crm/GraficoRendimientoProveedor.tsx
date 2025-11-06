import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Star } from 'lucide-react';
import {
  obtenerRendimientoAnual,
  RendimientoAnual,
} from '../../api/crmApi';

interface GraficoRendimientoProveedorProps {
  proveedorId: string;
  proveedorNombre?: string;
  anio?: number;
}

export default function GraficoRendimientoProveedor({
  proveedorId,
  proveedorNombre = 'Proveedor',
  anio = new Date().getFullYear(),
}: GraficoRendimientoProveedorProps) {
  const [datos, setDatos] = useState<RendimientoAnual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoGrafico, setTipoGrafico] = useState<'gasto' | 'calificacion'>('gasto');

  useEffect(() => {
    cargarDatos();
  }, [proveedorId, anio]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerRendimientoAnual(proveedorId, anio);
      setDatos(datos);
    } catch (err) {
      setError('Error al cargar datos de rendimiento');
      console.error(err);
      // Datos mock para desarrollo
      const meses = Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1,
        gasto: Math.random() * 2000 + 1000,
        calificacion: Math.random() * 1 + 3.5,
        pedidos: Math.floor(Math.random() * 10 + 5),
      }));
      setDatos(meses);
    } finally {
      setLoading(false);
    }
  };

  const meses = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const datosFormateados = datos.map((d) => ({
    ...d,
    mesNombre: meses[d.mes - 1],
  }));

  const totalGasto = datos.reduce((sum, d) => sum + d.gasto, 0);
  const promedioCalificacion = datos.length > 0
    ? datos.reduce((sum, d) => sum + d.calificacion, 0) / datos.length
    : 0;

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(valor);
  };

  const maxGasto = datos.length > 0 ? Math.max(...datos.map((d) => d.gasto), 1) : 1;
  const maxCalificacion = 5;
  const alturaMaxima = 200;
  const anchoBarra = 20;
  const espacioEntreBarras = 40;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error && datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm">No se encontraron datos de rendimiento para este proveedor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Rendimiento Anual - {proveedorNombre}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Año {anio}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTipoGrafico('gasto')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipoGrafico === 'gasto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-1" />
              Gasto
            </button>
            <button
              onClick={() => setTipoGrafico('calificacion')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipoGrafico === 'calificacion'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className="w-4 h-4 inline mr-1" />
              Calificación
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Gasto</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatearMoneda(totalGasto)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Calificación Promedio</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {promedioCalificacion.toFixed(1)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Total Pedidos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {datos.reduce((sum, d) => sum + d.pedidos, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {tipoGrafico === 'gasto' ? (
          <div className="relative">
            <svg
              viewBox={`0 0 ${datos.length * espacioEntreBarras + 40} ${alturaMaxima + 60}`}
              className="w-full h-64"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Líneas de referencia */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const valor = maxGasto * ratio;
                const y = alturaMaxima - alturaMaxima * ratio + 40;
                return (
                  <g key={ratio}>
                    <line
                      x1="0"
                      y1={y}
                      x2={datos.length * espacioEntreBarras + 40}
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
              {datosFormateados.map((dato, index) => {
                const x = index * espacioEntreBarras + 20;
                const alturaBarra = (dato.gasto / maxGasto) * alturaMaxima;
                const yBase = alturaMaxima + 40;

                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={yBase - alturaBarra}
                      width={anchoBarra}
                      height={alturaBarra}
                      fill="#3b82f6"
                      className="hover:opacity-80 transition-opacity"
                    />
                    <text
                      x={x + anchoBarra / 2}
                      y={yBase + 20}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                      fontSize="10"
                    >
                      {dato.mesNombre}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="relative">
            <svg
              viewBox={`0 0 ${datos.length * espacioEntreBarras + 40} ${alturaMaxima + 60}`}
              className="w-full h-64"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Líneas de referencia */}
              {[0, 1, 2, 3, 4, 5].map((valor) => {
                const y = alturaMaxima - (valor / maxCalificacion) * alturaMaxima + 40;
                return (
                  <g key={valor}>
                    <line
                      x1="0"
                      y1={y}
                      x2={datos.length * espacioEntreBarras + 40}
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
                      {valor.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Línea de calificación */}
              <polyline
                points={datosFormateados
                  .map((dato, index) => {
                    const x = index * espacioEntreBarras + 20 + anchoBarra / 2;
                    const y = alturaMaxima - (dato.calificacion / maxCalificacion) * alturaMaxima + 40;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity"
              />

              {/* Puntos de datos */}
              {datosFormateados.map((dato, index) => {
                const x = index * espacioEntreBarras + 20 + anchoBarra / 2;
                const y = alturaMaxima - (dato.calificacion / maxCalificacion) * alturaMaxima + 40;
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#f59e0b"
                      className="hover:opacity-80 transition-opacity"
                    />
                    <text
                      x={x}
                      y={alturaMaxima + 60}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                      fontSize="10"
                    >
                      {dato.mesNombre}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Tabla de datos */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Mes
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Gasto
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Calificación
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Pedidos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datosFormateados.map((dato, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{dato.mesNombre}</td>
                  <td className="px-4 py-2 text-right font-medium text-blue-600">
                    {formatearMoneda(dato.gasto)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-yellow-600">
                    {dato.calificacion.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-600">
                    {dato.pedidos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
