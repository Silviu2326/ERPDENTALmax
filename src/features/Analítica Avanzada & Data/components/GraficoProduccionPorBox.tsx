import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ProduccionBox } from '../api/analiticaApi';
import { Loader2, PieChart as PieChartIcon } from 'lucide-react';

interface GraficoProduccionPorBoxProps {
  datos: ProduccionBox[];
  loading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function GraficoProduccionPorBox({
  datos,
  loading = false,
}: GraficoProduccionPorBoxProps) {
  const formatearMoneda = (valor: number) => {
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
        <p className="text-gray-600">Cargando gráfico...</p>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <PieChartIcon size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Producción por Box</h3>
        <p className="text-gray-600">No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  const datosGrafico = datos.map((box) => ({
    name: box.boxNombre,
    value: box.produccionTotal,
    porcentaje: box.utilizacionPorcentaje,
  }));

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
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
          <Tooltip 
            formatter={(value: number) => formatearMoneda(value)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}



