import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { ProveedorKPIs } from '../../api/crmApi';
import MetricCards from '../MetricCards';

export default function ProveedorKPIsWidget() {
  const [kpis, setKpis] = useState<ProveedorKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarKPIs();
  }, []);

  const cargarKPIs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de KPIs
      const datos: ProveedorKPIs = {
        totalProveedores: 12,
        contratosActivos: 8,
        gastoUltimoMes: 45230.50,
        calificacionMedia: 4.6,
        proveedoresPorCategoria: [
          { categoria: 'Consumibles', cantidad: 5 },
          { categoria: 'Equipamiento', cantidad: 4 },
          { categoria: 'Instrumental', cantidad: 3 },
          { categoria: 'Oficina', cantidad: 2 },
        ],
      };
      
      setKpis(datos);
    } catch (err) {
      setError('Error al cargar KPIs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error && !kpis) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <MetricCards
      data={[
        {
          id: 'total-proveedores',
          title: 'Total Proveedores',
          value: kpis.totalProveedores,
          color: 'info',
        },
        {
          id: 'contratos-activos',
          title: 'Contratos Activos',
          value: kpis.contratosActivos,
          color: 'success',
        },
        {
          id: 'gasto-ultimo-mes',
          title: 'Gasto Último Mes',
          value: kpis.gastoUltimoMes,
          color: 'info',
        },
        {
          id: 'calificacion-media',
          title: 'Calificación Media',
          value: kpis.calificacionMedia.toFixed(1),
          color: 'warning',
        },
      ]}
    />
  );
}


