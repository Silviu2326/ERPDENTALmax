import { CheckCircle2, XCircle, Clock, FileText, AlertCircle } from 'lucide-react';

interface EstadoPresupuestoBadgeProps {
  estado: 'Borrador' | 'Presentado' | 'Aceptado' | 'Rechazado' | 'Expirado';
  size?: 'sm' | 'md' | 'lg';
}

export default function EstadoPresupuestoBadge({ estado, size = 'md' }: EstadoPresupuestoBadgeProps) {
  const estadosConfig = {
    Borrador: {
      icon: FileText,
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      label: 'Borrador',
    },
    Presentado: {
      icon: Clock,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      label: 'Presentado',
    },
    Aceptado: {
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-800 border-green-300',
      label: 'Aceptado',
    },
    Rechazado: {
      icon: XCircle,
      color: 'bg-red-100 text-red-800 border-red-300',
      label: 'Rechazado',
    },
    Expirado: {
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      label: 'Expirado',
    },
  };

  const config = estadosConfig[estado];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border font-medium ${config.color} ${sizeClasses[size]}`}
    >
      <Icon className={iconSizeClasses[size]} />
      <span>{config.label}</span>
    </span>
  );
}



