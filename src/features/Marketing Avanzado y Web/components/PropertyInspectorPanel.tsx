import { ContenidoJson } from '../api/landingPagesApi';

interface PropertyInspectorPanelProps {
  bloqueId: string | null;
  contenido: ContenidoJson;
  onActualizarContenido: (nuevoContenido: ContenidoJson) => void;
}

export default function PropertyInspectorPanel({
  bloqueId,
  contenido,
  onActualizarContenido,
}: PropertyInspectorPanelProps) {
  const bloque = contenido.bloques?.find((b) => b.id === bloqueId);

  const handleActualizarBloque = (nuevosDatos: any) => {
    if (!bloque) return;

    const nuevosBloques = contenido.bloques.map((b) =>
      b.id === bloqueId ? { ...b, contenido: { ...b.contenido, ...nuevosDatos } } : b
    );

    onActualizarContenido({
      ...contenido,
      bloques: nuevosBloques,
    });
  };

  if (!bloqueId || !bloque) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Propiedades</h2>
        <p className="text-sm text-gray-500">Selecciona un bloque para editar sus propiedades</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Propiedades del Bloque</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Bloque</label>
          <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
            {bloque.tipo}
          </div>
        </div>

        {bloque.tipo === 'texto' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Texto</label>
              <textarea
                value={bloque.contenido.texto || ''}
                onChange={(e) => handleActualizarBloque({ texto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alineación</label>
              <select
                value={bloque.contenido.alineacion || 'left'}
                onChange={(e) => handleActualizarBloque({ alineacion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
        )}

        {bloque.tipo === 'imagen' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de la Imagen</label>
              <input
                type="text"
                value={bloque.contenido.url || ''}
                onChange={(e) => handleActualizarBloque({ url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                type="text"
                value={bloque.contenido.alt || ''}
                onChange={(e) => handleActualizarBloque({ alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción de la imagen"
              />
            </div>
          </div>
        )}

        {bloque.tipo === 'testimonial' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Cliente</label>
              <input
                type="text"
                value={bloque.contenido.nombre || ''}
                onChange={(e) => handleActualizarBloque({ nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Testimonio</label>
              <textarea
                value={bloque.contenido.texto || ''}
                onChange={(e) => handleActualizarBloque({ texto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


