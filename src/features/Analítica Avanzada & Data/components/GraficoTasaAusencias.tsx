import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, Loader2 } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <TrendingDown size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron datos para mostrar el gráfico</p>
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
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingDown size={20} />
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
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Tasa de Ausentismo (%)"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
        <p>Total de ausencias en el período: {datos.reduce((acc, item) => acc + item.total, 0)}</p>
      </div>
    </div>
  );
}



