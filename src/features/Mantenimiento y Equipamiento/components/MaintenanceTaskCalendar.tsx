import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { MaintenancePlan } from '../api/maintenanceApi';

interface MaintenanceTaskCalendarProps {
  plans: MaintenancePlan[];
  onTaskClick?: (plan: MaintenancePlan) => void;
}

export default function MaintenanceTaskCalendar({
  plans,
  onTaskClick,
}: MaintenanceTaskCalendarProps) {
  const [fechaActual, setFechaActual] = useState(new Date());

  const mesActual = fechaActual.getMonth();
  const anioActual = fechaActual.getFullYear();

  const primerDiaDelMes = new Date(anioActual, mesActual, 1).getDay();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const anteriorMes = () => {
    setFechaActual(new Date(anioActual, mesActual - 1, 1));
  };

  const siguienteMes = () => {
    setFechaActual(new Date(anioActual, mesActual + 1, 1));
  };

  const obtenerTareasPorDia = (dia: number) => {
    const fecha = new Date(anioActual, mesActual, dia);
    return plans.filter((plan) => {
      if (!plan.isActive) return false;
      const fechaVencimiento = new Date(plan.nextDueDate);
      return (
        fechaVencimiento.getDate() === fecha.getDate() &&
        fechaVencimiento.getMonth() === fecha.getMonth() &&
        fechaVencimiento.getFullYear() === fecha.getFullYear()
      );
    });
  };

  const esHoy = (dia: number) => {
    const hoy = new Date();
    return (
      dia === hoy.getDate() &&
      mesActual === hoy.getMonth() &&
      anioActual === hoy.getFullYear()
    );
  };

  const esPasado = (dia: number) => {
    const fecha = new Date(anioActual, mesActual, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy;
  };

  const esProximo = (dia: number) => {
    const fecha = new Date(anioActual, mesActual, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const en7Dias = new Date();
    en7Dias.setDate(en7Dias.getDate() + 7);
    en7Dias.setHours(23, 59, 59, 999);
    return fecha >= hoy && fecha <= en7Dias;
  };

  const generarDiasDelMes = () => {
    const dias = [];
    // Días vacíos al inicio
    for (let i = 0; i < primerDiaDelMes; i++) {
      dias.push(null);
    }
    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(dia);
    }
    return dias;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {meses[mesActual]} {anioActual}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={anteriorMes}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setFechaActual(new Date())}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={siguienteMes}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map((dia) => (
          <div key={dia} className="text-center text-sm font-medium text-gray-500 py-2">
            {dia}
          </div>
        ))}
        {generarDiasDelMes().map((dia, index) => {
          if (dia === null) {
            return <div key={`empty-${index}`} className="h-20"></div>;
          }

          const tareas = obtenerTareasPorDia(dia);
          const pasado = esPasado(dia);
          const proximo = esProximo(dia);
          const hoy = esHoy(dia);

          return (
            <div
              key={dia}
              className={`h-20 border rounded-lg p-1 overflow-y-auto ${
                hoy
                  ? 'bg-blue-50 border-blue-300'
                  : pasado && tareas.length > 0
                  ? 'bg-red-50 border-red-200'
                  : proximo && tareas.length > 0
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  hoy ? 'text-blue-700' : pasado ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {dia}
              </div>
              {tareas.length > 0 && (
                <div className="space-y-1">
                  {tareas.slice(0, 2).map((plan) => (
                    <div
                      key={plan._id}
                      onClick={() => onTaskClick && onTaskClick(plan)}
                      className={`text-xs p-1 rounded cursor-pointer truncate ${
                        pasado
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : proximo
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                      title={plan.name}
                    >
                      {plan.name}
                    </div>
                  ))}
                  {tareas.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{tareas.length - 2} más
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
          <span className="text-gray-600">Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
          <span className="text-gray-600">Próximos 7 días</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
          <span className="text-gray-600">Vencidos</span>
        </div>
      </div>
    </div>
  );
}


