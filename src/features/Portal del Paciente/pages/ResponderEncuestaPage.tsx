import { useState, useEffect } from 'react';
import {
  obtenerPlantillaEncuesta,
  enviarRespuestasEncuesta,
  obtenerEncuestasPendientes,
  EncuestaPlantilla,
  RespuestaPregunta,
  EncuestaRespuesta,
} from '../api/encuestasApi';
import EncuestaForm from '../components/EncuestaForm';
import { CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';

interface ResponderEncuestaPageProps {
  respuestaId?: string;
  onVolver?: () => void;
  onEnviar?: () => void;
}

export default function ResponderEncuestaPage({
  respuestaId: propRespuestaId,
  onVolver,
  onEnviar,
}: ResponderEncuestaPageProps) {
  const respuestaId = propRespuestaId || '';

  const [plantilla, setPlantilla] = useState<EncuestaPlantilla | null>(null);
  const [encuestaRespuesta, setEncuestaRespuesta] = useState<EncuestaRespuesta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviada, setEnviada] = useState(false);

  useEffect(() => {
    cargarEncuesta();
  }, [respuestaId]);

  const cargarEncuesta = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Primero obtener la encuesta pendiente para obtener el ID de la plantilla
      const encuestasPendientes = await obtenerEncuestasPendientes();
      const encuesta = encuestasPendientes.find((e) => e._id === respuestaId);

      if (!encuesta) {
        throw new Error('Encuesta no encontrada');
      }

      setEncuestaRespuesta(encuesta);

      // Obtener la plantilla
      const plantillaId =
        typeof encuesta.plantilla === 'string'
          ? encuesta.plantilla
          : encuesta.plantilla._id;
      if (!plantillaId) {
        throw new Error('ID de plantilla no válido');
      }

      const plantillaData = await obtenerPlantillaEncuesta(plantillaId);
      setPlantilla(plantillaData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la encuesta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (respuestas: RespuestaPregunta[]) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await enviarRespuestasEncuesta(respuestaId, respuestas);
      setEnviada(true);

      if (onEnviar) {
        onEnviar();
      }

      // Esperar un momento antes de redirigir
      setTimeout(() => {
        if (onVolver) {
          onVolver();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar la encuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (enviada) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Gracias!</h2>
          <p className="text-gray-600 mb-6">
            Tu encuesta ha sido enviada exitosamente. Tu opinión es muy valiosa para nosotros.
          </p>
          <button
            onClick={handleVolver}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Portal
          </button>
        </div>
      </div>
    );
  }

  if (error && !plantilla) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleVolver}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!plantilla) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleVolver}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <EncuestaForm
          plantilla={plantilla}
          onSubmit={handleSubmit}
          onCancel={handleVolver}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}

