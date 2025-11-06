import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { HistoriaMedica } from '../api/pacientesApi';

interface SeccionAnamnesisProps {
  datos: HistoriaMedica;
  onChange: (datos: HistoriaMedica) => void;
}

export default function SeccionAnamnesis({
  datos,
  onChange,
}: SeccionAnamnesisProps) {
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const [nuevaEnfermedad, setNuevaEnfermedad] = useState('');
  const [nuevaMedicacion, setNuevaMedicacion] = useState('');

  const handleAddAlergia = () => {
    if (nuevaAlergia.trim()) {
      onChange({
        ...datos,
        alergias: [...(datos.alergias || []), nuevaAlergia.trim()],
      });
      setNuevaAlergia('');
    }
  };

  const handleRemoveAlergia = (index: number) => {
    const nuevasAlergias = [...(datos.alergias || [])];
    nuevasAlergias.splice(index, 1);
    onChange({
      ...datos,
      alergias: nuevasAlergias,
    });
  };

  const handleAddEnfermedad = () => {
    if (nuevaEnfermedad.trim()) {
      onChange({
        ...datos,
        enfermedadesCronicas: [...(datos.enfermedadesCronicas || []), nuevaEnfermedad.trim()],
      });
      setNuevaEnfermedad('');
    }
  };

  const handleRemoveEnfermedad = (index: number) => {
    const nuevasEnfermedades = [...(datos.enfermedadesCronicas || [])];
    nuevasEnfermedades.splice(index, 1);
    onChange({
      ...datos,
      enfermedadesCronicas: nuevasEnfermedades,
    });
  };

  const handleAddMedicacion = () => {
    if (nuevaMedicacion.trim()) {
      onChange({
        ...datos,
        medicacionActual: [...(datos.medicacionActual || []), nuevaMedicacion.trim()],
      });
      setNuevaMedicacion('');
    }
  };

  const handleRemoveMedicacion = (index: number) => {
    const nuevaMedicacion = [...(datos.medicacionActual || [])];
    nuevaMedicacion.splice(index, 1);
    onChange({
      ...datos,
      medicacionActual: nuevaMedicacion,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        Historia Médica (Anamnesis)
      </h3>

      <div className="space-y-6">
        {/* Alergias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alergias
          </label>
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
          {datos.alergias && datos.alergias.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {datos.alergias.map((alergia, index) => (
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

        {/* Enfermedades Crónicas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enfermedades Crónicas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevaEnfermedad}
              onChange={(e) => setNuevaEnfermedad(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEnfermedad();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Diabetes, Hipertensión..."
            />
            <button
              type="button"
              onClick={handleAddEnfermedad}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          {datos.enfermedadesCronicas && datos.enfermedadesCronicas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {datos.enfermedadesCronicas.map((enfermedad, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {enfermedad}
                  <button
                    type="button"
                    onClick={() => handleRemoveEnfermedad(index)}
                    className="hover:text-orange-900"
                    aria-label="Eliminar enfermedad"
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
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevaMedicacion}
              onChange={(e) => setNuevaMedicacion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMedicacion();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Aspirina 100mg, Metformina..."
            />
            <button
              type="button"
              onClick={handleAddMedicacion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          {datos.medicacionActual && datos.medicacionActual.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {datos.medicacionActual.map((medicacion, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {medicacion}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicacion(index)}
                    className="hover:text-blue-900"
                    aria-label="Eliminar medicación"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Adicionales
          </label>
          <textarea
            value={datos.notas || ''}
            onChange={(e) => onChange({ ...datos, notas: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Información médica adicional relevante..."
          />
        </div>
      </div>
    </div>
  );
}


