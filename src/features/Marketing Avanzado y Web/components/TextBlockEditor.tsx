interface TextBlockEditorProps {
  bloque: any;
}

export default function TextBlockEditor({ bloque }: TextBlockEditorProps) {
  const texto = bloque.contenido?.texto || 'Texto del bloque';
  const alineacion = bloque.contenido?.alineacion || 'left';

  return (
    <div className="p-4">
      <div style={{ textAlign: alineacion }}>
        <p className="text-gray-700 whitespace-pre-wrap">{texto}</p>
      </div>
    </div>
  );
}


