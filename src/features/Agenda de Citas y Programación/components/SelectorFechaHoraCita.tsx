import { Calendar, Clock } from 'lucide-react';

interface SelectorFechaHoraCitaProps {
  fechaInicio: string; // ISO string
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  onFechaChange: (fecha: string) => void;
  onHoraInicioChange: (hora: string) => void;
  onHoraFinChange: (hora: string) => void;
  disabled?: boolean;
}

export default function SelectorFechaHoraCita({
  fechaInicio,
  horaInicio,
  horaFin,
  onFechaChange,
  onHoraInicioChange,
  onHoraFinChange,
  disabled = false,
}: SelectorFechaHoraCitaProps) {
  const fechaStr = fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4" />
          <span>Fecha *</span>
        </label>
        <input
          type="date"
          required
          value={fechaStr}
          onChange={(e) => {
            const fecha = e.target.value;
            if (fecha) {
              const fechaCompleta = new Date(fecha);
              const hora = horaInicio ? horaInicio.split(':') : ['09', '00'];
              fechaCompleta.setHours(parseInt(hora[0]), parseInt(hora[1]), 0, 0);
              onFechaChange(fechaCompleta.toISOString());
            }
          }}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4" />
          <span>Hora Inicio *</span>
        </label>
        <input
          type="time"
          required
          value={horaInicio}
          onChange={(e) => {
            const hora = e.target.value;
            onHoraInicioChange(hora);
            // Actualizar fecha completa
            if (fechaInicio) {
              const fecha = new Date(fechaInicio);
              const [h, m] = hora.split(':');
              fecha.setHours(parseInt(h), parseInt(m), 0, 0);
              onFechaChange(fecha.toISOString());
            }
          }}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4" />
          <span>Hora Fin *</span>
        </label>
        <input
          type="time"
          required
          value={horaFin}
          onChange={(e) => onHoraFinChange(e.target.value)}
          disabled={disabled}
          min={horaInicio}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}


