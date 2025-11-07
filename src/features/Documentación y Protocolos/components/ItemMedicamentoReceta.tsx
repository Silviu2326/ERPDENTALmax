import { X, Pill } from 'lucide-react';
import { MedicamentoReceta } from '../api/recetasApi';

interface ItemMedicamentoRecetaProps {
  medicamento: MedicamentoReceta;
  indice: number;
  onEliminar: (indice: number) => void;
  onEditar?: (indice: number) => void;
  editable?: boolean;
}

export default function ItemMedicamentoReceta({
  medicamento,
  indice,
  onEliminar,
  onEditar,
  editable = true,
}: ItemMedicamentoRecetaProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ring-1 ring-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Pill size={20} className="text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">{medicamento.nombre}</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Dosis</p>
              <p className="text-sm font-medium text-gray-900">{medicamento.dosis}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Frecuencia</p>
              <p className="text-sm font-medium text-gray-900">{medicamento.frecuencia}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Duración</p>
              <p className="text-sm font-medium text-gray-900">{medicamento.duracion}</p>
            </div>
          </div>

          {medicamento.indicaciones_especificas && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Indicaciones Específicas</p>
              <p className="text-sm text-gray-700">{medicamento.indicaciones_especificas}</p>
            </div>
          )}
        </div>

        {editable && (
          <div className="flex items-center gap-2 ml-4">
            {onEditar && (
              <button
                onClick={() => onEditar(indice)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar medicamento"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onEliminar(indice)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar medicamento"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



