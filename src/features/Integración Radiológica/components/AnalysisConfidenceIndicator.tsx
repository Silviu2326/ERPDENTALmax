import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface AnalysisConfidenceIndicatorProps {
  confianza: number; // Valor entre 0 y 1
  mostrarPorcentaje?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnalysisConfidenceIndicator({
  confianza,
  mostrarPorcentaje = true,
  size = 'md',
}: AnalysisConfidenceIndicatorProps) {
  const porcentaje = Math.round(confianza * 100);
  const esAlta = confianza >= 0.8;
  const esMedia = confianza >= 0.5 && confianza < 0.8;
  const esBaja = confianza < 0.5;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getColorClasses = () => {
    if (esAlta) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (esMedia) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getIcon = () => {
    if (esAlta) {
      return <CheckCircle className={iconSizes[size]} />;
    }
    if (esMedia) {
      return <AlertCircle className={iconSizes[size]} />;
    }
    return <XCircle className={iconSizes[size]} />;
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${getColorClasses()} ${sizeClasses[size]}`}
    >
      {getIcon()}
      {mostrarPorcentaje && (
        <span className="font-semibold">{porcentaje}%</span>
      )}
    </div>
  );
}


