import { useEffect, useState } from 'react';
import { Building2, FileText, DollarSign, Star, TrendingUp } from 'lucide-react';
import { ProveedorKPIs } from '../../api/crmApi';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !kpis) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!kpis) return null;

  const cards = [
    {
      title: 'Total Proveedores',
      value: kpis.totalProveedores,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Contratos Activos',
      value: kpis.contratosActivos,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Gasto Último Mes',
      value: `€${kpis.gastoUltimoMes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Calificación Media',
      value: kpis.calificacionMedia.toFixed(1),
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}


