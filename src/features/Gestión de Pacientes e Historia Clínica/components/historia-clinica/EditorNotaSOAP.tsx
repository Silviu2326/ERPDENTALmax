import { useState } from 'react';
import { Save, X } from 'lucide-react';

interface EditorNotaSOAPProps {
  onSave: (nota: {
    subjetivo: string;
    objetivo: string;
    analisis: string;
    plan: string;
  }) => void;
  onCancel: () => void;
  notaInicial?: {
    subjetivo?: string;
    objetivo?: string;
    analisis?: string;
    plan?: string;
  };
}

export default function EditorNotaSOAP({ onSave, onCancel, notaInicial }: EditorNotaSOAPProps) {
  const [formData, setFormData] = useState({
    subjetivo: notaInicial?.subjetivo || '',
    objetivo: notaInicial?.objetivo || '',
    analisis: notaInicial?.analisis || '',
    plan: notaInicial?.plan || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subjetivo || formData.objetivo || formData.analisis || formData.plan) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* S - Subjetivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-blue-600 font-bold">S</span> - Subjetivo
          </label>
          <textarea
            value={formData.subjetivo}
            onChange={(e) => setFormData({ ...formData, subjetivo: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Síntomas y quejas del paciente..."
          />
        </div>

        {/* O - Objetivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-green-600 font-bold">O</span> - Objetivo
          </label>
          <textarea
            value={formData.objetivo}
            onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hallazgos clínicos observables..."
          />
        </div>

        {/* A - Análisis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-yellow-600 font-bold">A</span> - Análisis
          </label>
          <textarea
            value={formData.analisis}
            onChange={(e) => setFormData({ ...formData, analisis: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Diagnóstico y evaluación..."
          />
        </div>

        {/* P - Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-purple-600 font-bold">P</span> - Plan
          </label>
          <textarea
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Plan de tratamiento y seguimiento..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar Nota
        </button>
      </div>
    </form>
  );
}



