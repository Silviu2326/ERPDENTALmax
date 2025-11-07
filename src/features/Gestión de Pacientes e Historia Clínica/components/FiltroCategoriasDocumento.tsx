import { CategoriaDocumento } from '../api/documentosApi';

interface FiltroCategoriasDocumentoProps {
  categoriaSeleccionada?: CategoriaDocumento | 'Todas';
  onCategoriaChange: (categoria: CategoriaDocumento | 'Todas') => void;
}

const CATEGORIAS: CategoriaDocumento[] = [
  'Radiografía',
  'Consentimiento',
  'Administrativo',
  'Informe Externo',
  'Fotografía',
  'Otro',
];

export default function FiltroCategoriasDocumento({
  categoriaSeleccionada = 'Todas',
  onCategoriaChange,
}: FiltroCategoriasDocumentoProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoriaChange('Todas')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          categoriaSeleccionada === 'Todas'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Todas
      </button>
      {CATEGORIAS.map((categoria) => (
        <button
          key={categoria}
          onClick={() => onCategoriaChange(categoria)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            categoriaSeleccionada === categoria
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
}



