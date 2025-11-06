import { CheckCircle2, X, AlertCircle, FileText } from 'lucide-react';

interface ModalConfirmacionFirmaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: () => void;
  nombrePaciente?: string;
  numeroPresupuesto?: string;
  total?: number;
  loading?: boolean;
}

export default function ModalConfirmacionFirma({
  isOpen,
  onClose,
  onConfirmar,
  nombrePaciente,
  numeroPresupuesto,
  total,
  loading = false,
}: ModalConfirmacionFirmaProps) {
  if (!isOpen) return null;

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Confirmar Firma</h2>
                <p className="text-gray-600 text-sm">¿Estás seguro de firmar este presupuesto?</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">
                  Al firmar este presupuesto, aceptas los términos y condiciones del tratamiento
                  propuesto.
                </p>
                {nombrePaciente && (
                  <p className="text-sm font-medium text-gray-900">
                    Paciente: <span className="font-normal">{nombrePaciente}</span>
                  </p>
                )}
                {numeroPresupuesto && (
                  <p className="text-sm font-medium text-gray-900">
                    Presupuesto: <span className="font-normal">#{numeroPresupuesto}</span>
                  </p>
                )}
                {total !== undefined && (
                  <p className="text-sm font-medium text-gray-900">
                    Total: <span className="font-normal">{formatearMoneda(total)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Una vez firmado, el presupuesto cambiará su estado a 'Aceptado' y se generará
                automáticamente el documento firmado en formato PDF.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar y Firmar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


