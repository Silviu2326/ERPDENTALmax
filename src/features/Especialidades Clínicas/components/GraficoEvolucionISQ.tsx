import { MedicionOsteointegracion } from '../api/implantesApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface GraficoEvolucionISQProps {
  mediciones: MedicionOsteointegracion[];
}

export default function GraficoEvolucionISQ({ mediciones }: GraficoEvolucionISQProps) {
  // Filtrar y formatear datos para el gráfico
  const datosGrafico = mediciones
    .filter((m) => m.tipoMedicion === 'ISQ')
    .map((medicion) => ({
      fecha: new Date(medicion.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
      }),
      fechaCompleta: new Date(medicion.fecha).toISOString(),
      valor: parseFloat(medicion.valor) || 0,
      tipo: medicion.tipoMedicion,
    }))
    .sort((a, b) => new Date(a.fechaCompleta).getTime() - new Date(b.fechaCompleta).getTime());

  if (datosGrafico.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolución de Mediciones ISQ</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No hay mediciones ISQ registradas para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolución de Mediciones ISQ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 12 }}
            label={{ value: 'Fecha', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: 'ISQ', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value: number) => [`ISQ: ${value}`, '']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="ISQ"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Total de mediciones:</strong> {datosGrafico.length}
        </p>
        {datosGrafico.length > 0 && (
          <p>
            <strong>Rango:</strong> {Math.min(...datosGrafico.map((d) => d.valor))} -{' '}
            {Math.max(...datosGrafico.map((d) => d.valor))}
          </p>
        )}
      </div>
    </div>
  );
}

