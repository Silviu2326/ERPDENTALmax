import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Settings } from 'lucide-react';
import { LandingPage, obtenerLandingPage, guardarLandingPage } from '../api/landingPagesApi';
import LandingPageCanvas from '../components/LandingPageCanvas';
import BlockLibrarySidebar from '../components/BlockLibrarySidebar';
import PropertyInspectorPanel from '../components/PropertyInspectorPanel';
import PublishSettingsModal from '../components/PublishSettingsModal';

interface LandingPageEditorPageProps {
  landingPageId?: string | null;
  onVolver?: () => void;
  onGuardado?: () => void;
}

export default function LandingPageEditorPage({
  landingPageId,
  onVolver,
  onGuardado,
}: LandingPageEditorPageProps) {
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalPublicacion, setMostrarModalPublicacion] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    if (landingPageId) {
      cargarLandingPage();
    } else {
      // Crear nueva landing page vacía
      setLandingPage({
        _id: '',
        nombre: 'Nueva Landing Page',
        slug: '',
        contenidoJson: { bloques: [] },
        seoMeta: { titulo: '', descripcion: '' },
        estado: 'borrador',
        clinicaId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: { visitas: 0, conversiones: 0 },
      });
      setLoading(false);
    }
  }, [landingPageId]);

  const cargarLandingPage = async () => {
    if (!landingPageId) return;

    try {
      setLoading(true);
      const pagina = await obtenerLandingPage(landingPageId);
      setLandingPage(pagina);
      setError(null);
    } catch (err) {
      setError('Error al cargar la landing page');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!landingPage) return;

    try {
      await guardarLandingPage(landingPage);
      alert('Landing page guardada correctamente');
      onGuardado?.();
    } catch (err) {
      alert('Error al guardar la landing page');
      console.error(err);
    }
  };

  const handleAgregarBloque = (tipoBloque: string) => {
    if (!landingPage) return;

    const nuevoBloque = {
      id: `bloque-${Date.now()}`,
      tipo: tipoBloque,
      contenido: {},
    };

    const nuevoContenido = {
      ...landingPage.contenidoJson,
      bloques: [...(landingPage.contenidoJson.bloques || []), nuevoBloque],
    };

    setLandingPage({
      ...landingPage,
      contenidoJson: nuevoContenido,
      updatedAt: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando editor...</p>
        </div>
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Error al cargar la landing page'}
        </div>
        {onVolver && (
          <button
            onClick={onVolver}
            className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al dashboard</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Barra superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-900">{landingPage.nombre}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGuardar}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Guardar</span>
          </button>
          <button
            onClick={() => setMostrarModalPublicacion(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Publicar</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="w-5 h-5" />
            <span>Vista previa</span>
          </button>
        </div>
      </div>

      {/* Área principal del editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar izquierda - Biblioteca de bloques */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <BlockLibrarySidebar onAgregarBloque={handleAgregarBloque} />
        </div>

        {/* Canvas central */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <LandingPageCanvas
            contenido={landingPage.contenidoJson}
            bloqueSeleccionado={bloqueSeleccionado}
            onBloqueSeleccionado={setBloqueSeleccionado}
          />
        </div>

        {/* Panel derecho - Inspector de propiedades */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <PropertyInspectorPanel
            bloqueId={bloqueSeleccionado}
            contenido={landingPage.contenidoJson}
            onActualizarContenido={(nuevoContenido) => {
              setLandingPage({
                ...landingPage,
                contenidoJson: nuevoContenido,
                updatedAt: new Date().toISOString(),
              });
            }}
          />
        </div>
      </div>

      {/* Modal de publicación */}
      {mostrarModalPublicacion && (
        <PublishSettingsModal
          landingPage={landingPage}
          onClose={() => setMostrarModalPublicacion(false)}
          onPublicar={(landingPageActualizada) => {
            setLandingPage(landingPageActualizada);
            setMostrarModalPublicacion(false);
            onGuardado?.();
          }}
        />
      )}
    </div>
  );
}


