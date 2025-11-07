import { useState, useEffect } from 'react';
import { X, Save, Calendar, Image, Facebook, Instagram, Linkedin, Twitter, MessageSquare, Eye } from 'lucide-react';
import {
  PublicacionSocial,
  CrearPublicacionData,
  ActualizarPublicacionData,
  crearPublicacion,
  actualizarPublicacion,
  EstadoPublicacion,
  PlataformaSocial,
} from '../api/publicacionesSocialesApi';
import VistaPreviaPublicacion from './VistaPreviaPublicacion';

interface ModalGestionPublicacionProps {
  publicacion?: PublicacionSocial | null;
  fechaSeleccionada?: Date;
  onClose: () => void;
  onSave: () => void;
}

const plataformasDisponibles: { value: PlataformaSocial; label: string; icon: React.ReactNode }[] = [
  { value: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
  { value: 'twitter', label: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
  { value: 'tiktok', label: 'TikTok', icon: <MessageSquare className="w-4 h-4" /> },
];

export default function ModalGestionPublicacion({
  publicacion,
  fechaSeleccionada,
  onClose,
  onSave,
}: ModalGestionPublicacionProps) {
  const [formData, setFormData] = useState<CrearPublicacionData>({
    contenido: publicacion?.contenido || '',
    mediaUrls: publicacion?.mediaUrls || [],
    plataformas: publicacion?.plataformas || [],
    estado: publicacion?.estado || 'borrador',
    fechaProgramacion: publicacion?.fechaProgramacion || fechaSeleccionada?.toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [urlImagenInput, setUrlImagenInput] = useState('');

  useEffect(() => {
    if (fechaSeleccionada && !publicacion) {
      setFormData((prev) => ({
        ...prev,
        fechaProgramacion: fechaSeleccionada.toISOString(),
      }));
    }
  }, [fechaSeleccionada, publicacion]);

  const handleChange = (key: keyof CrearPublicacionData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const togglePlataforma = (plataforma: PlataformaSocial) => {
    setFormData((prev) => ({
      ...prev,
      plataformas: prev.plataformas.includes(plataforma)
        ? prev.plataformas.filter((p) => p !== plataforma)
        : [...prev.plataformas, plataforma],
    }));
  };

  const agregarImagen = () => {
    if (urlImagenInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, urlImagenInput.trim()],
      }));
      setUrlImagenInput('');
    }
  };

  const eliminarImagen = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.contenido.trim()) {
      setError('El contenido es obligatorio');
      setLoading(false);
      return;
    }

    if (formData.plataformas.length === 0) {
      setError('Debes seleccionar al menos una plataforma');
      setLoading(false);
      return;
    }

    try {
      if (publicacion?._id) {
        await actualizarPublicacion(publicacion._id, formData);
      } else {
        await crearPublicacion(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la publicación');
    } finally {
      setLoading(false);
    }
  };

  const publicacionPreview: PublicacionSocial = {
    ...formData,
    _id: publicacion?._id,
    contenido: formData.contenido || 'Tu contenido aparecerá aquí...',
    mediaUrls: formData.mediaUrls,
    plataformas: formData.plataformas,
    estado: formData.estado,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200/60 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {publicacion ? 'Editar Publicación' : 'Nueva Publicación'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 ring-1 ring-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contenido
                </label>
                <textarea
                  value={formData.contenido}
                  onChange={(e) => handleChange('contenido', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  rows={6}
                  placeholder="Escribe el contenido de tu publicación..."
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.contenido.length} caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Imágenes/Media
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={urlImagenInput}
                    onChange={(e) => setUrlImagenInput(e.target.value)}
                    placeholder="URL de imagen..."
                    className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                  <button
                    type="button"
                    onClick={agregarImagen}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700 shadow-sm"
                  >
                    <Image size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {formData.mediaUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl ring-1 ring-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImagen%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Plataformas
                </label>
                <div className="flex flex-wrap gap-2">
                  {plataformasDisponibles.map((plataforma) => (
                    <button
                      key={plataforma.value}
                      type="button"
                      onClick={() => togglePlataforma(plataforma.value)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ring-1 ${
                        formData.plataformas.includes(plataforma.value)
                          ? 'ring-blue-500 bg-blue-50 text-blue-700'
                          : 'ring-slate-200 bg-white text-slate-700 hover:ring-slate-300'
                      }`}
                    >
                      {plataforma.icon}
                      <span>{plataforma.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value as EstadoPublicacion)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="borrador">Borrador</option>
                  <option value="programado">Programado</option>
                  <option value="publicado">Publicado</option>
                  <option value="archivado">Archivado</option>
                </select>
              </div>

              {formData.estado === 'programado' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha y Hora de Programación
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      formData.fechaProgramacion
                        ? new Date(formData.fechaProgramacion).toISOString().slice(0, 16)
                        : ''
                    }
                    onChange={(e) =>
                      handleChange('fechaProgramacion', new Date(e.target.value).toISOString())
                    }
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
                <button
                  type="button"
                  onClick={() => setMostrarPreview(!mostrarPreview)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Eye size={18} />
                  <span>{mostrarPreview ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>

              {mostrarPreview && formData.plataformas.length > 0 ? (
                <div className="space-y-4">
                  {formData.plataformas.map((plataforma) => (
                    <VistaPreviaPublicacion
                      key={plataforma}
                      publicacion={publicacionPreview}
                      plataforma={plataforma}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 ring-2 ring-dashed ring-gray-300 rounded-xl p-8 text-center">
                  <Eye size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {mostrarPreview
                      ? 'Selecciona al menos una plataforma para ver la vista previa'
                      : 'Activa la vista previa para ver cómo se verá tu publicación'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save size={18} />
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



