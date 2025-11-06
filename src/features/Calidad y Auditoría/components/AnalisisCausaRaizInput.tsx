import { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';

interface AnalisisCausaRaizInputProps {
  valor: string;
  onGuardar: (analisis: string) => void;
  readonly?: boolean;
  loading?: boolean;
}

export default function AnalisisCausaRaizInput({
  valor,
  onGuardar,
  readonly = false,
  loading = false,
}: AnalisisCausaRaizInputProps) {
  const [editando, setEditando] = useState(false);
  const [analisis, setAnalisis] = useState(valor);

  const handleGuardar = () => {
    onGuardar(analisis);
    setEditando(false);
  };

  const handleCancelar = () => {
    setAnalisis(valor);
    setEditando(false);
  };

  if (readonly || !editando) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Análisis de Causa Raíz</h3>
          {!readonly && (
            <button
              onClick={() => setEditando(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar análisis"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
        {valor ? (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{valor}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay análisis de causa raíz registrado</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Causa Raíz</h3>
      <textarea
        value={analisis}
        onChange={(e) => setAnalisis(e.target.value)}
        rows={8}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
        placeholder="Realiza un análisis detallado de las causas raíz que originaron la incidencia. Considera factores como procesos, personas, materiales, métodos, medio ambiente..."
      />
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleCancelar}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : 'Guardar Análisis'}
        </button>
      </div>
    </div>
  );
}


