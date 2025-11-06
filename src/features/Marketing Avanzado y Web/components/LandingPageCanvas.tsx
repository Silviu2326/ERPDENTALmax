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

    const baseClasses = `relative mb-4 border-2 rounded-lg transition-all ${
      isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
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
            <div className="p-4 bg-gray-100 rounded">Bloque desconocido: {bloque.tipo}</div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg min-h-screen">
      <div className="p-8">
        {contenido.bloques && contenido.bloques.length > 0 ? (
          contenido.bloques.map((bloque) => renderBloque(bloque))
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No hay bloques en esta página</p>
            <p className="text-sm">Arrastra bloques desde la barra lateral para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}


