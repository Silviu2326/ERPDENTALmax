import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { SedeSummary } from '../api/dashboardSedesApi';

interface ComparativaSedesChartProps {
  datos: SedeSummary[];
  metrica: 'ingresos' | 'pacientes' | 'citas' | 'ocupacion';
  loading?: boolean;
}

export default function ComparativaSedesChart({
  datos,
  metrica,
  loading = false,
}: ComparativaSedesChartProps) {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearPorcentaje = (valor: number) => {
    return `${(valor * 100).toFixed(1)}%`;
  };

  const prepararDatos = () => {
    return datos.map((sede) => {
      let valor: number;
      let nombreMetrica: string;
      let formateador: (v: number) => string;

      switch (metrica) {
        case 'ingresos':
          valor = sede.totalIngresos;
          nombreMetrica = 'Ingresos';
          formateador = formatearMoneda;
          break;
        case 'pacientes':
          valor = sede.nuevosPacientes;
          nombreMetrica = 'Nuevos Pacientes';
          formateador = (v) => v.toString();
          break;
        case 'citas':
          valor = sede.citasAtendidas;
          nombreMetrica = 'Citas Atendidas';
          formateador = (v) => v.toString();
          break;
        case 'ocupacion':
          valor = sede.tasaOcupacion * 100;
          nombreMetrica = 'Tasa de Ocupación (%)';
          formateador = (v) => `${v.toFixed(1)}%`;
          break;
      }

      return {
        nombre: sede.nombreSede,
        valor: valor,
        nombreMetrica,
        formateador,
      };
    });
  };

  const datosPreparados = prepararDatos();

  const getTitulo = () => {
    switch (metrica) {
      case 'ingresos':
        return 'Comparativa de Ingresos por Sede';
      case 'pacientes':
        return 'Comparativa de Nuevos Pacientes por Sede';
      case 'citas':
        return 'Comparativa de Citas Atendidas por Sede';
      case 'ocupacion':
        return 'Comparativa de Tasa de Ocupación por Sede';
    }
  };

  const getColor = () => {
    switch (metrica) {
      case 'ingresos':
        return '#10b981'; // green
      case 'pacientes':
        return '#3b82f6'; // blue
      case 'citas':
        return '#8b5cf6'; // purple
      case 'ocupacion':
        return '#f59e0b'; // orange
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">{getTitulo()}</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando datos...</div>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">{getTitulo()}</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No hay datos disponibles</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">{getTitulo()}</h2>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={datosPreparados}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="nombre"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={
              metrica === 'ingresos'
                ? (value) => formatearMoneda(value)
                : metrica === 'ocupacion'
                ? (value) => `${value}%`
                : undefined
            }
          />
          <Tooltip
            formatter={(value: number) => {
              const item = datosPreparados.find((d) => d.valor === value);
              return item?.formateador(value) || value;
            }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            dataKey="valor"
            name={datosPreparados[0]?.nombreMetrica || 'Valor'}
            fill={getColor()}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


