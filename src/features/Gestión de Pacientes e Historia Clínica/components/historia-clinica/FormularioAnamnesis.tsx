import { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { AnamnesisData, actualizarAnamnesis } from '../../api/historiaClinicaApi';

interface FormularioAnamnesisProps {
  pacienteId: string;
  datos: AnamnesisData;
  onUpdate: (datos: AnamnesisData) => void;
}

export default function FormularioAnamnesis({
  pacienteId,
  datos,
  onUpdate,
}: FormularioAnamnesisProps) {
  const [formData, setFormData] = useState<AnamnesisData>(datos);
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const handleSave = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      await actualizarAnamnesis(pacienteId, formData);
      onUpdate(formData);
      setMensaje({ tipo: 'success', texto: 'Anamnesis actualizada correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al guardar la anamnesis',
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleAddAlergia = () => {
    if (nuevaAlergia.trim()) {
      setFormData({
        ...formData,
        alergias: [...(formData.alergias || []), nuevaAlergia.trim()],
      });
      setNuevaAlergia('');
    }
  };

  const handleRemoveAlergia = (index: number) => {
    const nuevasAlergias = [...(formData.alergias || [])];
    nuevasAlergias.splice(index, 1);
    setFormData({
      ...formData,
      alergias: nuevasAlergias,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Anamnesis</h3>
        <button
          onClick={handleSave}
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {guardando ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {mensaje && (
        <div
          className={`px-4 py-3 rounded-lg ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="space-y-6">
        {/* Antecedentes Médicos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Antecedentes Médicos
          </label>
          <textarea
            value={formData.antecedentesMedicos || ''}
            onChange={(e) =>
              setFormData({ ...formData, antecedentesMedicos: e.target.value })
            }
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa los antecedentes médicos del paciente..."
          />
        </div>

        {/* Alergias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alergias</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevaAlergia}
              onChange={(e) => setNuevaAlergia(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAlergia();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Penicilina, Ibuprofeno..."
            />
            <button
              type="button"
              onClick={handleAddAlergia}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          {formData.alergias && formData.alergias.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.alergias.map((alergia, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {alergia}
                  <button
                    type="button"
                    onClick={() => handleRemoveAlergia(index)}
                    className="hover:text-red-900"
                    aria-label="Eliminar alergia"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Medicación Actual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicación Actual
          </label>
          <textarea
            value={formData.medicacionActual || ''}
            onChange={(e) =>
              setFormData({ ...formData, medicacionActual: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa la medicación actual del paciente..."
          />
        </div>
      </div>
    </div>
  );
}



