import { useState } from 'react';
import { UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';
import FormularioCreacionPaciente from '../components/FormularioCreacionPaciente';
import { crearPaciente, NuevoPaciente, Paciente } from '../api/pacientesApi';

interface NuevaFichaPacientePageProps {
  onPacienteCreado?: (paciente: Paciente) => void;
  onVolver?: () => void;
}

export default function NuevaFichaPacientePage({
  onPacienteCreado,
  onVolver,
}: NuevaFichaPacientePageProps) {
  const [pacienteCreado, setPacienteCreado] = useState<Paciente | null>(null);

  const handleSubmit = async (paciente: NuevoPaciente) => {
    const pacienteCreadoResponse = await crearPaciente(paciente);
    setPacienteCreado(pacienteCreadoResponse);
    
    if (onPacienteCreado) {
      onPacienteCreado(pacienteCreadoResponse);
    }
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    }
  };

  const handleVerPaciente = () => {
    if (pacienteCreado?._id && onPacienteCreado) {
      onPacienteCreado(pacienteCreado);
    }
  };

  // Mostrar mensaje de éxito después de crear el paciente
  if (pacienteCreado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Paciente creado exitosamente
            </h3>
            <p className="text-gray-600 mb-4">
              El paciente{' '}
              <span className="font-semibold">
                {pacienteCreado.nombre} {pacienteCreado.apellidos}
              </span>{' '}
              ha sido registrado correctamente en el sistema.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleVolver}
                className="inline-flex items-center gap-2 px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                <ArrowLeft size={20} />
                <span>Volver al listado</span>
              </button>
              <button
                onClick={handleVerPaciente}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                <UserPlus size={20} />
                <span>Ver ficha del paciente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {onVolver && (
                <button
                  onClick={handleVolver}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all mr-4"
                  aria-label="Volver"
                >
                  <ArrowLeft size={24} className="text-gray-600" />
                </button>
              )}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <UserPlus size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Nueva Ficha de Paciente
                </h1>
                <p className="text-gray-600">
                  Complete la información del paciente para crear su registro en el sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <FormularioCreacionPaciente
          onSubmit={handleSubmit}
          onCancel={handleVolver}
        />
      </div>
    </div>
  );
}

