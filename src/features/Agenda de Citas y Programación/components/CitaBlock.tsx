import { useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Cita } from '../api/citasApi';
import { Clock, User, Stethoscope, MapPin, AlertCircle, Phone, Mail } from 'lucide-react';

interface CitaBlockProps {
  cita: Cita;
  onClick: () => void;
  disabled?: boolean;
  onResizeStart?: (cita: Cita) => void;
  onResizeEnd?: (cita: Cita, nuevaDuracionMinutos: number) => void;
  duracionMinimaMinutos?: number;
  timeSlotDuration?: number;
  citasEnSlot?: Cita[];
  destacada?: boolean;
}

const estadoColors: Record<string, string> = {
  programada: 'bg-blue-100 text-blue-800 border-blue-300',
  confirmada: 'bg-green-100 text-green-800 border-green-300',
  cancelada: 'bg-red-100 text-red-800 border-red-300',
  realizada: 'bg-gray-100 text-gray-800 border-gray-300',
  'no-asistio': 'bg-orange-100 text-orange-800 border-orange-300',
};

const estadoLabels: Record<string, string> = {
  programada: 'Programada',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  realizada: 'Realizada',
  'no-asistio': 'No Asistió',
};

const estadoIcons: Record<string, string> = {
  programada: '📅',
  confirmada: '✅',
  cancelada: '❌',
  realizada: '✓',
  'no-asistio': '⚠️',
};

const SLOT_HEIGHT_PX = 60;

export default function CitaBlock({
  cita,
  onClick,
  disabled = false,
  onResizeStart,
  onResizeEnd,
  duracionMinimaMinutos = 15,
  timeSlotDuration = 30,
  citasEnSlot = [],
  destacada = false,
}: CitaBlockProps) {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartYRef = useRef(0);
  const resizeStartDuracionRef = useRef(0);
  const blockRef = useRef<HTMLDivElement | null>(null);
  const isResizingRef = useRef(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `cita-${cita._id}`,
    disabled: disabled || cita.estado === 'realizada' || cita.estado === 'cancelada' || isResizing,
    data: {
      cita,
    },
  });

  const citaHeightPx = Math.max(
    SLOT_HEIGHT_PX,
    Math.round((cita.duracion_minutos / timeSlotDuration) * SLOT_HEIGHT_PX)
  );

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    height: citaHeightPx,
  };

  const fechaInicio = new Date(cita.fecha_hora_inicio);
  const fechaFin = new Date(cita.fecha_hora_fin);
  const horaInicio = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const horaFin = fechaFin.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const estadoColor = estadoColors[cita.estado] || estadoColors.programada;
  const duracionHoras = Math.floor(cita.duracion_minutos / 60);
  const duracionMinutos = cita.duracion_minutos % 60;
  const duracionStr =
    duracionHoras > 0
      ? `${duracionHoras}h ${duracionMinutos > 0 ? `${duracionMinutos}m` : ''}`
      : `${duracionMinutos}m`;

  const esUrgente = cita.notas?.toLowerCase().includes('urgente') || false;
  const puedeArrastrar = !disabled && cita.estado !== 'realizada' && cita.estado !== 'cancelada' && !isResizing;
  const puedeRedimensionar = puedeArrastrar && onResizeStart && onResizeEnd;

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!puedeRedimensionar) return;

    setIsResizing(true);
    isResizingRef.current = true;
    resizeStartYRef.current = e.clientY;
    resizeStartDuracionRef.current = cita.duracion_minutos;

    onResizeStart?.(cita);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const deltaY = moveEvent.clientY - resizeStartYRef.current;
      const pixelsPorMinuto = SLOT_HEIGHT_PX / timeSlotDuration;
      const deltaMinutos = Math.round(deltaY / pixelsPorMinuto);
      const nuevaDuracion = Math.max(duracionMinimaMinutos, resizeStartDuracionRef.current + deltaMinutos);

      const fechaInicio = new Date(cita.fecha_hora_inicio);
      const nuevaFechaFin = new Date(fechaInicio);
      nuevaFechaFin.setMinutes(nuevaFechaFin.getMinutes() + nuevaDuracion);

      if (nuevaDuracion < resizeStartDuracionRef.current) {
        const haySolapamiento = citasEnSlot.some((otraCita) => {
          if (otraCita._id === cita._id) return false;
          const otraFechaInicio = new Date(otraCita.fecha_hora_inicio);
          const otraFechaFin = new Date(otraCita.fecha_hora_fin);
          return nuevaFechaFin > otraFechaInicio && nuevaFechaFin < otraFechaFin;
        });

        if (haySolapamiento) return;
      }

      if (blockRef.current) {
        const alturaPreview = Math.max(
          SLOT_HEIGHT_PX,
          Math.round((nuevaDuracion / timeSlotDuration) * SLOT_HEIGHT_PX)
        );
        blockRef.current.style.height = `${alturaPreview}px`;
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (!isResizingRef.current) return;

      const deltaY = upEvent.clientY - resizeStartYRef.current;
      const pixelsPorMinuto = SLOT_HEIGHT_PX / timeSlotDuration;
      const deltaMinutos = Math.round(deltaY / pixelsPorMinuto);
      const nuevaDuracion = Math.max(duracionMinimaMinutos, resizeStartDuracionRef.current + deltaMinutos);

      const fechaInicio = new Date(cita.fecha_hora_inicio);
      const nuevaFechaFin = new Date(fechaInicio);
      nuevaFechaFin.setMinutes(nuevaFechaFin.getMinutes() + nuevaDuracion);

      if (nuevaDuracion < resizeStartDuracionRef.current) {
        const haySolapamiento = citasEnSlot.some((otraCita) => {
          if (otraCita._id === cita._id) return false;
          const otraFechaInicio = new Date(otraCita.fecha_hora_inicio);
          const otraFechaFin = new Date(otraCita.fecha_hora_fin);
          return nuevaFechaFin > otraFechaInicio && nuevaFechaFin < otraFechaFin;
        });

        if (haySolapamiento) {
          if (blockRef.current) {
            blockRef.current.style.height = `${citaHeightPx}px`;
          }
          setIsResizing(false);
          isResizingRef.current = false;
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          return;
        }
      }

      if (blockRef.current) {
        const alturaFinal = Math.max(
          SLOT_HEIGHT_PX,
          Math.round((nuevaDuracion / timeSlotDuration) * SLOT_HEIGHT_PX)
        );
        blockRef.current.style.height = `${alturaFinal}px`;
      }

      if (onResizeEnd && nuevaDuracion !== cita.duracion_minutos) {
        onResizeEnd(cita, nuevaDuracion);
      }

      setIsResizing(false);
      isResizingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    blockRef.current = node;
  };

  return (
    <div
      ref={combinedRef}
      style={style}
      {...(puedeArrastrar ? { ...attributes, ...listeners } : {})}
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all duration-200 ${estadoColor} ${
        esUrgente ? 'ring-2 ring-red-400 ring-opacity-50' : ''
      } ${isDragging ? 'cursor-grabbing opacity-50 shadow-2xl' : 'cursor-pointer hover:shadow-xl hover:scale-[1.02]'} ${
        destacada ? 'ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl animate-pulse' : ''
      } ${isResizing ? 'ring-2 ring-blue-400' : ''}`}
      title={`${cita.paciente.nombre} ${cita.paciente.apellidos} - ${cita.tratamiento?.nombre || 'Sin tratamiento'} - ${estadoLabels[cita.estado] || cita.estado}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-3.5 h-3.5 opacity-75 flex-shrink-0" />
            <p className="font-semibold text-sm truncate">
              {cita.paciente.nombre} {cita.paciente.apellidos}
            </p>
            {esUrgente && <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0" title="Urgente" />}
          </div>
          {cita.tratamiento && (
            <div className="flex items-center space-x-2 mt-1">
              <Stethoscope className="w-3 h-3 opacity-75 flex-shrink-0" />
              <p className="text-xs opacity-90 truncate">{cita.tratamiento.nombre}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end space-y-1 ml-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium bg-white/80 backdrop-blur-sm ${
              cita.estado === 'confirmada'
                ? 'text-green-700 border border-green-300'
                : cita.estado === 'programada'
                ? 'text-blue-700 border border-blue-300'
                : cita.estado === 'cancelada'
                ? 'text-red-700 border border-red-300'
                : cita.estado === 'realizada'
                ? 'text-gray-700 border border-gray-300'
                : 'text-orange-700 border border-orange-300'
            }`}
          >
            <span className="mr-1">{estadoIcons[cita.estado] || '📋'}</span>
            {estadoLabels[cita.estado] || cita.estado}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 mt-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 opacity-75 flex-shrink-0" />
            <span className="font-semibold">
              {horaInicio} - {horaFin}
            </span>
          </div>
          <span className="text-xs opacity-75 font-medium bg-white/60 px-1.5 py-0.5 rounded">{duracionStr}</span>
        </div>

        <div className="flex items-center justify-between text-xs gap-2">
          {cita.profesional && (
            <div className="flex items-center space-x-1 opacity-75 truncate flex-1 min-w-0">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="truncate text-xs">
                Dr. {cita.profesional.nombre} {cita.profesional.apellidos}
              </span>
            </div>
          )}
          {cita.box_asignado && (
            <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 border border-white/50">
              Box {cita.box_asignado}
            </span>
          )}
        </div>

        {cita.sede && (
          <div className="flex items-center space-x-1 text-xs opacity-75">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{cita.sede.nombre}</span>
          </div>
        )}

        {(cita.paciente.telefono || cita.paciente.email) && (
          <div className="flex items-center space-x-2 text-xs opacity-60 pt-1 border-t border-white/20">
            {cita.paciente.telefono && (
              <div className="flex items-center space-x-1">
                <Phone className="w-2.5 h-2.5" />
                <span className="truncate">{cita.paciente.telefono}</span>
              </div>
            )}
            {cita.paciente.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-2.5 h-2.5" />
                <span className="truncate max-w-[100px]">{cita.paciente.email.split('@')[0]}</span>
              </div>
            )}
          </div>
        )}

        {cita.notas && (
          <div className="mt-1.5 pt-1.5 border-t border-white/30">
            <p className="text-xs opacity-80 line-clamp-2 italic leading-relaxed">💬 {cita.notas}</p>
          </div>
        )}
      </div>

      {puedeRedimensionar && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-400/30 rounded-b-lg transition-colors flex items-center justify-center group"
          title="Arrastra para redimensionar la duración"
        >
          <div className="w-8 h-0.5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}
    </div>
  );
}

