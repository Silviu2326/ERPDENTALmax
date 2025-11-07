interface ImageBlockEditorProps {
  bloque: any;
}

export default function ImageBlockEditor({ bloque }: ImageBlockEditorProps) {
  const url = bloque.contenido?.url || '';
  const alt = bloque.contenido?.alt || 'Imagen';

  return (
    <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 overflow-hidden">
      {url ? (
        <img src={url} alt={alt} className="w-full h-auto" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Sin imagen</span>
        </div>
      )}
    </div>
  );
}



