import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';
import { EventoIntraoperatorio } from '../../api/cirugiaApi';

interface SurgicalPhaseTimerProps {
  horaInicio?: Date;
  eventos: EventoIntraoperatorio[];
  onAgregarEvento: (descripcion: string) => void;
}

export default function SurgicalPhaseTimer({ horaInicio, eventos, onAgregarEvento }: SurgicalPhaseTimerProps) {
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [descripcionEvento, setDescripcionEvento] = useState('');

  useEffect(() => {
    if (!horaInicio || isPaused) return;

    const interval = setInterval(() => {
      const inicio = new Date(horaInicio).getTime();
      const ahora = new Date().getTime();
      setTiempoTranscurrido(Math.floor((ahora - inicio) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [horaInicio, isPaused]);

  const formatearTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  const handleAgregarEvento = () => {
    if (!descripcionEvento.trim()) {
      alert('Por favor ingrese una descripción del evento');
      return;
    }
    onAgregarEvento(descripcionEvento);
    setDescripcionEvento('');
  };

  const eventosPredefinidos = [
    'Inicio de anestesia',
    'Inicio de incisión',
    'Extracción completada',
    'Colocación de implante',
    'Sutura iniciada',
    'Sutura finalizada',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Cronómetro de Cirugía</h3>
      </div>

      {/* Timer principal */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-800 mb-2 font-mono">
          {formatearTiempo(tiempoTranscurrido)}
        </div>
        <div className="flex gap-2 justify-center">
          {horaInicio && (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Reanudar' : 'Pausar'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Eventos predefinidos */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Eventos Rápidos</h4>
        <div className="grid grid-cols-2 gap-2">
          {eventosPredefinidos.map((evento) => (
            <button
              key={evento}
              onClick={() => onAgregarEvento(evento)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm text-left"
            >
              {evento}
            </button>
          ))}
        </div>
      </div>

      {/* Agregar evento personalizado */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Agregar Evento Personalizado</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={descripcionEvento}
            onChange={(e) => setDescripcionEvento(e.target.value)}
            placeholder="Ej: Inicio de incisión"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAgregarEvento();
              }
            }}
          />
          <button
            onClick={handleAgregarEvento}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Timeline de eventos */}
      {eventos.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Timeline de Eventos</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {eventos.map((evento, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-800">{evento.descripcion}</p>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(evento.hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


