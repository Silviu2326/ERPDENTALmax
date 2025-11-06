interface ImageBlockEditorProps {
  bloque: any;
}

export default function ImageBlockEditor({ bloque }: ImageBlockEditorProps) {
  const url = bloque.contenido?.url || '';
  const alt = bloque.contenido?.alt || 'Imagen';

  return (
    <div className="p-4">
      {url ? (
        <img src={url} alt={alt} className="w-full h-auto rounded-lg" />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Sin imagen</span>
        </div>
      )}
    </div>
  );
}


