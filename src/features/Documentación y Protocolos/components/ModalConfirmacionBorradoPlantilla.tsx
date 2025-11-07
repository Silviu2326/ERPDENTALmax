import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { DocumentoPlantilla } from '../api/plantillasApi';

interface ModalConfirmacionBorradoPlantillaProps {
  plantilla: DocumentoPlantilla | null;
  onConfirmar: () => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function ModalConfirmacionBorradoPlantilla({
  plantilla,
  onConfirmar,
  onCancelar,
  loading = false,
}: ModalConfirmacionBorradoPlantillaProps) {
  if (!plantilla) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full ring-1 ring-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl ring-1 ring-red-200/70">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h2>
            </div>
            <button
              onClick={onCancelar}
              disabled={loading}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 space-y-3">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar la plantilla <strong className="font-semibold text-gray-900">"{plantilla.nombre}"</strong>?
            </p>
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer. Si la plantilla ha sido utilizada para generar
              documentos, estos permanecerán en el historial.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancelar}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <span>Eliminar</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



