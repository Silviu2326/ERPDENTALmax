import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ModalConfirmacionTransferenciaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: () => void;
  pacienteNombre: string;
  sedeOrigen: string;
  sedeDestino: string;
  isLoading?: boolean;
}

export default function ModalConfirmacionTransferencia({
  isOpen,
  onClose,
  onConfirmar,
  pacienteNombre,
  sedeOrigen,
  sedeDestino,
  isLoading = false,
}: ModalConfirmacionTransferenciaProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmar Transferencia
            </h3>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            ¿Está seguro de que desea transferir al paciente{' '}
            <strong className="text-gray-900">{pacienteNombre}</strong> de{' '}
            <strong className="text-gray-900">{sedeOrigen}</strong> a{' '}
            <strong className="text-blue-600">{sedeDestino}</strong>?
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Esta acción no se puede deshacer</p>
                <p>
                  Se transferirá todo el historial clínico y financiero del paciente a la nueva sede.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Confirmar Transferencia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


