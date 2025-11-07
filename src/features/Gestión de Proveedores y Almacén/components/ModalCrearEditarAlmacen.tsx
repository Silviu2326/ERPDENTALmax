import { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { Almacen, NuevoAlmacen, ActualizarAlmacen, Direccion } from '../api/almacenesApi';

interface ModalCrearEditarAlmacenProps {
  almacen?: Almacen;
  isOpen: boolean;
  onClose: () => void;
  onSave: (almacen: NuevoAlmacen | ActualizarAlmacen) => Promise<void>;
  clinicas?: Array<{ _id: string; nombre: string }>;
  responsables?: Array<{ _id: string; nombre: string; apellidos?: string }>;
}

export default function ModalCrearEditarAlmacen({
  almacen,
  isOpen,
  onClose,
  onSave,
  clinicas = [],
  responsables = [],
}: ModalCrearEditarAlmacenProps) {
  const [formData, setFormData] = useState<NuevoAlmacen>({
    nombre: '',
    direccion: {
      calle: '',
      ciudad: '',
      codigoPostal: '',
    },
    esPrincipal: false,
    responsableId: '',
    clinicaAsociadaId: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (almacen) {
      setFormData({
        nombre: almacen.nombre,
        direccion: almacen.direccion,
        esPrincipal: almacen.esPrincipal,
        responsableId: almacen.responsable?._id || '',
        clinicaAsociadaId: almacen.clinicaAsociada?._id || '',
      });
    } else {
      setFormData({
        nombre: '',
        direccion: {
          calle: '',
          ciudad: '',
          codigoPostal: '',
        },
        esPrincipal: false,
        responsableId: '',
        clinicaAsociadaId: '',
      });
    }
    setErrors({});
  }, [almacen, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.direccion.calle.trim()) {
      newErrors.calle = 'La calle es obligatoria';
    }

    if (!formData.direccion.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es obligatoria';
    }

    if (!formData.direccion.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      console.error('Error al guardar almacén:', error);
      setErrors({ submit: error.message || 'Error al guardar el almacén' });
    } finally {
      setLoading(false);
    }
  };

  const handleDireccionChange = (field: keyof Direccion, value: string) => {
    setFormData((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        [field]: value,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-bold">
              {almacen ? 'Editar Almacén' : 'Nuevo Almacén'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Información General */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-slate-200 pb-2">
              Información General
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del Almacén <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                  if (errors.nombre) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.nombre;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                  errors.nombre ? 'ring-red-300' : 'ring-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5`}
                placeholder="Ej: Almacén Principal - Clínica Centro"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="esPrincipal"
                checked={formData.esPrincipal}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, esPrincipal: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="esPrincipal" className="text-sm font-medium text-slate-700">
                Marcar como almacén principal
              </label>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-slate-200 pb-2">
              Dirección
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Calle y Número <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.direccion.calle}
                onChange={(e) => handleDireccionChange('calle', e.target.value)}
                className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                  errors.calle ? 'ring-red-300' : 'ring-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5`}
                placeholder="Ej: Av. Principal 123"
              />
              {errors.calle && (
                <p className="mt-1 text-sm text-red-600">{errors.calle}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.direccion.ciudad}
                  onChange={(e) => handleDireccionChange('ciudad', e.target.value)}
                  className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                    errors.ciudad ? 'ring-red-300' : 'ring-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5`}
                  placeholder="Ej: Madrid"
                />
                {errors.ciudad && (
                  <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código Postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.direccion.codigoPostal}
                  onChange={(e) => handleDireccionChange('codigoPostal', e.target.value)}
                  className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                    errors.codigoPostal ? 'ring-red-300' : 'ring-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5`}
                  placeholder="Ej: 28001"
                />
                {errors.codigoPostal && (
                  <p className="mt-1 text-sm text-red-600">{errors.codigoPostal}</p>
                )}
              </div>
            </div>
          </div>

          {/* Asociaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-slate-200 pb-2">
              Asociaciones
            </h3>

            {clinicas.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Clínica Asociada
                </label>
                <select
                  value={formData.clinicaAsociadaId || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, clinicaAsociadaId: e.target.value }))
                  }
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="">Seleccionar clínica (opcional)</option>
                  {clinicas.map((clinica) => (
                    <option key={clinica._id} value={clinica._id}>
                      {clinica.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {responsables.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Responsable
                </label>
                <select
                  value={formData.responsableId || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, responsableId: e.target.value }))
                  }
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="">Seleccionar responsable (opcional)</option>
                  {responsables.map((responsable) => (
                    <option key={responsable._id} value={responsable._id}>
                      {responsable.nombre} {responsable.apellidos || ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : almacen ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



