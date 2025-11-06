import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ModalConfirmarAprobacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: () => void;
  presupuestoNumero: string;
  total: number;
  planPagoNombre?: string;
  isLoading?: boolean;
}

export default function ModalConfirmarAprobacion({
  isOpen,
  onClose,
  onConfirmar,
  presupuestoNumero,
  total,
  planPagoNombre,
  isLoading = false,
}: ModalConfirmarAprobacionProps) {
  if (!isOpen) return null;

  const formatMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Confirmar Aprobación</h3>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              ¿Está seguro de que desea aprobar este presupuesto? Esta acción no se puede deshacer.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Presupuesto:</span>
                <span className="font-semibold text-gray-800">#{presupuestoNumero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-blue-600">{formatMoneda(total)}</span>
              </div>
              {planPagoNombre && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan de Pago:</span>
                  <span className="font-semibold text-gray-800">{planPagoNombre}</span>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Al confirmar, el presupuesto cambiará a estado <strong>"Aprobado"</strong> y se registrará la firma del paciente.
                Los tratamientos incluidos podrán ser agendados en el módulo de citas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmar Aprobación</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


