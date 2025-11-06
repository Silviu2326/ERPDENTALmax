import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface VisorDicom3DProps {
  modeloProcesadoPath?: string;
  archivosDicomPaths?: string[];
  estadoProcesamiento: 'pendiente' | 'procesando' | 'completado' | 'error';
  onModeloCargado?: () => void;
}

export default function VisorDicom3D({
  modeloProcesadoPath,
  archivosDicomPaths,
  estadoProcesamiento,
  onModeloCargado,
}: VisorDicom3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (estadoProcesamiento === 'completado' && modeloProcesadoPath) {
      cargarModelo3D();
    } else if (estadoProcesamiento === 'procesando') {
      setCargando(true);
    } else if (estadoProcesamiento === 'error') {
      setError('Error al procesar los archivos DICOM');
      setCargando(false);
    }
  }, [estadoProcesamiento, modeloProcesadoPath]);

  const cargarModelo3D = async () => {
    if (!containerRef.current || !modeloProcesadoPath) return;

    setCargando(true);
    setError(null);

    try {
      // TODO: Integrar librería de visualización 3D (VTK.js, Three.js, OHIF, etc.)
      // Por ahora, mostramos un placeholder
      console.log('Cargando modelo 3D desde:', modeloProcesadoPath);
      
      // Simulación de carga
      setTimeout(() => {
        setCargando(false);
        if (onModeloCargado) {
          onModeloCargado();
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el modelo 3D');
      setCargando(false);
    }
  };

  if (estadoProcesamiento === 'pendiente') {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">No hay archivos DICOM cargados</p>
          <p className="text-sm text-gray-500 mt-1">Sube archivos DICOM para generar el modelo 3D</p>
        </div>
      </div>
    );
  }

  if (estadoProcesamiento === 'procesando') {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Procesando archivos DICOM...</p>
          <p className="text-sm text-gray-500 mt-2">Esto puede tardar varios minutos</p>
        </div>
      </div>
    );
  }

  if (estadoProcesamiento === 'error' || error) {
    return (
      <div className="w-full h-full bg-red-50 rounded-lg flex items-center justify-center border-2 border-red-200">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium">Error al procesar</p>
          <p className="text-sm text-red-600 mt-1">{error || 'Error al procesar los archivos DICOM'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg relative overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      >
        {cargando && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-blue-300 text-sm">Cargando modelo 3D...</p>
            </div>
          </div>
        )}
        
        {/* Placeholder para el visor 3D */}
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="w-24 h-24 border-4 border-blue-400 rounded-lg mx-auto mb-4 animate-pulse" />
            <p className="text-sm">Visor 3D DICOM</p>
            <p className="text-xs mt-1 text-gray-400">
              Integrar librería de visualización 3D (VTK.js/Three.js)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


