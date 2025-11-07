import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { PlaceholdersDisponibles } from '../api/plantillasApi';

interface SelectorDePlaceholdersProps {
  placeholders: PlaceholdersDisponibles;
  onInsertarPlaceholder: (placeholder: string) => void;
}

export default function SelectorDePlaceholders({
  placeholders,
  onInsertarPlaceholder,
}: SelectorDePlaceholdersProps) {
  const [categoriasAbiertas, setCategoriasAbiertas] = useState<Record<string, boolean>>({
    paciente: true,
    tratamiento: true,
    doctor: true,
    clinica: true,
    cita: true,
  });
  const [placeholderCopiado, setPlaceholderCopiado] = useState<string | null>(null);

  const toggleCategoria = (categoria: string) => {
    setCategoriasAbiertas((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const handleInsertar = (placeholder: string) => {
    onInsertarPlaceholder(placeholder);
    setPlaceholderCopiado(placeholder);
    setTimeout(() => setPlaceholderCopiado(null), 2000);
  };

  const handleCopiar = (placeholder: string) => {
    navigator.clipboard.writeText(placeholder);
    setPlaceholderCopiado(placeholder);
    setTimeout(() => setPlaceholderCopiado(null), 2000);
  };

  const renderCategoria = (
    categoria: string,
    items: Array<{ key: string; desc: string }>,
    label: string
  ) => {
    if (!items || items.length === 0) return null;

    const abierta = categoriasAbiertas[categoria];

    return (
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleCategoria(categoria)}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between"
        >
          <span className="font-semibold text-gray-900">{label}</span>
          {abierta ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {abierta && (
          <div className="p-2 bg-white">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <code className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.key}
                    </code>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => handleInsertar(item.key)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Insertar en editor"
                  >
                    {placeholderCopiado === item.key ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Placeholders Disponibles</h3>
      <p className="text-sm text-gray-600 mb-4">
        Haz clic en el icono de copiar para insertar un placeholder en el editor
      </p>
      <div className="max-h-96 overflow-y-auto">
        {renderCategoria('paciente', placeholders.paciente || [], 'Datos del Paciente')}
        {renderCategoria('tratamiento', placeholders.tratamiento || [], 'Datos del Tratamiento')}
        {renderCategoria('doctor', placeholders.doctor || [], 'Datos del Doctor')}
        {renderCategoria('clinica', placeholders.clinica || [], 'Datos de la Clínica')}
        {renderCategoria('cita', placeholders.cita || [], 'Datos de la Cita')}
      </div>
    </div>
  );
}



