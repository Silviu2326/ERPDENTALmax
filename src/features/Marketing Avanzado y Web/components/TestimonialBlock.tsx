interface TestimonialBlockProps {
  bloque: any;
}

export default function TestimonialBlock({ bloque }: TestimonialBlockProps) {
  const nombre = bloque.contenido?.nombre || 'Cliente';
  const texto = bloque.contenido?.texto || 'Testimonio del cliente';

  return (
    <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">{nombre.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-700 mb-2 italic">"{texto}"</p>
          <p className="text-sm font-medium text-gray-900">— {nombre}</p>
        </div>
      </div>
    </div>
  );
}


