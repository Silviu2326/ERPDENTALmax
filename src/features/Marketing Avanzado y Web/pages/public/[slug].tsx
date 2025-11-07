import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
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
            <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-6">
              {enviado ? (
                <div className="rounded-2xl bg-green-50 ring-1 ring-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-green-900 mb-1">¡Mensaje enviado!</h3>
                      <p className="text-sm text-green-700">
                        Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 transition-all"
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 transition-all"
                      placeholder="+34 123 456 789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje</label>
                    <textarea
                      required
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 transition-all"
                      rows={4}
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm ring-1 ring-blue-200/70"
                  >
                    {enviando ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      'Enviar mensaje'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-8 text-center max-w-md mx-auto">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando página...</p>
        </div>
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-8 text-center max-w-md mx-auto">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Página no encontrada</h3>
          <p className="text-gray-600 mb-4">{error || 'La página que buscas no existe'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <head>
        <title>{landingPage.seoMeta.titulo || landingPage.nombre}</title>
        <meta name="description" content={landingPage.seoMeta.descripcion} />
      </head>

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {landingPage.contenidoJson.bloques?.map((bloque) => renderBloque(bloque))}
        </div>
      </main>
    </div>
  );
}



