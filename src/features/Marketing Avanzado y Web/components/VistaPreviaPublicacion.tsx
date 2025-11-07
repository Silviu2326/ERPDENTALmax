import { Facebook, Instagram, Linkedin, Twitter, MessageSquare, Heart, Share2 } from 'lucide-react';
import { PublicacionSocial, PlataformaSocial } from '../api/publicacionesSocialesApi';

interface VistaPreviaPublicacionProps {
  publicacion: PublicacionSocial;
  plataforma: PlataformaSocial;
}

export default function VistaPreviaPublicacion({
  publicacion,
  plataforma,
}: VistaPreviaPublicacionProps) {
  const getPlataformaIcon = (plataforma: PlataformaSocial) => {
    switch (plataforma) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'tiktok':
        return <MessageSquare className="w-5 h-5 text-black" />;
      default:
        return null;
    }
  };

  const getPlataformaColor = (plataforma: PlataformaSocial) => {
    switch (plataforma) {
      case 'facebook':
        return 'border-blue-200 bg-blue-50';
      case 'instagram':
        return 'border-pink-200 bg-pink-50';
      case 'linkedin':
        return 'border-blue-300 bg-blue-50';
      case 'twitter':
        return 'border-blue-200 bg-blue-50';
      case 'tiktok':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getPlataformaColor(plataforma)}`}>
      <div className="flex items-center space-x-2 mb-3">
        {getPlataformaIcon(plataforma)}
        <h3 className="font-semibold text-gray-900 capitalize">{plataforma}</h3>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        {/* Header simulado */}
        <div className="flex items-center space-x-3 mb-3 pb-3 border-b">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            CD
          </div>
          <div>
            <p className="font-semibold text-sm">Clínica Dental</p>
            <p className="text-xs text-gray-500">Ahora</p>
          </div>
        </div>

        {/* Contenido */}
        <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">
          {publicacion.contenido}
        </p>

        {/* Media */}
        {publicacion.mediaUrls && publicacion.mediaUrls.length > 0 && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={publicacion.mediaUrls[0]}
              alt="Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Métricas simuladas */}
        <div className="flex items-center justify-between pt-3 border-t text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{publicacion.metricas?.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">{publicacion.metricas?.comentarios || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span className="text-xs">{publicacion.metricas?.compartidos || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



