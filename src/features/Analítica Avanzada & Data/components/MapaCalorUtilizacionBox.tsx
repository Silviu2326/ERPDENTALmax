import { UtilizacionCalor } from '../api/analiticaApi';

interface MapaCalorUtilizacionBoxProps {
  datos: UtilizacionCalor[];
  loading?: boolean;
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const FRANJAS_HORARIAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

export default function MapaCalorUtilizacionBox({
  datos,
  loading = false,
}: MapaCalorUtilizacionBoxProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa de Calor - Utilización de Boxes</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  // Crear matriz de datos
  const matriz: { [key: string]: UtilizacionCalor } = {};
  datos.forEach((item) => {
    const key = `${item.diaSemana}-${item.franjaHoraria}`;
    matriz[key] = item;
  });

  const getColor = (porcentaje: number) => {
    if (porcentaje >= 80) return 'bg-green-600';
    if (porcentaje >= 60) return 'bg-green-400';
    if (porcentaje >= 40) return 'bg-yellow-400';
    if (porcentaje >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa de Calor - Utilización de Boxes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-2 py-2 text-xs font-medium text-gray-700"></th>
              {FRANJAS_HORARIAS.map((franja) => (
                <th key={franja} className="px-2 py-2 text-xs font-medium text-gray-700 text-center">
                  {franja}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIAS_SEMANA.map((dia, diaIndex) => (
              <tr key={dia}>
                <td className="px-2 py-2 text-xs font-medium text-gray-700">{dia}</td>
                {FRANJAS_HORARIAS.map((franja) => {
                  const key = `${diaIndex}-${franja}`;
                  const item = matriz[key];
                  const porcentaje = item?.utilizacionPorcentaje || 0;
                  return (
                    <td
                      key={franja}
                      className={`px-2 py-2 text-center text-xs text-white ${getColor(porcentaje)}`}
                      title={`${dia} ${franja}: ${porcentaje.toFixed(1)}%`}
                    >
                      {porcentaje > 0 ? `${porcentaje.toFixed(0)}%` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span className="text-xs text-gray-600">0-20%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span className="text-xs text-gray-600">20-40%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-xs text-gray-600">40-60%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span className="text-xs text-gray-600">60-80%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span className="text-xs text-gray-600">80-100%</span>
        </div>
      </div>
    </div>
  );
}


