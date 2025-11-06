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
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Ideas de Contenido</h3>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={nuevaIdea.titulo}
                onChange={(e) => setNuevaIdea({ ...nuevaIdea, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Consejos de higiene dental"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={nuevaIdea.descripcion}
                onChange={(e) => setNuevaIdea({ ...nuevaIdea, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Descripción de la idea..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={nuevaIdea.categoria}
                onChange={(e) => setNuevaIdea({ ...nuevaIdea, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAgregarTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agregar tag y presionar Enter"
                />
                <button
                  onClick={handleAgregarTag}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {nuevaIdea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleEliminarTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleGuardarIdea}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar Idea
              </button>
              <button
                onClick={() => setMostrarFormulario(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {ideas.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay ideas guardadas. Crea una nueva idea para comenzar.
          </p>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea._id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900">{idea.titulo}</h4>
                  <p className="text-xs text-gray-600 mt-1">{idea.descripcion}</p>
                </div>
                <button
                  onClick={() => idea._id && onEliminarIdea(idea._id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {idea.categoria}
                </span>
                <button
                  onClick={() => onUsarIdea(idea)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
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


