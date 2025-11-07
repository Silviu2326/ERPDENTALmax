import { CheckCircle, Clock, XCircle, AlertCircle, UserCheck } from 'lucide-react';

export type EstadoCita = 'programada' | 'confirmada' | 'cancelada' | 'realizada' | 'no-asistio';

interface SelectorEstadoCitaProps {
  estado: EstadoCita;
  onEstadoChange: (estado: EstadoCita) => void;
  disabled?: boolean;
}

const ESTADOS: Array<{ value: EstadoCita; label: string; icon: React.ReactNode; color: string }> = [
  {
    value: 'programada',
    label: 'Programada',
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    value: 'confirmada',
    label: 'Confirmada',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800 border-green-300',
  },
  {
    value: 'realizada',
    label: 'Realizada',
    icon: <UserCheck className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    value: 'cancelada',
    label: 'Cancelada',
    icon: <XCircle className="w-4 h-4" />,
    color: 'bg-red-100 text-red-800 border-red-300',
  },
  {
    value: 'no-asistio',
    label: 'No Asistió',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'bg-orange-100 text-orange-800 border-orange-300',
  },
];

export default function SelectorEstadoCita({
  estado,
  onEstadoChange,
  disabled = false,
}: SelectorEstadoCitaProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Estado de la Cita
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {ESTADOS.map((estadoOption) => (
          <button
            key={estadoOption.value}
            type="button"
            onClick={() => !disabled && onEstadoChange(estadoOption.value)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              estado === estadoOption.value
                ? `${estadoOption.color} ring-2 ring-offset-2 ring-blue-500`
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {estadoOption.icon}
            <span className="text-xs font-medium mt-1">{estadoOption.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}



