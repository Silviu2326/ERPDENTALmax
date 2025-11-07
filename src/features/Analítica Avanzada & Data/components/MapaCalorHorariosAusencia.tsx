import { Calendar, Clock, Loader2 } from 'lucide-react';

interface MapaCalorHorariosAusenciaProps {
  datos?: Array<{
    dia: string;
    hora: string;
    cantidad: number;
  }>;
  loading?: boolean;
}

export default function MapaCalorHorariosAusencia({
  datos,
  loading = false,
}: MapaCalorHorariosAusenciaProps) {
  // Generar datos de ejemplo si no hay datos reales
  const datosEjemplo = datos || [
    { dia: 'Lunes', hora: '09:00', cantidad: 2 },
    { dia: 'Lunes', hora: '10:00', cantidad: 5 },
    { dia: 'Lunes', hora: '11:00', cantidad: 3 },
    { dia: 'Martes', hora: '09:00', cantidad: 4 },
    { dia: 'Martes', hora: '10:00', cantidad: 6 },
    { dia: 'Martes', hora: '11:00', cantidad: 2 },
    { dia: 'Miércoles', hora: '09:00', cantidad: 1 },
    { dia: 'Miércoles', hora: '10:00', cantidad: 3 },
    { dia: 'Miércoles', hora: '11:00', cantidad: 4 },
    { dia: 'Jueves', hora: '09:00', cantidad: 3 },
    { dia: 'Jueves', hora: '10:00', cantidad: 5 },
    { dia: 'Jueves', hora: '11:00', cantidad: 2 },
    { dia: 'Viernes', hora: '09:00', cantidad: 2 },
    { dia: 'Viernes', hora: '10:00', cantidad: 4 },
    { dia: 'Viernes', hora: '11:00', cantidad: 3 },
  ];

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const obtenerValor = (dia: string, hora: string) => {
    const dato = datosEjemplo.find((d) => d.dia === dia && d.hora === hora);
    return dato?.cantidad || 0;
  };

  const obtenerColor = (valor: number, max: number) => {
    if (valor === 0) return 'bg-gray-50';
    const intensidad = valor / max;
    if (intensidad > 0.7) return 'bg-red-600 text-white';
    if (intensidad > 0.5) return 'bg-orange-500 text-white';
    if (intensidad > 0.3) return 'bg-yellow-400 text-gray-900';
    return 'bg-yellow-100 text-gray-900';
  };

  const maxValor = Math.max(...datosEjemplo.map((d) => d.cantidad), 1);

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock size={20} />
          <span>Mapa de Calor: Ausencias por Día y Hora</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Calendar size={16} className="inline mr-1" />
                  Día / Hora
                </th>
                {horas.map((hora) => (
                  <th key={hora} className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    {hora}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diasSemana.map((dia) => (
                <tr key={dia}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap">{dia}</td>
                  {horas.map((hora) => {
                    const valor = obtenerValor(dia, hora);
                    return (
                      <td
                        key={`${dia}-${hora}`}
                        className={`px-3 py-2 text-center text-xs font-semibold ${obtenerColor(valor, maxValor)}`}
                        title={`${dia} ${hora}: ${valor} ausencias`}
                      >
                        {valor > 0 ? valor : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-300"></div>
            <span>Sin ausencias</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100"></div>
            <span>Bajo (1-2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400"></div>
            <span>Medio (3-4)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500"></div>
            <span>Alto (5-6)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600"></div>
            <span>Muy Alto (7+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}



