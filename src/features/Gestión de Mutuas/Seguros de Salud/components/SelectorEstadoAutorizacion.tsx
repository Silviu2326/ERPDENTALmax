import { useState } from 'react';
import { Check, X, AlertCircle, Clock } from 'lucide-react';

interface SelectorEstadoAutorizacionProps {
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional';
  onEstadoChange: (nuevoEstado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional') => void;
  disabled?: boolean;
}

const ESTADOS = [
  { value: 'Pendiente' as const, label: 'Pendiente', icon: Clock, color: 'yellow' },
  { value: 'Aprobada' as const, label: 'Aprobada', icon: Check, color: 'green' },
  { value: 'Rechazada' as const, label: 'Rechazada', icon: X, color: 'red' },
  { value: 'Requiere Información Adicional' as const, label: 'Requiere Info', icon: AlertCircle, color: 'orange' },
];

const colorClasses = {
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    hover: 'hover:bg-yellow-200',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    hover: 'hover:bg-green-200',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    hover: 'hover:bg-red-200',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    hover: 'hover:bg-orange-200',
  },
};

export default function SelectorEstadoAutorizacion({
  estado,
  onEstadoChange,
  disabled = false,
}: SelectorEstadoAutorizacionProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const estadoActual = ESTADOS.find((e) => e.value === estado);
  const IconoActual = estadoActual?.icon || Clock;
  const colorActual = colorClasses[estadoActual?.color || 'yellow'];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setMostrarMenu(!mostrarMenu)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colorActual.bg} ${colorActual.text} ${colorActual.border} ${colorActual.hover} transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <IconoActual className="w-4 h-4" />
        <span className="font-medium text-sm">{estadoActual?.label || estado}</span>
      </button>

      {mostrarMenu && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMostrarMenu(false)}
          />
          <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 z-20 min-w-[200px]">
            {ESTADOS.map((estadoOption) => {
              const Icono = estadoOption.icon;
              const color = colorClasses[estadoOption.color];
              const isSelected = estadoOption.value === estado;

              return (
                <button
                  key={estadoOption.value}
                  type="button"
                  onClick={() => {
                    onEstadoChange(estadoOption.value);
                    setMostrarMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors ${
                    isSelected
                      ? `${color.bg} ${color.text} font-semibold`
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icono className="w-4 h-4" />
                  <span>{estadoOption.label}</span>
                  {isSelected && <Check className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}


