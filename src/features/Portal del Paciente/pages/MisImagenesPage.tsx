import { useState, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import GaleriaImagenesGrid from '../components/GaleriaImagenesGrid';
import VisorImagenModal from '../components/VisorImagenModal';
import FiltrosImagenes from '../components/FiltrosImagenes';
import { obtenerMisImagenes, ImagenClinica, FiltrosImagenes as FiltrosImagenesType } from '../api/imagenesApi';

interface MisImagenesPageProps {
  onVolver?: () => void;
}

export default function MisImagenesPage({ onVolver }: MisImagenesPageProps) {
  const [imagenes, setImagenes] = useState<ImagenClinica[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<ImagenClinica | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosImagenesType>({
    page: 1,
    limit: 20,
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalImagenes, setTotalImagenes] = useState(0);

  useEffect(() => {
    cargarImagenes();
  }, [filtros]);

  const cargarImagenes = async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await obtenerMisImagenes(filtros);
      setImagenes(respuesta.data);
      setPaginaActual(respuesta.page);
      setTotalPaginas(respuesta.pages);
      setTotalImagenes(respuesta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las imágenes');
      console.error('Error al cargar imágenes:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleImagenClick = (imagen: ImagenClinica) => {
    setImagenSeleccionada(imagen);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setImagenSeleccionada(null);
  };

  const handleImagenAnterior = () => {
    if (!imagenSeleccionada) return;
    const indiceActual = imagenes.findIndex((img) => img.id === imagenSeleccionada.id);
    if (indiceActual > 0) {
      setImagenSeleccionada(imagenes[indiceActual - 1]);
    }
  };

  const handleImagenSiguiente = () => {
    if (!imagenSeleccionada) return;
    const indiceActual = imagenes.findIndex((img) => img.id === imagenSeleccionada.id);
    if (indiceActual < imagenes.length - 1) {
      setImagenSeleccionada(imagenes[indiceActual + 1]);
    }
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({
      ...prev,
      page: nuevaPagina,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mis Imágenes</h1>
                  <p className="text-sm text-gray-600">
                    Radiografías y fotografías clínicas
                  </p>
                </div>
              </div>
            </div>
            {totalImagenes > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {totalImagenes} {totalImagenes === 1 ? 'imagen' : 'imágenes'} en total
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <FiltrosImagenes filtros={filtros} onFiltrosChange={setFiltros} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={cargarImagenes}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Galería */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <GaleriaImagenesGrid
            imagenes={imagenes}
            cargando={cargando}
            onImagenClick={handleImagenClick}
          />
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && !cargando && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            <button
              onClick={() => handleCambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => handleCambiarPagina(pagina)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pagina === paginaActual
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pagina}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleCambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      {/* Modal de Visor de Imagen */}
      <VisorImagenModal
        imagen={imagenSeleccionada}
        imagenes={imagenes}
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onImagenAnterior={handleImagenAnterior}
        onImagenSiguiente={handleImagenSiguiente}
      />
    </div>
  );
}



