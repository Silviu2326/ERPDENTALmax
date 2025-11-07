import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { obtenerEstadoStock, Material } from '../api/materialesApi';

interface IndicadorEstadoStockProps {
  material: Material;
  showIcon?: boolean;
  showText?: boolean;
}

export default function IndicadorEstadoStock({
  material,
  showIcon = true,
  showText = true,
}: IndicadorEstadoStockProps) {
  const estado = obtenerEstadoStock(material);

  const configuracion = {
    en_stock: {
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle,
      texto: 'En stock',
    },
    bajo_stock: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: AlertCircle,
      texto: 'Bajo stock',
    },
    agotado: {
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle,
      texto: 'Agotado',
    },
  };

  const config = configuracion[estado];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {showText && <span>{config.texto}</span>}
    </span>
  );
}



