import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Settings, Layout, Loader2, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando editor...</p>
        </div>
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Error al cargar la landing page'}</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <ArrowLeft size={20} />
                <span>Volver al dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Layout size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {landingPage.nombre}
                  </h1>
                  <p className="text-gray-600">
                    Editor de Landing Page
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  >
                    <ArrowLeft size={20} />
                    <span>Volver</span>
                  </button>
                )}
                <button
                  onClick={handleGuardar}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Save size={20} />
                  <span>Guardar</span>
                </button>
                <button
                  onClick={() => setMostrarModalPublicacion(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm"
                >
                  <Settings size={20} />
                  <span>Publicar</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70">
                  <Eye size={20} />
                  <span>Vista previa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal del editor */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Sidebar izquierda - Biblioteca de bloques */}
        <div className="w-64 bg-white border-r border-gray-200/60 overflow-y-auto">
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
        <div className="w-80 bg-white border-l border-gray-200/60 overflow-y-auto">
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



