import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComparativaItem } from '../api/analiticaApi';
import { Loader2, BarChart3 } from 'lucide-react';

interface GraficoComparativoProfesionalesProps {
  datos: ComparativaItem[];
  loading?: boolean;
}

export default function GraficoComparativoProfesionales({
  datos,
  loading = false,
}: GraficoComparativoProfesionalesProps) {
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
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparativa de Profesionales</h3>
        <p className="text-gray-600">No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Profesionales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="nombre" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatearMoneda} 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            formatter={(value: number) => formatearMoneda(value)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="produccion" fill="#3b82f6" name="Producción" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}



