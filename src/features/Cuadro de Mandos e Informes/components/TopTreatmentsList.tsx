import { Award, TrendingUp } from 'lucide-react';

interface TopTreatmentsListProps {
  tratamientos: Array<{
    _id: string;
    nombre: string;
    cantidad: number;
    ingresos: number;
  }>;
  maxItems?: number;
}

export default function TopTreatmentsList({
  tratamientos,
  maxItems = 5,
}: TopTreatmentsListProps) {
  const tratamientosOrdenados = [...tratamientos]
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, maxItems);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const getMedallaColor = (posicion: number) => {
    switch (posicion) {
      case 1:
        return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900';
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
      case 3:
        return 'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900';
      default:
        return 'bg-gradient-to-br from-blue-400 to-blue-500 text-blue-900';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
          <Award size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Tratamientos Más Rentables</h3>
          <p className="text-sm text-gray-600">Top {maxItems} tratamientos por ingresos</p>
        </div>
      </div>

      <div className="space-y-4">
        {tratamientosOrdenados.length > 0 ? (
          tratamientosOrdenados.map((tratamiento, index) => (
            <div
              key={tratamiento._id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getMedallaColor(
                    index + 1
                  )}`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{tratamiento.nombre}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {tratamiento.cantidad} {tratamiento.cantidad === 1 ? 'vez' : 'veces'}
                    </span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatearMoneda(tratamiento.ingresos)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay datos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}



