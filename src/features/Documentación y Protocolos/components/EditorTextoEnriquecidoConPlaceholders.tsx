import { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Code } from 'lucide-react';

interface EditorTextoEnriquecidoConPlaceholdersProps {
  contenido: string;
  onChange: (contenido: string) => void;
  onInsertarPlaceholder: (placeholder: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function EditorTextoEnriquecidoConPlaceholders({
  contenido,
  onChange,
  onInsertarPlaceholder,
  placeholder = 'Escribe el contenido de la plantilla aquí. Usa los placeholders disponibles para insertar datos dinámicos.',
  disabled = false,
}: EditorTextoEnriquecidoConPlaceholdersProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== contenido) {
      editorRef.current.innerHTML = contenido;
    }
  }, [contenido]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const ejecutarComando = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertarPlaceholder = (placeholder: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(placeholder);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Si no hay selección, insertar al final
        const span = document.createElement('span');
        span.style.backgroundColor = '#fef3c7';
        span.style.padding = '2px 4px';
        span.style.borderRadius = '3px';
        span.style.fontFamily = 'monospace';
        span.textContent = placeholder;
        editorRef.current.appendChild(span);
      }
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
    onInsertarPlaceholder(placeholder);
  };

  // Exponer el método para insertar placeholders desde el componente padre
  useEffect(() => {
    if (editorRef.current) {
      (editorRef.current as any).insertarPlaceholder = insertarPlaceholder;
    }
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Barra de herramientas */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => ejecutarComando('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => ejecutarComando('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => ejecutarComando('underline')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Subrayado"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          type="button"
          onClick={() => ejecutarComando('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Alinear izquierda"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => ejecutarComando('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Centrar"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => ejecutarComando('justifyRight')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Alinear derecha"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          type="button"
          onClick={() => ejecutarComando('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => ejecutarComando('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Ingresa la URL:');
            if (url) ejecutarComando('createLink', url);
          }}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insertar enlace"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const placeholder = prompt('Ingresa el placeholder (ej: {{paciente.nombre}}):');
            if (placeholder) insertarPlaceholder(placeholder);
          }}
          className="p-2 hover:bg-gray-200 rounded transition-colors bg-yellow-100"
          title="Insertar placeholder"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        className="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}



