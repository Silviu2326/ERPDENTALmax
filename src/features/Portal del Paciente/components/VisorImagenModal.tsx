import { useState, useEffect, useRef } from 'react';
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { ImagenClinica, descargarMiImagen, obtenerUrlImagen } from '../api/imagenesApi';

interface VisorImagenModalProps {
  imagen: ImagenClinica | null;
  imagenes: ImagenClinica[];
  isOpen: boolean;
  onClose: () => void;
  onImagenAnterior?: () => void;
  onImagenSiguiente?: () => void;
}

export default function VisorImagenModal({
  imagen,
  imagenes,
  isOpen,
  onClose,
  onImagenAnterior,
  onImagenSiguiente,
}: VisorImagenModalProps) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotacion, setRotacion] = useState(0);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (imagen && isOpen) {
      setCargando(true);
      setError(null);
      setZoom(100);
      setRotacion(0);
      
      // Cargar la imagen usando fetch con headers de autenticación
      const token = localStorage.getItem('patientToken');
      if (!token) {
        setError('No hay token de autenticación');
        setCargando(false);
        return;
      }

      const url = obtenerUrlImagen(imagen.id);
      
      // Crear un blob URL para la imagen usando fetch con headers
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al cargar la imagen');
          }
          return response.blob();
        })
        .then((blob) => {
          // Revocar el blob URL anterior si existe
          if (blobUrlRef.current) {
            window.URL.revokeObjectURL(blobUrlRef.current);
          }
          
          const blobUrl = window.URL.createObjectURL(blob);
          blobUrlRef.current = blobUrl;
          setImagenUrl(blobUrl);
          setCargando(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Error al cargar la imagen');
          setCargando(false);
        });
    }

    // Cleanup: revocar el blob URL cuando el componente se desmonte o cambie la imagen
    return () => {
      if (blobUrlRef.current) {
        window.URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [imagen, isOpen]);

  const handleDescargar = async () => {
    if (!imagen) return;

    try {
      setCargando(true);
      const blob = await descargarMiImagen(imagen.id);
      
      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imagen.nombre_archivo || `imagen-${imagen.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar la imagen');
    } finally {
      setCargando(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25));
  };

  const handleRotar = () => {
    setRotacion((prev) => (prev + 90) % 360);
  };

  const indiceActual = imagen ? imagenes.findIndex((img) => img.id === imagen.id) : -1;
  const tieneAnterior = indiceActual > 0;
  const tieneSiguiente = indiceActual >= 0 && indiceActual < imagenes.length - 1;

  if (!isOpen || !imagen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-75 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold truncate max-w-md">
              {imagen.nombre || 'Imagen clínica'}
            </h2>
            <span className="text-sm text-gray-300">
              {new Date(imagen.fecha_captura).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Controles de zoom y rotación */}
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Alejar"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Acercar"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleRotar}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Rotar"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleDescargar}
              disabled={cargando}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors disabled:opacity-50"
              aria-label="Descargar"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido de la imagen */}
        <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
          {error && (
            <div className="text-center text-white">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={handleDescargar}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Intentar descargar
              </button>
            </div>
          )}
          
          {cargando && !error && (
            <div className="text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando imagen...</p>
            </div>
          )}

          {!cargando && !error && imagenUrl && (
            <div className="relative max-w-full max-h-full">
              <img
                src={imagenUrl}
                alt={imagen.nombre || 'Imagen clínica'}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotacion}deg)`,
                  transition: 'transform 0.3s ease',
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                }}
                className="rounded-lg shadow-2xl"
                onError={() => {
                  setError('Error al cargar la imagen');
                }}
              />
            </div>
          )}

          {/* Navegación entre imágenes */}
          {imagenes.length > 1 && (
            <>
              {tieneAnterior && (
                <button
                  onClick={onImagenAnterior}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {tieneSiguiente && (
                <button
                  onClick={onImagenSiguiente}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer con información */}
        {imagen.descripcion && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-75 text-white p-4">
            <p className="text-sm">{imagen.descripcion}</p>
          </div>
        )}

        {/* Indicador de posición */}
        {imagenes.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm">
            {indiceActual + 1} / {imagenes.length}
          </div>
        )}
      </div>
    </div>
  );
}

