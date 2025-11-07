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
      <div className="bg-white shadow-sm p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Análisis de Causa Raíz</h2>
          {!readonly && (
            <button
              onClick={() => setEditando(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all"
            >
              <Edit size={18} />
              Editar
            </button>
          )}
        </div>
        {valor ? (
          <div className="bg-slate-50 rounded-xl ring-1 ring-slate-200 p-4">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{valor}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No hay análisis de causa raíz registrado</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm p-6 rounded-xl">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Análisis de Causa Raíz</h2>
      <textarea
        value={analisis}
        onChange={(e) => setAnalisis(e.target.value)}
        rows={8}
        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 mb-4"
        placeholder="Realiza un análisis detallado de las causas raíz que originaron la incidencia. Considera factores como procesos, personas, materiales, métodos, medio ambiente..."
      />
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleCancelar}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {loading ? 'Guardando...' : 'Guardar Análisis'}
        </button>
      </div>
    </div>
  );
}



