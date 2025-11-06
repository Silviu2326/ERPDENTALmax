import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { Postoperatorio, ActualizarIndicacionesRequest } from '../api/postoperatorioApi';

interface FormularioIndicacionesPostoperatoriasProps {
  postoperatorio: Postoperatorio;
  onGuardar: (datos: ActualizarIndicacionesRequest) => Promise<void>;
  loading?: boolean;
}

export default function FormularioIndicacionesPostoperatorias({
  postoperatorio,
  onGuardar,
  loading = false,
}: FormularioIndicacionesPostoperatoriasProps) {
  const [indicaciones, setIndicaciones] = useState(postoperatorio.indicacionesGenerales || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!indicaciones.trim()) {
      setError('Las indicaciones generales son obligatorias');
      return;
    }

    try {
      await onGuardar({
        indicacionesGenerales: indicaciones,
        medicacionPrescrita: postoperatorio.medicacionPrescrita || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar las indicaciones');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Indicaciones Postoperatorias</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Indicaciones Generales */}
        <div>
          <label htmlFor="indicaciones" className="block text-sm font-medium text-gray-700 mb-2">
            Indicaciones Generales *
          </label>
          <textarea
            id="indicaciones"
            value={indicaciones}
            onChange={(e) => setIndicaciones(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Ejemplo: Dieta blanda durante 48 horas. Evitar enjuagues y cepillado en la zona intervenida durante las primeras 24 horas. Aplicar hielo local intermitente durante las primeras 6 horas..."
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Incluya instrucciones sobre dieta, higiene, actividad física y cuidados generales
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !indicaciones.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Indicaciones'}
          </button>
        </div>
      </form>
    </div>
  );
}


