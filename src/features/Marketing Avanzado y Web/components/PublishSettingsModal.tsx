import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { LandingPage, actualizarLandingPage } from '../api/landingPagesApi';

interface PublishSettingsModalProps {
  landingPage: LandingPage;
  onClose: () => void;
  onPublicar: (landingPage: LandingPage) => void;
}

export default function PublishSettingsModal({
  landingPage,
  onClose,
  onPublicar,
}: PublishSettingsModalProps) {
  const [nombre, setNombre] = useState(landingPage.nombre);
  const [slug, setSlug] = useState(landingPage.slug);
  const [tituloSEO, setTituloSEO] = useState(landingPage.seoMeta.titulo);
  const [descripcionSEO, setDescripcionSEO] = useState(landingPage.seoMeta.descripcion);
  const [estado, setEstado] = useState<'borrador' | 'publicada'>(landingPage.estado);

  const handleGuardar = async () => {
    try {
      const landingPageActualizada = await actualizarLandingPage(landingPage._id, {
        nombre,
        slug,
        seoMeta: {
          titulo: tituloSEO,
          descripcion: descripcionSEO,
        },
        estado,
      });

      onPublicar(landingPageActualizada);
    } catch (err) {
      alert('Error al guardar la configuración');
      console.error(err);
    }
  };

  const generarSlugDesdeNombre = (nombre: string) => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
          <h2 className="text-xl font-semibold text-gray-900">Configuración de Publicación</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Página</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (!slug) {
                  setSlug(generarSlugDesdeNombre(e.target.value));
                }
              }}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Ej: Campaña Blanqueamiento 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">URL Amigable (Slug)</label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="campana-blanqueamiento-2024"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              La URL será: /landing/{slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Título SEO</label>
            <input
              type="text"
              value={tituloSEO}
              onChange={(e) => setTituloSEO(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Título optimizado para motores de búsqueda"
              maxLength={60}
            />
            <p className="mt-1 text-xs text-slate-500">{tituloSEO.length}/60 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descripción SEO</label>
            <textarea
              value={descripcionSEO}
              onChange={(e) => setDescripcionSEO(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              rows={3}
              placeholder="Descripción para motores de búsqueda"
              maxLength={160}
            />
            <p className="mt-1 text-xs text-slate-500">{descripcionSEO.length}/160 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as 'borrador' | 'publicada')}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="borrador">Borrador</option>
              <option value="publicada">Publicada</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t border-gray-200/60">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Save size={20} />
            <span>Guardar y Publicar</span>
          </button>
        </div>
      </div>
    </div>
  );
}



