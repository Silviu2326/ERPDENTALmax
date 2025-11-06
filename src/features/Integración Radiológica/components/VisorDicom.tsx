import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { obtenerEstudioPorId, DetalleEstudioCompleto } from '../api/estudiosApi';

interface VisorDicomProps {
  estudioId: string;
  onError?: (error: string) => void;
}

/**
 * Componente VisorDicom
 * Visualiza estudios radiológicos en formato DICOM.
 * Según especificaciones del módulo Integración Radiológica - Vista de TAC y Ortopantomografías
 */
export default function VisorDicom({ estudioId, onError }: VisorDicomProps) {
  const [estudio, setEstudio] = useState<DetalleEstudioCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenActual, setImagenActual] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cargarEstudio = async () => {
      if (!estudioId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const datos = await obtenerEstudioPorId(estudioId);
        setEstudio(datos);
      } catch (err) {
        const mensajeError = err instanceof Error ? err.message : 'Error al cargar el estudio';
        setError(mensajeError);
        if (onError) {
          onError(mensajeError);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarEstudio();
  }, [estudioId, onError]);

  // Cargar y renderizar la imagen DICOM
  useEffect(() => {
    const renderizarImagen = async () => {
      if (!estudio || !canvasRef.current || !estudio.urlDicom) return;

      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // En un entorno real, aquí se usaría una librería DICOM como cornerstone.js
        // para renderizar el archivo DICOM desde estudio.urlDicom
        // Por ahora, mostramos un placeholder con la información del estudio

        // Fondo
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Información del estudio
        ctx.fillStyle = '#9ca3af';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Visor DICOM', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.font = '14px Arial';
        ctx.fillText(estudio.tipoEstudio, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Fecha: ${new Date(estudio.fechaEstudio).toLocaleDateString('es-ES')}`, canvas.width / 2, canvas.height / 2 + 25);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Nota: En producción, aquí se renderizaría el archivo DICOM', canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('usando una librería especializada como Cornerstone.js', canvas.width / 2, canvas.height / 2 + 65);
      } catch (err) {
        console.error('Error al renderizar imagen DICOM:', err);
        setError('Error al renderizar la imagen');
      }
    };

    renderizarImagen();
  }, [estudio]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setContrast(1);
    setBrightness(1);
  };

  const handleAjustarContraste = (incremento: number) => {
    setContrast((prev) => Math.max(0.1, Math.min(3, prev + incremento / 100)));
  };

  const handleAjustarBrillo = (incremento: number) => {
    setBrightness((prev) => Math.max(0.1, Math.min(3, prev + incremento / 100)));
  };

  // Exponer controles para el componente padre
  useEffect(() => {
    // Los controles se pueden exponer mediante refs si es necesario
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Cargando estudio radiológico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-800 text-center font-medium">{error}</p>
        <p className="text-gray-600 text-sm text-center mt-2">
          No se pudo cargar el estudio radiológico. Por favor, intente nuevamente.
        </p>
      </div>
    );
  }

  if (!estudio) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <p className="text-gray-500">No hay estudio seleccionado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="max-w-full max-h-full"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            filter: `contrast(${contrast}) brightness(${brightness})`,
            transition: 'transform 0.2s, filter 0.2s',
          }}
        />
      </div>
    </div>
  );
}

// Exportar tipo para controles del visor
export type VisorDicomControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  rotate: () => void;
  reset: () => void;
  ajustarContraste: (incremento: number) => void;
  ajustarBrillo: (incremento: number) => void;
};


