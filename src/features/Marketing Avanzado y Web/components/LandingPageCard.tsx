import { Edit, Trash2, ExternalLink } from 'lucide-react';
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
    landingPage.estado === 'publicada' 
      ? 'bg-green-100 text-green-800 ring-1 ring-green-200' 
      : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200';

  return (
    <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col transition-all overflow-hidden hover:shadow-md">
      <div className="p-4 flex flex-col h-full">
        {/* Header con título y badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{landingPage.nombre}</h3>
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${estadoColor}`}>
              {landingPage.estado === 'publicada' ? 'Publicada' : 'Borrador'}
            </span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="space-y-3 text-sm mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Visitas:</span>
            <span className="font-medium text-gray-900">{landingPage.stats.visitas}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Conversiones:</span>
            <span className="font-medium text-gray-900">{landingPage.stats.conversiones}</span>
          </div>
          {landingPage.slug && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-500 truncate">/{landingPage.slug}</span>
            </div>
          )}
        </div>

        {/* Fecha de actualización */}
        <div className="text-xs text-slate-500 mb-4">
          Actualizado: {new Date(landingPage.updatedAt).toLocaleDateString('es-ES')}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          {onEditar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditar();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all text-slate-600 hover:text-blue-600 hover:bg-blue-50 ring-1 ring-slate-200 hover:ring-blue-200"
              title="Editar"
            >
              <Edit size={16} />
              <span>Editar</span>
            </button>
          )}
          {onEliminar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEliminar();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all text-slate-600 hover:text-red-600 hover:bg-red-50 ring-1 ring-slate-200 hover:ring-red-200"
              title="Eliminar"
            >
              <Trash2 size={16} />
              <span>Eliminar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



