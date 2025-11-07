interface TestimonialBlockProps {
  bloque: any;
}

export default function TestimonialBlock({ bloque }: TestimonialBlockProps) {
  const nombre = bloque.contenido?.nombre || 'Cliente';
  const texto = bloque.contenido?.texto || 'Testimonio del cliente';

  return (
    <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center ring-1 ring-blue-200/70">
            <span className="text-blue-600 font-semibold text-lg">{nombre.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 mb-3 italic leading-relaxed">"{texto}"</p>
          <p className="text-sm font-medium text-gray-900">— {nombre}</p>
        </div>
      </div>
    </div>
  );
}



