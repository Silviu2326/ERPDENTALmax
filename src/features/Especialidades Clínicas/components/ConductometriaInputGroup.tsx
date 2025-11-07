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
    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Conducto {index + 1}</h4>
        <button
          onClick={onEliminar}
          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
          aria-label="Eliminar conducto"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nombre del Canal
          </label>
          <input
            type="text"
            value={conducto.nombreCanal}
            onChange={(e) => handleChange('nombreCanal', e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-3 py-2 text-sm"
            placeholder="Ej: MV, P, D"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Longitud Tentativa (mm)
          </label>
          <input
            type="number"
            value={conducto.longitudTentativa || ''}
            onChange={(e) => handleChange('longitudTentativa', parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-3 py-2 text-sm"
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Lima Referencia
          </label>
          <input
            type="number"
            value={conducto.limaReferencia || ''}
            onChange={(e) => handleChange('limaReferencia', parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-3 py-2 text-sm"
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Longitud Real Trabajo (mm)
          </label>
          <input
            type="number"
            value={conducto.longitudRealTrabajo || ''}
            onChange={(e) => handleChange('longitudRealTrabajo', parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-3 py-2 text-sm"
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Instrumento Apical Maestro
          </label>
          <input
            type="number"
            value={conducto.instrumentoApicalMaestro || ''}
            onChange={(e) => handleChange('instrumentoApicalMaestro', parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-3 py-2 text-sm"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}



