import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown } from 'lucide-react';
import { EvolucionAusencias } from '../api/analiticaApi';

interface GraficoTasaAusenciasProps {
  datos: EvolucionAusencias[];
  loading?: boolean;
}

export default function GraficoTasaAusencias({
  datos,
  loading = false,
}: GraficoTasaAusenciasProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <TrendingDown className="w-12 h-12 mb-4 text-gray-400" />
          <p>No hay datos disponibles para mostrar</p>
        </div>
      </div>
    );
  }

  // Formatear fechas para mostrar en el gráfico
  const datosFormateados = datos.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    }),
    tasa: parseFloat(item.tasa.toFixed(2)),
    total: item.total,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <TrendingDown className="w-5 h-5" />
          <span>Evolución de la Tasa de Ausentismo</span>
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosFormateados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="fecha"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Tasa (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value}%`, 'Tasa de Ausentismo']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="tasa"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
            name="Tasa de Ausentismo (%)"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-600">
        <p>Total de ausencias en el período: {datos.reduce((acc, item) => acc + item.total, 0)}</p>
      </div>
    </div>
  );
}


