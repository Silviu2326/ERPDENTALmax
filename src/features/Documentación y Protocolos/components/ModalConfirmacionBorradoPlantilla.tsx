import { AlertTriangle, X } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h2>
            </div>
            <button
              onClick={onCancelar}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              ¿Estás seguro de que deseas eliminar la plantilla <strong>"{plantilla.nombre}"</strong>?
            </p>
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer. Si la plantilla ha sido utilizada para generar
              documentos, estos permanecerán en el historial.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onCancelar}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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


