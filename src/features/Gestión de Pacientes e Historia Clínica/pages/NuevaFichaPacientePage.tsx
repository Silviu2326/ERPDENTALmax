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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Paciente creado exitosamente
              </h2>
              <p className="text-gray-600 mb-6">
                El paciente{' '}
                <span className="font-semibold">
                  {pacienteCreado.nombre} {pacienteCreado.apellidos}
                </span>{' '}
                ha sido registrado correctamente en el sistema.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleVolver}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al listado</span>
                </button>
                <button
                  onClick={handleVerPaciente}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Ver ficha del paciente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVolver}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nueva Ficha de Paciente
              </h1>
              <p className="text-gray-600 mt-1">
                Complete la información del paciente para crear su registro en el sistema
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <FormularioCreacionPaciente
            onSubmit={handleSubmit}
            onCancel={handleVolver}
          />
        </div>
      </div>
    </div>
  );
}

