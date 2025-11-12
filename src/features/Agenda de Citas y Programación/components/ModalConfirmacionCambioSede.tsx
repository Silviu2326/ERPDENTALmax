import { X, AlertCircle, MapPin } from 'lucide-react';

interface ModalConfirmacionCambioSedeProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sedeOrigen: string;
  sedeDestino: string;
  pacienteNombre: string;
  loading?: boolean;
}

export default function ModalConfirmacionCambioSede({
  isOpen,
  onClose,
  onConfirm,
  sedeOrigen,
  sedeDestino,
  pacienteNombre,
  loading = false,
}: ModalConfirmacionCambioSedeProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-100">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmar Cambio de Sede</h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 space-y-4">
            <p className="text-gray-600">
              La cita de <span className="font-semibold text-gray-900">{pacienteNombre}</span> será movida a una sede diferente.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sede actual:</span>
                <span className="font-semibold text-gray-900">{sedeOrigen}</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-px bg-gray-300 w-full"></div>
                <AlertCircle className="w-4 h-4 text-orange-500 mx-2" />
                <div className="h-px bg-gray-300 w-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nueva sede:</span>
                <span className="font-semibold text-orange-600">{sedeDestino}</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                <strong>Nota:</strong> Este cambio puede requerir notificar al paciente sobre el cambio de ubicación.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                'Confirmar Cambio'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

