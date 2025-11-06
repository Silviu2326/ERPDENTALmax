import { useState, useEffect } from 'react';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import {
  obtenerHistoriaMedica,
  actualizarHistoriaMedica,
  HistoriaMedica,
} from '../api/historiaClinicaApi';
import FormularioAntecedentesMedicos from '../components/FormularioAntecedentesMedicos';

interface AntecedentesMedicosPacientePageProps {
  pacienteId: string;
  onVolver?: () => void;
}

export default function AntecedentesMedicosPacientePage({
  pacienteId,
  onVolver,
}: AntecedentesMedicosPacientePageProps) {
  const [historiaMedica, setHistoriaMedica] = useState<HistoriaMedica | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarHistoriaMedica = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerHistoriaMedica(pacienteId);
        setHistoriaMedica(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la historia médica');
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId) {
      cargarHistoriaMedica();
    }
  }, [pacienteId]);

  const handleUpdate = async (historiaMedicaActualizada: HistoriaMedica) => {
    try {
      const dataActualizada = await actualizarHistoriaMedica(pacienteId, historiaMedicaActualizada);
      setHistoriaMedica(dataActualizada);
    } catch (err) {
      throw err; // El error será manejado por el componente FormularioAntecedentesMedicos
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error al cargar la historia médica</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!historiaMedica) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No se pudo cargar la historia médica</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Alergias y Antecedentes Médicos
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión de información médica relevante del paciente
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <FormularioAntecedentesMedicos
          pacienteId={pacienteId}
          historiaMedica={historiaMedica}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}


