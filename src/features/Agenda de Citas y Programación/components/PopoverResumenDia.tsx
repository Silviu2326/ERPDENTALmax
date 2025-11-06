import { ResumenDiaCitas } from '../api/citasApi';
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface PopoverResumenDiaProps {
  resumen: ResumenDiaCitas;
  fecha: Date;
}

const ESTADOS_COLORS: { [key: string]: string } = {
  confirmada: 'bg-green-100 text-green-800 border-green-300',
  programada: 'bg-blue-100 text-blue-800 border-blue-300',
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  cancelada: 'bg-red-100 text-red-800 border-red-300',
  realizada: 'bg-gray-100 text-gray-800 border-gray-300',
  'no-asistio': 'bg-orange-100 text-orange-800 border-orange-300',
};

const ESTADOS_ICONS: { [key: string]: any } = {
  confirmada: CheckCircle,
  programada: Clock,
  pendiente: AlertCircle,
  cancelada: XCircle,
  realizada: CheckCircle,
  'no-asistio': XCircle,
};

const ESTADOS_LABELS: { [key: string]: string } = {
  confirmada: 'Confirmadas',
  programada: 'Programadas',
  pendiente: 'Pendientes',
  cancelada: 'Canceladas',
  realizada: 'Realizadas',
  'no-asistio': 'No Asistió',
};

export default function PopoverResumenDia({ resumen, fecha }: PopoverResumenDiaProps) {
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const esHoy = fecha.toDateString() === new Date().toDateString();
  const esPasado = fecha < new Date() && !esHoy;
  const esFuturo = fecha > new Date();

  // Calcular porcentajes
  const estadosArray = Object.entries(resumen.estados || {});
  const confirmadas = resumen.estados?.confirmada || 0;
  const programadas = resumen.estados?.programada || 0;
  const realizadas = resumen.estados?.realizada || 0;
  const canceladas = resumen.estados?.cancelada || 0;
  const tasaConfirmacion = resumen.total > 0 
    ? Math.round(((confirmadas + realizadas) / resumen.total) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-5 min-w-[280px] max-w-[320px] z-50">
      <div className="mb-4 pb-3 border-b-2 border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-800 text-sm capitalize">{fechaStr}</h3>
          {esHoy && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              Hoy
            </span>
          )}
          {esPasado && (
            <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              Pasado
            </span>
          )}
          {esFuturo && (
            <span className="bg-green-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              Futuro
            </span>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Total de citas:</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{resumen.total}</span>
        </div>
        
        {resumen.total > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Tasa de confirmación:</span>
              <span className={`font-bold ${
                tasaConfirmacion >= 70 ? 'text-green-600' :
                tasaConfirmacion >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {tasaConfirmacion}%
              </span>
            </div>
          </div>
        )}
      </div>
      
      {resumen.total > 0 && estadosArray.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Desglose por estado:</p>
          </div>
          {estadosArray.map(([estado, cantidad]) => {
            const Icon = ESTADOS_ICONS[estado] || Clock;
            const porcentaje = resumen.total > 0 
              ? Math.round((cantidad / resumen.total) * 100) 
              : 0;
            
            return (
              <div
                key={estado}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 text-xs transition-all hover:scale-105 ${
                  ESTADOS_COLORS[estado] || 'bg-gray-100 text-gray-800 border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="font-medium capitalize">{ESTADOS_LABELS[estado] || estado}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">({porcentaje}%)</span>
                  <span className="font-bold text-base">{cantidad}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {resumen.total === 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <div className="text-sm text-gray-500 italic">No hay citas programadas</div>
          <div className="text-xs text-gray-400 mt-1">Día disponible</div>
        </div>
      )}
    </div>
  );
}

