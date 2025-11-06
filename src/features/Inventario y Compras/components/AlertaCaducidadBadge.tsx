import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { LoteProducto } from '../api/lotesApi';

interface AlertaCaducidadBadgeProps {
  lote: LoteProducto;
  className?: string;
}

export default function AlertaCaducidadBadge({ lote, className = '' }: AlertaCaducidadBadgeProps) {
  const fechaCaducidad = new Date(lote.fechaCaducidad);
  const hoy = new Date();
  const diasRestantes = Math.ceil((fechaCaducidad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

  const getEstadoBadge = () => {
    if (lote.estado === 'Caducado' || diasRestantes < 0) {
      return {
        texto: 'Caducado',
        color: 'bg-red-100 text-red-800 border-red-300',
        icono: <AlertTriangle className="w-4 h-4" />,
      };
    } else if (lote.estado === 'PorCaducar' || diasRestantes <= 30) {
      return {
        texto: `Caduca en ${diasRestantes} días`,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icono: <Clock className="w-4 h-4" />,
      };
    } else {
      return {
        texto: 'Activo',
        color: 'bg-green-100 text-green-800 border-green-300',
        icono: <CheckCircle className="w-4 h-4" />,
      };
    }
  };

  const estado = getEstadoBadge();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${estado.color} ${className}`}
      title={`Fecha de caducidad: ${fechaCaducidad.toLocaleDateString('es-ES')}`}
    >
      {estado.icono}
      {estado.texto}
    </span>
  );
}


