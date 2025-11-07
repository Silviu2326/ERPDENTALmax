import { useState, useEffect } from 'react';
import { X, Save, Calendar, User, FileText } from 'lucide-react';
import { PlanDeAccion } from '../api/revisionDireccionApi';

interface ModalCrearPlanDeAccionProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (plan: Omit<PlanDeAccion, '_id' | 'createdAt'>) => Promise<void>;
  usuarios?: Array<{ _id: string; name: string }>;
  clinicId: string;
}

export default function ModalCrearPlanDeAccion({
  isOpen,
  onClose,
  onCreate,
  usuarios = [],
  clinicId,
}: ModalCrearPlanDeAccionProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibleUserId: '',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario al abrir
      setFormData({
        title: '',
        description: '',
        responsibleUserId: '',
        dueDate: '',
      });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    if (!formData.responsibleUserId) {
      setError('Debe seleccionar un responsable');
      return;
    }

    if (!formData.dueDate) {
      setError('Debe seleccionar una fecha límite');
      return;
    }

    if (new Date(formData.dueDate) < new Date()) {
      setError('La fecha límite no puede ser anterior a hoy');
      return;
    }

    setLoading(true);
    try {
      await onCreate({
        title: formData.title.trim(),
        description: formData.description.trim(),
        responsibleUserId: formData.responsibleUserId,
        dueDate: new Date(formData.dueDate).toISOString(),
        status: 'Pendiente',
        clinicId,
        createdBy: '', // Se completará en el backend con el usuario actual
        notes: [],
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el plan de acción');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Plan de Acción</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Ej: Reducir tiempo de espera en recepción"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Describe el problema identificado y las acciones a realizar..."
                required
              />
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User size={16} className="inline mr-1" />
                Responsable <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.responsibleUserId}
                onChange={(e) => setFormData({ ...formData, responsibleUserId: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                required
              >
                <option value="">Seleccione un responsable</option>
                {usuarios.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>
                    {usuario.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Límite */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Límite <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 bg-slate-100 hover:bg-slate-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Crear Plan de Acción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



