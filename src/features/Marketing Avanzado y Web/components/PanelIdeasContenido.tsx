import { useState } from 'react';
import { Lightbulb, Plus, X } from 'lucide-react';

interface IdeaContenido {
  _id?: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  tags: string[];
}

interface PanelIdeasContenidoProps {
  ideas: IdeaContenido[];
  onAgregarIdea: (idea: Omit<IdeaContenido, '_id'>) => void;
  onEliminarIdea: (id: string) => void;
  onUsarIdea: (idea: IdeaContenido) => void;
}

export default function PanelIdeasContenido({
  ideas,
  onAgregarIdea,
  onEliminarIdea,
  onUsarIdea,
}: PanelIdeasContenidoProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaIdea, setNuevaIdea] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  const categorias = [
    'Educación',
    'Promoción',
    'Testimonial',
    'Consejo',
    'Evento',
    'Tratamiento',
    'Hygiene',
  ];

  const handleAgregarTag = () => {
    if (tagInput.trim() && !nuevaIdea.tags.includes(tagInput.trim())) {
      setNuevaIdea({
        ...nuevaIdea,
        tags: [...nuevaIdea.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleEliminarTag = (tag: string) => {
    setNuevaIdea({
      ...nuevaIdea,
      tags: nuevaIdea.tags.filter((t) => t !== tag),
    });
  };

  const handleGuardarIdea = () => {
    if (nuevaIdea.titulo && nuevaIdea.descripcion && nuevaIdea.categoria) {
      onAgregarIdea(nuevaIdea);
      setNuevaIdea({
        titulo: '',
        descripcion: '',
        categoria: '',
        tags: [],
      });
      setMostrarFormulario(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-xl ring-1 ring-yellow-200/70">
            <Lightbulb size={20} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Ideas de Contenido</h3>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus size={18} />
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-4 p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={nuevaIdea.titulo}
                onChange={(e) => setNuevaIdea({ ...nuevaIdea, titulo: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Ej: Consejos de higiene dental"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción
              </label>
              <textarea
                value={nuevaIdea.descripcion}
                onChange={(e) => setNuevaIdea({ ...nuevaIdea, descripcion: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                rows={3}
                placeholder="Descripción de la idea..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categoría
              </label>
              <select
                value={nuevaIdea.categoria}
                onChange={(e) => setNuevaIdea({ ...nuevaIdea, categoria: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAgregarTag()}
                  className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Agregar tag y presionar Enter"
                />
                <button
                  onClick={handleAgregarTag}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700 shadow-sm"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {nuevaIdea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm ring-1 ring-blue-200"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleEliminarTag(tag)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGuardarIdea}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Guardar Idea
              </button>
              <button
                onClick={() => setMostrarFormulario(false)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {ideas.length === 0 ? (
          <div className="p-8 text-center">
            <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600">
              No hay ideas guardadas. Crea una nueva idea para comenzar.
            </p>
          </div>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea._id}
              className="p-4 bg-white rounded-xl ring-1 ring-gray-200 hover:ring-blue-300 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{idea.titulo}</h4>
                  <p className="text-xs text-gray-600">{idea.descripcion}</p>
                </div>
                <button
                  onClick={() => idea._id && onEliminarIdea(idea._id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full ring-1 ring-blue-200">
                  {idea.categoria}
                </span>
                <button
                  onClick={() => onUsarIdea(idea)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Usar idea →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



