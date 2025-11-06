import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Campana, NuevaCampana, crearCampana, actualizarCampana } from '../api/campanasApi';

interface ModalCrearEditarCampanaProps {
  campana?: Campana | null;
  isOpen: boolean;
  onClose: () => void;
  onGuardado: () => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
}

const canales = [
  'Redes Sociales',
  'Google Ads',
  'Facebook Ads',
  'Instagram Ads',
  'Email Marketing',
  'SMS Marketing',
  'Flyers',
  'Eventos Locales',
  'Referidos',
  'Otro',
];

export default function ModalCrearEditarCampana({
  campana,
  isOpen,
  onClose,
  onGuardado,
  clinicas = [],
}: ModalCrearEditarCampanaProps) {
  const [formData, setFormData] = useState<NuevaCampana>({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
    canal: '',
    clinicaId: clinicas[0]?._id || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (campana) {
      setFormData({
        nombre: campana.nombre,
        descripcion: campana.descripcion || '',
        fechaInicio: campana.fechaInicio.split('T')[0],
        fechaFin: campana.fechaFin.split('T')[0],
        presupuesto: campana.presupuesto,
        canal: campana.canal,
        clinicaId: campana.clinicaId,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        presupuesto: 0,
        canal: '',
        clinicaId: clinicas[0]?._id || '',
      });
    }
    setError(null);
  }, [campana, isOpen, clinicas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'presupuesto' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (campana?._id) {
        await actualizarCampana(campana._id, formData);
      } else {
        await crearCampana(formData);
      }
      onGuardado();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la campaña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {campana ? 'Editar Campaña' : 'Nueva Campaña'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Campaña *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Campaña Verano 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción de la campaña..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio *
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin *
              </label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto (€) *
              </label>
              <input
                type="number"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal *
              </label>
              <select
                name="canal"
                value={formData.canal}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar canal</option>
                {canales.map((canal) => (
                  <option key={canal} value={canal}>
                    {canal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {clinicas.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clínica *
              </label>
              <select
                name="clinicaId"
                value={formData.clinicaId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {clinicas.map((clinica) => (
                  <option key={clinica._id} value={clinica._id}>
                    {clinica.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : campana ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


