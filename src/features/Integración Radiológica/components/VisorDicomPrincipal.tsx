import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { obtenerDetalleEstudio, obtenerArchivoDicom, DetalleEstudio } from '../api/radiologiaApi';

interface VisorDicomPrincipalProps {
  estudioId: string;
  onError?: (error: string) => void;
}

export default function VisorDicomPrincipal({ estudioId, onError }: VisorDicomPrincipalProps) {
  const [estudio, setEstudio] = useState<DetalleEstudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenActual, setImagenActual] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [contrast, setContrast] = useState(1);
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
        const datos = await obtenerDetalleEstudio(estudioId);
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

  // Cargar y renderizar la imagen actual
  useEffect(() => {
    const renderizarImagen = async () => {
      if (!estudio || !canvasRef.current) return;

      const serie = estudio.series[0];
      if (!serie || !serie.imagenes || serie.imagenes.length === 0) return;

      const imagen = serie.imagenes[imagenActual];
      if (!imagen) return;

      try {
        const blob = await obtenerArchivoDicom(imagen._id);
        // En un entorno real, aquí se usaría una librería DICOM como cornerstone.js
        // Por ahora, mostramos un placeholder
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar placeholder
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#9ca3af';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Visor DICOM - Imagen cargada', canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Imagen ${imagenActual + 1} de ${serie.imagenes.length}`, canvas.width / 2, canvas.height / 2 + 30);
      } catch (err) {
        console.error('Error al cargar imagen DICOM:', err);
      }
    };

    renderizarImagen();
  }, [estudio, imagenActual]);

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
  };

  const handleAjustarContraste = (incremento: number) => {
    setContrast((prev) => Math.max(0.1, Math.min(3, prev + incremento / 100)));
  };

  const handleSiguienteImagen = () => {
    if (!estudio || !estudio.series[0]?.imagenes) return;
    const totalImagenes = estudio.series[0].imagenes.length;
    setImagenActual((prev) => (prev + 1) % totalImagenes);
  };

  const handleImagenAnterior = () => {
    if (!estudio || !estudio.series[0]?.imagenes) return;
    const totalImagenes = estudio.series[0].imagenes.length;
    setImagenActual((prev) => (prev - 1 + totalImagenes) % totalImagenes);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
      </div>
    );
  }

  if (!estudio) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
        <p className="text-gray-600">No hay estudio seleccionado</p>
      </div>
    );
  }

  const totalImagenes = estudio.series[0]?.imagenes?.length || 0;

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
            filter: `contrast(${contrast})`,
            transition: 'transform 0.2s, filter 0.2s',
          }}
        />
        {totalImagenes > 1 && (
          <>
            <button
              onClick={handleImagenAnterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              title="Imagen anterior"
            >
              ←
            </button>
            <button
              onClick={handleSiguienteImagen}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              title="Siguiente imagen"
            >
              →
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-xl text-sm font-medium">
              {imagenActual + 1} / {totalImagenes}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Exportar funciones para que el componente padre pueda controlarlas
export type VisorDicomControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  rotate: () => void;
  reset: () => void;
  ajustarContraste: (incremento: number) => void;
};



