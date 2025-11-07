import { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Paciente, Profesional, Tratamiento, SlotDisponibilidad, crearCita } from '../api/citasApi';
import FormularioNuevaCita from '../components/FormularioNuevaCita';

interface NuevaCitaPageProps {
  onVolver?: () => void;
}

export default function NuevaCitaPage({ onVolver }: NuevaCitaPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirmarCita = async (datos: {
    paciente: Paciente;
    profesional: Profesional;
    tratamiento: Tratamiento | null;
    slot: SlotDisponibilidad;
    notas?: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simular delay de creación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Preparar datos para la API (simulado)
      const nuevaCita = {
        paciente: datos.paciente._id,
        profesional: datos.profesional._id,
        fecha_hora_inicio: datos.slot.start,
        fecha_hora_fin: datos.slot.end,
        tratamiento: datos.tratamiento?._id || undefined,
        notas: datos.notas || undefined,
        estado: 'programada' as const,
      };

      // Simular creación exitosa
      console.log('Creando nueva cita:', nuevaCita);
      
      setSuccess(true);
      
      // Volver después de 2 segundos
      if (onVolver) {
        setTimeout(() => {
          onVolver();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            {onVolver && (
              <button
                onClick={onVolver}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4 transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Volver a Agenda</span>
              </button>
            )}
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Calendar size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Nueva Cita
                </h1>
                <p className="text-gray-600">
                  Crea una nueva cita para un paciente de manera rápida y sencilla
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Mensaje de éxito */}
        {success && (
          <div className="mb-6 bg-white shadow-sm rounded-xl p-4 ring-1 ring-green-200/70">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">¡Cita creada exitosamente!</p>
                <p className="text-xs text-green-700">Redirigiendo...</p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-white shadow-sm rounded-xl p-4 ring-1 ring-red-200/70">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Error al crear la cita</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        {!success && (
          <FormularioNuevaCita onConfirmar={handleConfirmarCita} />
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center max-w-sm mx-4">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Creando cita...</p>
          </div>
        </div>
      )}
    </div>
  );
}

