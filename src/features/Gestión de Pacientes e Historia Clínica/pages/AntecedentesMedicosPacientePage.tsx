import { useState, useEffect } from 'react';
import { ArrowLeft, Stethoscope, Loader2, AlertCircle, Package } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!historiaMedica) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se pudo cargar la historia médica</h3>
            <p className="text-gray-600">No se encontró información médica para este paciente</p>
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
            {onVolver && (
              <button
                onClick={onVolver}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Volver
              </button>
            )}
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Stethoscope size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Alergias y Antecedentes Médicos
                </h1>
                <p className="text-gray-600">
                  Gestión de información médica relevante del paciente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <FormularioAntecedentesMedicos
          pacienteId={pacienteId}
          historiaMedica={historiaMedica}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}



