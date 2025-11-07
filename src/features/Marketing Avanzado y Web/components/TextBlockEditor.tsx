interface TextBlockEditorProps {
  bloque: any;
}

export default function TextBlockEditor({ bloque }: TextBlockEditorProps) {
  const texto = bloque.contenido?.texto || 'Texto del bloque';
  const alineacion = bloque.contenido?.alineacion || 'left';

  return (
    <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-6">
      <div style={{ textAlign: alineacion }}>
        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{texto}</p>
      </div>
    </div>
  );
}



