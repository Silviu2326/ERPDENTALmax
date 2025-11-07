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
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <Clock size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Cronómetro de Cirugía</h3>
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                {isPaused ? 'Reanudar' : 'Pausar'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Eventos predefinidos */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Eventos Rápidos</h4>
        <div className="grid grid-cols-2 gap-2">
          {eventosPredefinidos.map((evento) => (
            <button
              key={evento}
              onClick={() => onAgregarEvento(evento)}
              className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all text-sm text-left font-medium"
            >
              {evento}
            </button>
          ))}
        </div>
      </div>

      {/* Agregar evento personalizado */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Agregar Evento Personalizado</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={descripcionEvento}
            onChange={(e) => setDescripcionEvento(e.target.value)}
            placeholder="Ej: Inicio de incisión"
            className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAgregarEvento();
              }
            }}
          />
          <button
            onClick={handleAgregarEvento}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Timeline de eventos */}
      {eventos.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Timeline de Eventos</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {eventos.map((evento, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-900">{evento.descripcion}</p>
                    <span className="text-xs text-gray-600 ml-2">
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



