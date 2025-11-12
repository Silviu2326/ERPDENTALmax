import { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle, Volume2, VolumeX, Settings, Clock, User, MapPin, Stethoscope } from 'lucide-react';
import { Cita, actualizarCita } from '../api/citasApi';

interface UrgentAppointmentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  citas: Cita[];
  onCitaActualizada?: () => void;
}

interface UrgentConfig {
  soundEnabled: boolean;
  animationEnabled: boolean;
  soundVolume: number;
}

// Función para detectar si una cita es urgente
export function esCitaUrgente(cita: Cita): boolean {
  // Verificar flag esUrgente si existe en el futuro
  // Por ahora, verificamos las notas
  if (cita.notas) {
    const notasLower = cita.notas.toLowerCase();
    return notasLower.includes('urgente') || 
           notasLower.includes('urgencia') ||
           notasLower.includes('emergencia') ||
           notasLower.includes('dolor agudo') ||
           notasLower.includes('infección');
  }
  return false;
}

function CitaUrgenteItem({ 
  cita, 
  onMarcarAtendida,
  config
}: { 
  cita: Cita; 
  onMarcarAtendida: (citaId: string) => void;
  config: UrgentConfig;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (config.soundEnabled && config.soundVolume > 0) {
      // Crear un sonido de alerta simple usando Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(config.soundVolume / 100, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (err) {
        console.warn('No se pudo reproducir el sonido:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (config.animationEnabled) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [config.animationEnabled]);

  const fechaInicio = new Date(cita.fecha_hora_inicio);
  const horaInicio = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div
      className={`bg-white rounded-lg border-2 border-red-400 p-4 mb-3 shadow-lg ${
        isAnimating ? 'animate-pulse ring-2 ring-red-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-900">
                {cita.paciente.nombre} {cita.paciente.apellidos}
              </p>
              <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{fechaFormateada} {horaInicio}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{cita.sede.nombre}</span>
                </div>
              </div>
            </div>
          </div>
          
          {cita.tratamiento && (
            <div className="flex items-center space-x-2 mt-2 mb-2">
              <Stethoscope className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {cita.tratamiento.nombre}
              </p>
            </div>
          )}

          {cita.profesional && (
            <div className="flex items-center space-x-2 mt-1 mb-2">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Dr/a. {cita.profesional.nombre} {cita.profesional.apellidos}
              </p>
            </div>
          )}

          {cita.notas && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ {cita.notas}
              </p>
            </div>
          )}

          {cita.paciente.telefono && (
            <div className="mt-2 text-sm text-gray-600">
              📞 {cita.paciente.telefono}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-red-200">
        <button
          onClick={() => onMarcarAtendida(cita._id!)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Marcar como Atendida</span>
        </button>
      </div>
    </div>
  );
}

export default function UrgentAppointmentsPanel({
  isOpen,
  onClose,
  citas,
  onCitaActualizada,
}: UrgentAppointmentsPanelProps) {
  const [config, setConfig] = useState<UrgentConfig>(() => {
    const saved = localStorage.getItem('urgentAppointmentsConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Si hay error, usar valores por defecto
      }
    }
    return {
      soundEnabled: true,
      animationEnabled: true,
      soundVolume: 50,
    };
  });
  const [mostrarConfig, setMostrarConfig] = useState(false);

  // Filtrar citas urgentes
  const citasUrgentes = citas.filter(cita => 
    esCitaUrgente(cita) && 
    cita.estado !== 'realizada' && 
    cita.estado !== 'cancelada'
  );

  // Guardar configuración cuando cambie
  useEffect(() => {
    localStorage.setItem('urgentAppointmentsConfig', JSON.stringify(config));
  }, [config]);

  const handleMarcarAtendida = async (citaId: string) => {
    try {
      await actualizarCita(citaId, {
        estado: 'realizada',
      });
      if (onCitaActualizada) {
        onCitaActualizada();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al marcar la cita como atendida');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-r border-red-200">
      {/* Header con estilo de alerta */}
      <div className="flex items-center justify-between p-4 border-b-2 border-red-400 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold text-red-900">Bandeja de Urgencias</h2>
            <p className="text-xs text-red-700">
              {citasUrgentes.length} {citasUrgentes.length === 1 ? 'cita urgente' : 'citas urgentes'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMostrarConfig(!mostrarConfig)}
            className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Panel de configuración */}
      {mostrarConfig && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Configuración de Alertas</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.soundEnabled}
                onChange={(e) => setConfig({ ...config, soundEnabled: e.target.checked })}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 flex items-center space-x-1">
                {config.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>Activar sonido</span>
              </span>
            </label>

            {config.soundEnabled && (
              <div className="ml-6">
                <label className="block text-xs text-gray-600 mb-1">
                  Volumen: {config.soundVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.soundVolume}
                  onChange={(e) => setConfig({ ...config, soundVolume: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.animationEnabled}
                onChange={(e) => setConfig({ ...config, animationEnabled: e.target.checked })}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Activar animación</span>
            </label>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-red-50/30 to-white">
        {citasUrgentes.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay citas urgentes</h3>
            <p className="text-gray-600 text-sm">
              Todas las citas están bajo control
            </p>
          </div>
        ) : (
          <div>
            {citasUrgentes.map((cita) => (
              <CitaUrgenteItem
                key={cita._id}
                cita={cita}
                onMarcarAtendida={handleMarcarAtendida}
                config={config}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-red-200 bg-red-50">
        <p className="text-xs text-red-800 text-center">
          ⚠️ Las citas urgentes requieren atención inmediata
        </p>
      </div>
    </div>
  );
}

