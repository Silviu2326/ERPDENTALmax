import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComparativaItem } from '../api/analiticaApi';

interface GraficoComparativoProfesionalesProps {
  datos: ComparativaItem[];
  loading?: boolean;
}

export default function GraficoComparativoProfesionales({
  datos,
  loading = false,
}: GraficoComparativoProfesionalesProps) {
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Profesionales</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Profesionales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="nombre" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis tickFormatter={formatearMoneda} />
          <Tooltip formatter={(value: number) => formatearMoneda(value)} />
          <Legend />
          <Bar dataKey="produccion" fill="#3b82f6" name="Producción" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


