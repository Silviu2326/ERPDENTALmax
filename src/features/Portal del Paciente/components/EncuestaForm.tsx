import { useState } from 'react';
import { EncuestaPlantilla, RespuestaPregunta, Pregunta } from '../api/encuestasApi';
import PreguntaTipoEstrellas from './PreguntaTipoEstrellas';
import PreguntaTipoAbierta from './PreguntaTipoAbierta';
import PreguntaTipoMultipleChoice from './PreguntaTipoMultipleChoice';
import { CheckCircle } from 'lucide-react';

interface EncuestaFormProps {
  plantilla: EncuestaPlantilla;
  respuestasIniciales?: RespuestaPregunta[];
  onSubmit: (respuestas: RespuestaPregunta[]) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function EncuestaForm({
  plantilla,
  respuestasIniciales = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: EncuestaFormProps) {
  const [respuestas, setRespuestas] = useState<{ [key: string]: any }>(() => {
    const initial: { [key: string]: any } = {};
    respuestasIniciales.forEach((resp) => {
      initial[resp.preguntaId] = resp.respuestaValor;
    });
    return initial;
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleRespuestaChange = (preguntaId: string, valor: any) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: valor,
    }));
    // Limpiar error si existe
    if (errors[preguntaId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[preguntaId];
        return newErrors;
      });
    }
  };

  const validarRespuestas = (): boolean => {
    const nuevosErrores: { [key: string]: string } = {};
    let esValido = true;

    plantilla.preguntas.forEach((pregunta) => {
      const preguntaId = pregunta._id || '';
      const respuesta = respuestas[preguntaId];

      if (!respuesta || (typeof respuesta === 'string' && respuesta.trim() === '')) {
        nuevosErrores[preguntaId] = 'Esta pregunta es obligatoria';
        esValido = false;
      }
    });

    setErrors(nuevosErrores);
    return esValido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarRespuestas()) {
      return;
    }

    const respuestasFormateadas: RespuestaPregunta[] = plantilla.preguntas.map((pregunta) => {
      const preguntaId = pregunta._id || '';
      return {
        preguntaId,
        preguntaTexto: pregunta.texto,
        respuestaValor: respuestas[preguntaId],
      };
    });

    await onSubmit(respuestasFormateadas);
  };

  const renderPregunta = (pregunta: Pregunta) => {
    const preguntaId = pregunta._id || '';
    const valor = respuestas[preguntaId];
    const error = errors[preguntaId];

    switch (pregunta.tipo) {
      case 'estrellas':
        return (
          <PreguntaTipoEstrellas
            key={preguntaId}
            preguntaId={preguntaId}
            preguntaTexto={pregunta.texto}
            valor={valor}
            onChange={(val) => handleRespuestaChange(preguntaId, val)}
            requerida={true}
          />
        );
      case 'multiple':
        return (
          <PreguntaTipoMultipleChoice
            key={preguntaId}
            preguntaId={preguntaId}
            preguntaTexto={pregunta.texto}
            opciones={pregunta.opciones || []}
            valor={valor}
            onChange={(val) => handleRespuestaChange(preguntaId, val)}
            requerida={true}
          />
        );
      case 'abierta':
        return (
          <PreguntaTipoAbierta
            key={preguntaId}
            preguntaId={preguntaId}
            preguntaTexto={pregunta.texto}
            valor={valor}
            onChange={(val) => handleRespuestaChange(preguntaId, val)}
            requerida={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{plantilla.titulo}</h2>
        {plantilla.descripcion && (
          <p className="text-gray-600 mb-6">{plantilla.descripcion}</p>
        )}

        <div className="space-y-4">
          {plantilla.preguntas.map((pregunta) => (
            <div key={pregunta._id}>
              {renderPregunta(pregunta)}
              {errors[pregunta._id || ''] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[pregunta._id || '']}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Enviar Encuesta</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}


