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
        <p className="text-sm text-slate-600">Selecciona un bloque para editar sus propiedades</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Propiedades del Bloque</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Bloque</label>
          <div className="px-3 py-2 bg-slate-100 rounded-xl text-sm text-slate-600 ring-1 ring-slate-200">
            {bloque.tipo}
          </div>
        </div>

        {bloque.tipo === 'texto' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Texto</label>
              <textarea
                value={bloque.contenido.texto || ''}
                onChange={(e) => handleActualizarBloque({ texto: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Alineación</label>
              <select
                value={bloque.contenido.alineacion || 'left'}
                onChange={(e) => handleActualizarBloque({ alineacion: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">URL de la Imagen</label>
              <input
                type="text"
                value={bloque.contenido.url || ''}
                onChange={(e) => handleActualizarBloque({ url: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Alt Text</label>
              <input
                type="text"
                value={bloque.contenido.alt || ''}
                onChange={(e) => handleActualizarBloque({ alt: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Descripción de la imagen"
              />
            </div>
          </div>
        )}

        {bloque.tipo === 'testimonial' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Cliente</label>
              <input
                type="text"
                value={bloque.contenido.nombre || ''}
                onChange={(e) => handleActualizarBloque({ nombre: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Testimonio</label>
              <textarea
                value={bloque.contenido.texto || ''}
                onChange={(e) => handleActualizarBloque({ texto: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                rows={4}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



