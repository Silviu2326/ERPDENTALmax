import { useState, useEffect } from 'react';
import { LandingPage, obtenerLandingPagePublica, capturarLead } from '../../api/landingPagesApi';
import TextBlockEditor from '../../components/TextBlockEditor';
import ImageBlockEditor from '../../components/ImageBlockEditor';
import TestimonialBlock from '../../components/TestimonialBlock';

interface LandingPagePublicaProps {
  slug: string;
}

export default function LandingPagePublica({ slug }: LandingPagePublicaProps) {
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    cargarLandingPage();
  }, [slug]);

  const cargarLandingPage = async () => {
    try {
      setLoading(true);
      const pagina = await obtenerLandingPagePublica(slug);
      setLandingPage(pagina);
      setError(null);
    } catch (err) {
      setError('Página no encontrada');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landingPage) return;

    try {
      setEnviando(true);
      await capturarLead(landingPage._id, formData);
      setEnviado(true);
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
    } catch (err) {
      alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const renderBloque = (bloque: any) => {
    switch (bloque.tipo) {
      case 'texto':
        return <TextBlockEditor key={bloque.id} bloque={bloque} />;
      case 'imagen':
        return <ImageBlockEditor key={bloque.id} bloque={bloque} />;
      case 'testimonial':
        return <TestimonialBlock key={bloque.id} bloque={bloque} />;
      case 'formulario':
        return (
          <div key={bloque.id} className="my-8">
            {enviado ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ¡Gracias! Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea
                    required
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando página...</p>
        </div>
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
          <p className="text-gray-600">{error || 'La página que buscas no existe'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <head>
        <title>{landingPage.seoMeta.titulo || landingPage.nombre}</title>
        <meta name="description" content={landingPage.seoMeta.descripcion} />
      </head>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {landingPage.contenidoJson.bloques?.map((bloque) => renderBloque(bloque))}
      </main>
    </div>
  );
}


