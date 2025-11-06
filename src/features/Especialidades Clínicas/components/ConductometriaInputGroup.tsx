import { Trash2 } from 'lucide-react';
import { Conductometria } from '../api/planEndodonciaApi';

interface ConductometriaInputGroupProps {
  conducto: Conductometria;
  index: number;
  onActualizar: (datos: Conductometria) => void;
  onEliminar: () => void;
}

export default function ConductometriaInputGroup({
  conducto,
  index,
  onActualizar,
  onEliminar,
}: ConductometriaInputGroupProps) {
  const handleChange = (campo: keyof Conductometria, valor: string | number) => {
    onActualizar({
      ...conducto,
      [campo]: valor,
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">Conducto {index + 1}</h4>
        <button
          onClick={onEliminar}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Eliminar conducto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nombre del Canal
          </label>
          <input
            type="text"
            value={conducto.nombreCanal}
            onChange={(e) => handleChange('nombreCanal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Ej: MV, P, D"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Longitud Tentativa (mm)
          </label>
          <input
            type="number"
            value={conducto.longitudTentativa || ''}
            onChange={(e) => handleChange('longitudTentativa', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Lima Referencia
          </label>
          <input
            type="number"
            value={conducto.limaReferencia || ''}
            onChange={(e) => handleChange('limaReferencia', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Longitud Real Trabajo (mm)
          </label>
          <input
            type="number"
            value={conducto.longitudRealTrabajo || ''}
            onChange={(e) => handleChange('longitudRealTrabajo', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Instrumento Apical Maestro
          </label>
          <input
            type="number"
            value={conducto.instrumentoApicalMaestro || ''}
            onChange={(e) => handleChange('instrumentoApicalMaestro', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}


