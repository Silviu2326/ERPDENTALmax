import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CosteEquipo } from '../api/informesEquipamientoApi';

interface GraficoCostesPorCategoriaProps {
  costes: CosteEquipo[];
  loading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function GraficoCostesPorCategoria({
  costes,
  loading = false,
}: GraficoCostesPorCategoriaProps) {
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Agrupar costes por categoría
  const datosPorCategoria = costes.reduce((acc, coste) => {
    const categoriaNombre = coste.categoria.nombre;
    const existing = acc.find((item) => item.name === categoriaNombre);
    
    if (existing) {
      existing.value += coste.costeTotal;
    } else {
      acc.push({
        name: categoriaNombre,
        value: coste.costeTotal,
      });
    }
    
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  // Ordenar por valor descendente
  datosPorCategoria.sort((a, b) => b.value - a.value);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (datosPorCategoria.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Distribución de Costes por Categoría
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600 font-medium">
            {formatearMoneda(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {((payload[0].value / datosPorCategoria.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% del total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Distribución de Costes por Categoría
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datosPorCategoria}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {datosPorCategoria.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


