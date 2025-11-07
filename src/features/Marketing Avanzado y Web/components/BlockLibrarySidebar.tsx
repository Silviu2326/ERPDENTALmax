import { FileText, Image, ClipboardList, MessageSquare } from 'lucide-react';

interface BlockLibrarySidebarProps {
  onAgregarBloque: (tipo: string) => void;
}

export default function BlockLibrarySidebar({ onAgregarBloque }: BlockLibrarySidebarProps) {
  const tiposBloques = [
    {
      tipo: 'texto',
      nombre: 'Texto',
      icono: FileText,
      descripcion: 'Añade bloques de texto con formato',
    },
    {
      tipo: 'imagen',
      nombre: 'Imagen',
      icono: Image,
      descripcion: 'Inserta imágenes y galerías',
    },
    {
      tipo: 'formulario',
      nombre: 'Formulario de Contacto',
      icono: ClipboardList,
      descripcion: 'Captura de leads',
    },
    {
      tipo: 'testimonial',
      nombre: 'Testimonio',
      icono: MessageSquare,
      descripcion: 'Muestra testimonios de clientes',
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Biblioteca de Bloques</h2>
        <p className="text-sm text-gray-600">
          Arrastra o haz clic para añadir bloques a tu página
        </p>
      </div>

      <div className="space-y-2">
        {tiposBloques.map((bloque) => {
          const Icono = bloque.icono;
          return (
            <button
              key={bloque.tipo}
              onClick={() => onAgregarBloque(bloque.tipo)}
              className="w-full flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left shadow-sm hover:shadow-md"
            >
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70 flex-shrink-0">
                <Icono className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">{bloque.nombre}</h3>
                <p className="text-xs text-gray-500 mt-1">{bloque.descripcion}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}



