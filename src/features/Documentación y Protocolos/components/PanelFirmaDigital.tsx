import { useState, useRef, useEffect } from 'react';
import { RotateCcw, CheckCircle2, AlertCircle, PenTool } from 'lucide-react';

interface PanelFirmaDigitalProps {
  onFirmar: (firmaBase64: string) => void;
  nombrePaciente?: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function PanelFirmaDigital({
  onFirmar,
  nombrePaciente,
  disabled = false,
  loading = false,
}: PanelFirmaDigitalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Configurar el contexto del canvas
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Ajustar el tamaño del canvas según el contenedor
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    }
  }, []);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || loading) return;
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || loading) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
    setError(null);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setError(null);
  };

  const handleFirmar = () => {
    if (!hasSignature) {
      setError('Por favor, proporciona tu firma antes de continuar');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const firmaBase64 = canvas.toDataURL('image/png');
      setError(null);
      onFirmar(firmaBase64);
    } catch (err) {
      setError('Error al procesar la firma. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <PenTool className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Firma Digital</h3>
        </div>
        {nombrePaciente && (
          <p className="text-gray-600 text-sm">Paciente: {nombrePaciente}</p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-700 text-sm mb-3">
          Por favor, firma en el área inferior usando el ratón o el dedo (en dispositivos táctiles).
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full border border-gray-300 rounded bg-white cursor-crosshair touch-none"
            style={{ maxWidth: '100%', height: 'auto' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={limpiarFirma}
          disabled={disabled || loading || !hasSignature}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Limpiar</span>
        </button>

        <button
          onClick={handleFirmar}
          disabled={disabled || loading || !hasSignature}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Firma</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


