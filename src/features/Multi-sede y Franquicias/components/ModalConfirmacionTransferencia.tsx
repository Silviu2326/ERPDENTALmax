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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-xl ring-1 ring-yellow-200/70">
              <AlertTriangle size={20} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmar Transferencia
            </h3>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-slate-700 mb-4">
            ¿Está seguro de que desea transferir al paciente{' '}
            <strong className="text-gray-900">{pacienteNombre}</strong> de{' '}
            <strong className="text-gray-900">{sedeOrigen}</strong> a{' '}
            <strong className="text-blue-600">{sedeDestino}</strong>?
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 ring-1 ring-yellow-200/70">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
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
        <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Confirmar Transferencia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



