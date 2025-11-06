import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { solicitarAnalisisIA, SolicitudAnalisis } from '../api/dentiaApi';

interface SubmitToIAButtonProps {
  radiografiaId: string;
  pacienteId: string;
  onAnalisisIniciado?: (analisisId: string) => void;
  disabled?: boolean;
}

export default function SubmitToIAButton({
  radiografiaId,
  pacienteId,
  onAnalisisIniciado,
  disabled = false,
}: SubmitToIAButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (disabled || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const solicitud: SolicitudAnalisis = {
        radiografiaId,
        pacienteId,
      };

      const respuesta = await solicitarAnalisisIA(solicitud);

      setSuccess(true);
      
      if (onAnalisisIniciado) {
        onAnalisisIniciado(respuesta.analisisId);
      }

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar análisis');
      console.error('Error al solicitar análisis de IA:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSubmit}
        disabled={disabled || loading || success}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200 shadow-sm
          ${
            success
              ? 'bg-green-600 text-white cursor-default'
              : loading
              ? 'bg-blue-500 text-white cursor-wait'
              : disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-md active:scale-95'
          }
        `}
      >
        {success ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Análisis Enviado</span>
          </>
        ) : loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Analizar con DentIA</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
}


