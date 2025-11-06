import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VisualizationType } from './VisualizationSelector';

interface ReportChartRendererProps {
  data: any[];
  visualizationType: VisualizationType;
  grouping?: string[];
  aggregation?: Array<{ field: string; function: string; label?: string }>;
  loading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function ReportChartRenderer({
  data,
  visualizationType,
  grouping = [],
  aggregation = [],
  loading = false,
}: ReportChartRendererProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
        <div className="text-center py-12 text-gray-500">
          <p>No hay datos para visualizar</p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const chartData = data.map((row) => {
    const item: any = {};
    grouping.forEach((group) => {
      item[group] = row[group] ?? '-';
    });
    aggregation.forEach((agg) => {
      const key = agg.label || `${agg.function}_${agg.field}`;
      item[key] = row[key] ?? row[agg.field] ?? 0;
    });
    return item;
  });

  const renderChart = () => {
    switch (visualizationType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={grouping[0] || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {aggregation.map((agg, index) => {
                const key = agg.label || `${agg.function}_${agg.field}`;
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={COLORS[index % COLORS.length]}
                    name={agg.label || `${agg.function}(${agg.field})`}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={grouping[0] || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {aggregation.map((agg, index) => {
                const key = agg.label || `${agg.function}_${agg.field}`;
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    name={agg.label || `${agg.function}(${agg.field})`}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        if (aggregation.length === 0) {
          return (
            <div className="text-center py-12 text-gray-500">
              <p>Los gráficos circulares requieren cálculos agregados</p>
            </div>
          );
        }
        const pieData = chartData.map((item, index) => {
          const agg = aggregation[0];
          const key = agg.label || `${agg.function}_${agg.field}`;
          const labelKey = grouping[0] || 'name';
          return {
            name: String(item[labelKey] ?? `Item ${index + 1}`),
            value: Number(item[key] ?? 0),
          };
        });
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <p>Tipo de visualización no soportado</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Visualización</h3>
        <p className="text-sm text-gray-500">
          {visualizationType === 'bar' && 'Gráfico de Barras'}
          {visualizationType === 'line' && 'Gráfico de Líneas'}
          {visualizationType === 'pie' && 'Gráfico Circular'}
        </p>
      </div>
      {renderChart()}
    </div>
  );
}


