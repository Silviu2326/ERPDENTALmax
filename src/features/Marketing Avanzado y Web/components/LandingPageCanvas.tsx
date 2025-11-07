import { Layout } from 'lucide-react';
import { ContenidoJson } from '../api/landingPagesApi';
import TextBlockEditor from './TextBlockEditor';
import ImageBlockEditor from './ImageBlockEditor';
import LeadCaptureFormBlock from './LeadCaptureFormBlock';
import TestimonialBlock from './TestimonialBlock';

interface LandingPageCanvasProps {
  contenido: ContenidoJson;
  bloqueSeleccionado: string | null;
  onBloqueSeleccionado: (bloqueId: string | null) => void;
}

export default function LandingPageCanvas({
  contenido,
  bloqueSeleccionado,
  onBloqueSeleccionado,
}: LandingPageCanvasProps) {
  const renderBloque = (bloque: any) => {
    const isSelected = bloque.id === bloqueSeleccionado;

    const baseClasses = `relative mb-4 rounded-xl transition-all ${
      isSelected 
        ? 'ring-2 ring-blue-500 shadow-lg' 
        : 'ring-1 ring-transparent hover:ring-slate-300'
    }`;

    switch (bloque.tipo) {
      case 'texto':
        return (
          <div
            key={bloque.id}
            className={baseClasses}
            onClick={() => onBloqueSeleccionado(bloque.id)}
          >
            <TextBlockEditor bloque={bloque} />
          </div>
        );
      case 'imagen':
        return (
          <div
            key={bloque.id}
            className={baseClasses}
            onClick={() => onBloqueSeleccionado(bloque.id)}
          >
            <ImageBlockEditor bloque={bloque} />
          </div>
        );
      case 'formulario':
        return (
          <div
            key={bloque.id}
            className={baseClasses}
            onClick={() => onBloqueSeleccionado(bloque.id)}
          >
            <LeadCaptureFormBlock bloque={bloque} />
          </div>
        );
      case 'testimonial':
        return (
          <div
            key={bloque.id}
            className={baseClasses}
            onClick={() => onBloqueSeleccionado(bloque.id)}
          >
            <TestimonialBlock bloque={bloque} />
          </div>
        );
      default:
        return (
          <div key={bloque.id} className={baseClasses}>
            <div className="p-4 bg-slate-100 rounded-xl ring-1 ring-slate-200">Bloque desconocido: {bloque.tipo}</div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm min-h-screen">
      <div className="p-8">
        {contenido.bloques && contenido.bloques.length > 0 ? (
          contenido.bloques.map((bloque) => renderBloque(bloque))
        ) : (
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Layout size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay bloques en esta página</h3>
            <p className="text-gray-600">Arrastra bloques desde la barra lateral para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}



