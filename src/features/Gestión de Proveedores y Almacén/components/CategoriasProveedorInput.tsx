import { Tag, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface CategoriasProveedorInputProps {
  categorias: string[];
  onChange: (categorias: string[]) => void;
}

const categoriasComunes = [
  'Implantes',
  'Consumibles de Ortodoncia',
  'Equipamiento de Rayos X',
  'Material de Endodoncia',
  'Material de Ortodoncia',
  'Prótesis',
  'Materiales Estéticos',
  'Anestesia',
  'Equipamiento',
  'Servicios de Laboratorio',
  'Consumibles',
  'Otros',
];

export default function CategoriasProveedorInput({
  categorias,
  onChange,
}: CategoriasProveedorInputProps) {
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarInput, setMostrarInput] = useState(false);

  const toggleCategoria = (categoria: string) => {
    if (categorias.includes(categoria)) {
      onChange(categorias.filter((c) => c !== categoria));
    } else {
      onChange([...categorias, categoria]);
    }
  };

  const handleAgregarCategoriaPersonalizada = () => {
    if (nuevaCategoria.trim() && !categorias.includes(nuevaCategoria.trim())) {
      onChange([...categorias, nuevaCategoria.trim()]);
      setNuevaCategoria('');
      setMostrarInput(false);
    }
  };

  const handleEliminarCategoria = (categoria: string) => {
    onChange(categorias.filter((c) => c !== categoria));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Categorías de Productos
      </h3>
      <div className="space-y-4">
        {/* Categorías comunes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona las categorías:
          </label>
          <div className="flex flex-wrap gap-2">
            {categoriasComunes.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategoria(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  categorias.includes(cat)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
                {categorias.includes(cat) && (
                  <X className="w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Categorías personalizadas */}
        {categorias.filter((c) => !categoriasComunes.includes(c)).length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías personalizadas:
            </label>
            <div className="flex flex-wrap gap-2">
              {categorias
                .filter((c) => !categoriasComunes.includes(c))
                .map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 flex items-center gap-2"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => handleEliminarCategoria(cat)}
                      className="hover:text-indigo-600"
                      aria-label={`Eliminar categoría ${cat}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Agregar categoría personalizada */}
        <div className="pt-3 border-t border-gray-200">
          {!mostrarInput ? (
            <button
              type="button"
              onClick={() => setMostrarInput(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar categoría personalizada
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAgregarCategoriaPersonalizada();
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Escribe una nueva categoría"
              />
              <button
                type="button"
                onClick={handleAgregarCategoriaPersonalizada}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarInput(false);
                  setNuevaCategoria('');
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



