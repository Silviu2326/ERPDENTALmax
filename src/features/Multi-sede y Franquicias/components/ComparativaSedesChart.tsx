import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Loader2 } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center ring-1 ring-slate-200">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando datos del gráfico...</p>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center ring-1 ring-slate-200">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron datos para mostrar el gráfico comparativo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 ring-1 ring-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={20} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">{getTitulo()}</h2>
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



