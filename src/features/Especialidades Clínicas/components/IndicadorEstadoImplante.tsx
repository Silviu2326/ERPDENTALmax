import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

interface IndicadorEstadoImplanteProps {
  estado: 'En Espera' | 'En Progreso' | 'Osteointegrado' | 'Fallido';
  size?: 'sm' | 'md' | 'lg';
}

export default function IndicadorEstadoImplante({ estado, size = 'md' }: IndicadorEstadoImplanteProps) {
  const configuracion = {
    'En Espera': {
      icono: Clock,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      texto: 'En Espera',
    },
    'En Progreso': {
      icono: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      texto: 'En Progreso',
    },
    'Osteointegrado': {
      icono: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      texto: 'Osteointegrado',
    },
    'Fallido': {
      icono: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      texto: 'Fallido',
    },
  };

  const config = configuracion[estado];
  const Icono = config.icono;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses[size]}`}
    >
      <Icono className={iconSizes[size]} />
      {config.texto}
    </span>
  );
}



