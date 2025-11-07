interface LeadCaptureFormBlockProps {
  bloque: any;
}

export default function LeadCaptureFormBlock({ bloque }: LeadCaptureFormBlockProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Formulario de Contacto</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Tu nombre"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="tu@email.com"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="+34 600 000 000"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={4}
            placeholder="Tu mensaje..."
            disabled
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled
        >
          Enviar
        </button>
      </div>
    </div>
  );
}



