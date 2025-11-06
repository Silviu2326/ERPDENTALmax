import { useState, useRef, useEffect } from 'react';
import { ResumenDiaCitas } from '../api/citasApi';
import PopoverResumenDia from './PopoverResumenDia';

interface CeldaDiaCalendarioProps {
  dia: number;
  fecha: Date;
  resumen?: ResumenDiaCitas;
  esDiaActual: boolean;
  esDiaOtroMes: boolean;
  onClick?: (fecha: Date) => void;
}

export default function CeldaDiaCalendario({
  dia,
  fecha,
  resumen,
  esDiaActual,
  esDiaOtroMes,
  onClick,
}: CeldaDiaCalendarioProps) {
  const [mostrarPopover, setMostrarPopover] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const celdaRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const total = resumen?.total || 0;

  // Calcular intensidad del color según cantidad de citas
  const getIntensidadColor = (cantidad: number): string => {
    if (cantidad === 0) return 'bg-gray-50';
    if (cantidad <= 3) return 'bg-blue-100';
    if (cantidad <= 6) return 'bg-blue-200';
    if (cantidad <= 10) return 'bg-blue-300';
    return 'bg-blue-400';
  };

  const handleMouseEnter = () => {
    if (resumen && total > 0) {
      const id = setTimeout(() => {
        setMostrarPopover(true);
      }, 300); // Delay de 300ms antes de mostrar
      setTimeoutId(id);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setMostrarPopover(false);
  };

  // Cerrar popover al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        celdaRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !celdaRef.current.contains(event.target as Node)
      ) {
        setMostrarPopover(false);
      }
    };

    if (mostrarPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mostrarPopover]);

  return (
    <div className="relative">
      <div
        ref={celdaRef}
        onClick={() => onClick && onClick(fecha)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          h-24 border border-gray-200 p-2 cursor-pointer transition-all duration-200
          hover:shadow-md hover:border-blue-400 hover:z-10 relative
          ${esDiaOtroMes ? 'bg-gray-50 text-gray-400' : 'bg-white'}
          ${esDiaActual ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
          ${getIntensidadColor(total)}
        `}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-sm font-medium ${
              esDiaActual ? 'text-blue-700 font-bold' : esDiaOtroMes ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            {dia}
          </span>
        </div>
        {total > 0 && (
          <div className="mt-1">
            <div className="flex items-center justify-center">
              <span className="text-xs font-bold text-blue-700 bg-blue-200/50 px-2 py-0.5 rounded-full">
                {total} {total === 1 ? 'cita' : 'citas'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Popover con resumen */}
      {mostrarPopover && resumen && total > 0 && (
        <div
          ref={popoverRef}
          className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2"
          style={{ pointerEvents: 'auto' }}
        >
          <PopoverResumenDia resumen={resumen} fecha={fecha} />
        </div>
      )}
    </div>
  );
}


