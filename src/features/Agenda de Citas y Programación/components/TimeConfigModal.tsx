import { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, Save } from 'lucide-react';

interface TimeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeSlotDuration: 10 | 15 | 30;
  visibleHours: { start: number; end: number };
  onSave: (timeSlotDuration: 10 | 15 | 30, visibleHours: { start: number; end: number }) => void;
  sedeId?: string;
  sedes?: Array<{ _id: string; nombre: string; horario?: string }>;
}

export default function TimeConfigModal({
  isOpen,
  onClose,
  timeSlotDuration: initialTimeSlotDuration,
  visibleHours: initialVisibleHours,
  onSave,
  sedeId,
  sedes = [],
}: TimeConfigModalProps) {
  const [timeSlotDuration, setTimeSlotDuration] = useState<10 | 15 | 30>(initialTimeSlotDuration);
  const [startHour, setStartHour] = useState(initialVisibleHours.start);
  const [endHour, setEndHour] = useState(initialVisibleHours.end);
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setTimeSlotDuration(initialTimeSlotDuration);
      setStartHour(initialVisibleHours.start);
      setEndHour(initialVisibleHours.end);
      setErrors({});
    }
  }, [isOpen, initialTimeSlotDuration, initialVisibleHours]);

  // Obtener horarios de la sede seleccionada
  const getSedeHorario = () => {
    if (!sedeId || !sedes.length) return null;
    const sede = sedes.find(s => s._id === sedeId);
    return sede?.horario || null;
  };

  const validateHours = () => {
    const newErrors: { start?: string; end?: string } = {};

    if (startHour < 0 || startHour > 23) {
      newErrors.start = 'La hora de inicio debe estar entre 0 y 23';
    }

    if (endHour < 0 || endHour > 23) {
      newErrors.end = 'La hora de fin debe estar entre 0 y 23';
    }

    if (startHour >= endHour) {
      newErrors.end = 'La hora de fin debe ser mayor que la hora de inicio';
    }

    if (endHour - startHour < 1) {
      newErrors.end = 'El rango horario debe ser de al menos 1 hora';
    }

    // Validar límites por sede si hay horario definido
    const horarioSede = getSedeHorario();
    if (horarioSede) {
      // Parsear horario de la sede (formato: "Lun-Vie: 9:00-20:00")
      const match = horarioSede.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
      if (match) {
        const sedeStart = parseInt(match[1]);
        const sedeEnd = parseInt(match[3]);
        
        if (startHour < sedeStart) {
          newErrors.start = `La hora de inicio no puede ser antes de las ${sedeStart}:00 (horario de la sede)`;
        }
        
        if (endHour > sedeEnd) {
          newErrors.end = `La hora de fin no puede ser después de las ${sedeEnd}:00 (horario de la sede)`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateHours()) {
      onSave(timeSlotDuration, { start: startHour, end: endHour });
      onClose();
    }
  };

  if (!isOpen) return null;

  const horarioSede = getSedeHorario();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configuración de Tiempo</h2>
              <p className="text-sm text-gray-500">Ajusta la escala temporal y rango horario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Escala temporal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escala Temporal (minutos por slot)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[10, 15, 30].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setTimeSlotDuration(duration as 10 | 15 | 30)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    timeSlotDuration === duration
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {duration} min
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Selecciona la duración de cada intervalo de tiempo en el calendario
            </p>
          </div>

          {/* Rango horario visible */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango Horario Visible
              </label>
              
              {horarioSede && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-900">Horario de la sede</p>
                      <p className="text-xs text-blue-700">{horarioSede}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Hora de Inicio
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={startHour}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        setStartHour(Math.max(0, Math.min(23, value)));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.start
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.start && (
                    <p className="mt-1 text-xs text-red-600">{errors.start}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Hora de Fin
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={endHour}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        setEndHour(Math.max(0, Math.min(23, value)));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.end
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.end && (
                    <p className="mt-1 text-xs text-red-600">{errors.end}</p>
                  )}
                </div>
              </div>

              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Rango configurado:</span> {startHour}:00 - {endHour}:00
                  {' '}({endHour - startHour} {endHour - startHour === 1 ? 'hora' : 'horas'})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

