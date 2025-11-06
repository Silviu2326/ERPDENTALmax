import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ProduccionBox } from '../api/analiticaApi';

interface GraficoProduccionPorBoxProps {
  datos: ProduccionBox[];
  loading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function GraficoProduccionPorBox({
  datos,
  loading = false,
}: GraficoProduccionPorBoxProps) {
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Producción por Box</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  const datosGrafico = datos.map((box) => ({
    name: box.boxNombre,
    value: box.produccionTotal,
    porcentaje: box.utilizacionPorcentaje,
  }));

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Producción por Box</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datosGrafico}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, porcentaje }) => `${name}: ${porcentaje.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {datosGrafico.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatearMoneda(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


