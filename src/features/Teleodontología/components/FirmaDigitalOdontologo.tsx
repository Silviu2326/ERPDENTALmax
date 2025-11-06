import { useState, useRef } from 'react';
import { PenTool, CheckCircle, X } from 'lucide-react';

interface FirmaDigitalOdontologoProps {
  onFirmaCompleta: (firmaData: string) => void;
  firmaActual?: string;
  nombreOdontologo?: string;
}

export default function FirmaDigitalOdontologo({
  onFirmaCompleta,
  firmaActual,
  nombreOdontologo,
}: FirmaDigitalOdontologoProps) {
  const [firma, setFirma] = useState<string | null>(firmaActual || null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  const iniciarFirma = () => {
    setShowCanvas(true);
    setFirma(null);
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setFirma(null);
  };

  const obtenerFirma = (): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Verificar si hay algo dibujado
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some((channel) => channel !== 0);

    if (!hasContent) return null;

    return canvas.toDataURL('image/png');
  };

  const guardarFirma = () => {
    const firmaData = obtenerFirma();
    if (firmaData) {
      setFirma(firmaData);
      onFirmaCompleta(firmaData);
      setShowCanvas(false);
    } else {
      alert('Por favor, realice su firma antes de guardar');
    }
  };

  const cancelarFirma = () => {
    setShowCanvas(false);
    limpiarFirma();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="mb-6">
      <label className="flex items-center space-x-2 mb-3">
        <PenTool className="w-5 h-5 text-blue-600" />
        <span className="text-lg font-semibold text-gray-900">Firma Digital</span>
      </label>

      {firma && !showCanvas ? (
        <div className="border-2 border-blue-300 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Firma registrada</span>
            </div>
            <button
              onClick={iniciarFirma}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Cambiar firma
            </button>
          </div>
          <div className="border border-gray-200 rounded p-2 bg-gray-50">
            <img src={firma} alt="Firma digital" className="max-w-full h-auto" />
          </div>
          {nombreOdontologo && (
            <p className="mt-2 text-sm text-gray-600">
              Firmado digitalmente por: <span className="font-semibold">{nombreOdontologo}</span>
            </p>
          )}
        </div>
      ) : showCanvas ? (
        <div className="border-2 border-blue-300 rounded-lg p-4 bg-white">
          <div className="mb-3">
            <p className="text-sm text-gray-700 mb-2">
              Por favor, firme en el área de abajo usando el mouse o el dedo:
            </p>
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="border border-gray-300 rounded cursor-crosshair w-full"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={guardarFirma}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Guardar Firma
            </button>
            <button
              onClick={limpiarFirma}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Limpiar
            </button>
            <button
              onClick={cancelarFirma}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No se ha registrado una firma digital</p>
          <button
            onClick={iniciarFirma}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Firmar Digitalmente
          </button>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500">
        La firma digital certifica este informe y tiene validez legal. Asegúrese de que la firma sea clara y legible.
      </p>
    </div>
  );
}


