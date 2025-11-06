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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Plan de Acción</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Reducir tiempo de espera en recepción"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe el problema identificado y las acciones a realizar..."
                required
              />
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Responsable <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.responsibleUserId}
                onChange={(e) => setFormData({ ...formData, responsibleUserId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Límite <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Crear Plan de Acción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


