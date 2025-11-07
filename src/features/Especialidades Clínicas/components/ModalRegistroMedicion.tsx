import { useState } from 'react';
import { X, Save, Calendar, AlertCircle } from 'lucide-react';
import { MedicionOsteointegracion, registrarMedicion } from '../api/implantesApi';

interface ModalRegistroMedicionProps {
  implanteId: string;
  isOpen: boolean;
  onClose: () => void;
  onMedicionRegistrada: () => void;
}

export default function ModalRegistroMedicion({
  implanteId,
  isOpen,
  onClose,
  onMedicionRegistrada,
}: ModalRegistroMedicionProps) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipoMedicion: 'ISQ' as 'ISQ' | 'Periotest' | 'Clinica',
    valor: '',
    observaciones: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor.trim()) {
      setError('El valor de la medición es requerido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await registrarMedicion(implanteId, {
        fecha: formData.fecha,
        tipoMedicion: formData.tipoMedicion,
        valor: formData.valor,
        observaciones: formData.observaciones || undefined,
      });
      onMedicionRegistrada();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar la medición');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipoMedicion: 'ISQ',
      valor: '',
      observaciones: '',
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Registrar Nueva Medición</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha de Medición
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Medición
              </label>
              <select
                value={formData.tipoMedicion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoMedicion: e.target.value as 'ISQ' | 'Periotest' | 'Clinica',
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                required
              >
                <option value="ISQ">ISQ (Implant Stability Quotient)</option>
                <option value="Periotest">Periotest</option>
                <option value="Clinica">Evaluación Clínica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Valor de la Medición
              </label>
              <input
                type="text"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder={formData.tipoMedicion === 'ISQ' ? 'Ej: 65' : 'Ej: -2'}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones (Opcional)
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
                placeholder="Notas adicionales sobre la medición..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Guardar Medición'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



