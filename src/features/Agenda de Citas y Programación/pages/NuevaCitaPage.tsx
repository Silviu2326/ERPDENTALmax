import { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Agenda</span>
            </button>
          )}
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nueva Cita</h1>
              <p className="text-gray-600 mt-1">
                Crea una nueva cita para un paciente de manera rápida y sencilla
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">¡Cita creada exitosamente! Redirigiendo...</span>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        {!success && (
          <FormularioNuevaCita onConfirmar={handleConfirmarCita} />
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 font-medium">Creando cita...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

