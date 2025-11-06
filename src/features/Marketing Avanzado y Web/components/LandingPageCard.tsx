import { Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import { LandingPage } from '../api/landingPagesApi';

interface LandingPageCardProps {
  landingPage: LandingPage;
  onEditar?: () => void;
  onEliminar?: () => void;
}

export default function LandingPageCard({
  landingPage,
  onEditar,
  onEliminar,
}: LandingPageCardProps) {
  const estadoColor =
    landingPage.estado === 'publicada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{landingPage.nombre}</h3>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${estadoColor}`}>
            {landingPage.estado === 'publicada' ? 'Publicada' : 'Borrador'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {onEditar && (
            <button
              onClick={onEditar}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onEliminar && (
            <button
              onClick={onEliminar}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Visitas:</span>
          <span className="font-medium">{landingPage.stats.visitas}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Conversiones:</span>
          <span className="font-medium">{landingPage.stats.conversiones}</span>
        </div>
        {landingPage.slug && (
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 truncate">/{landingPage.slug}</span>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Actualizado: {new Date(landingPage.updatedAt).toLocaleDateString('es-ES')}
      </div>
    </div>
  );
}


