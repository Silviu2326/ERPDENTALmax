import { useState } from 'react';
import { X, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import FormularioPagoTarjeta from './FormularioPagoTarjeta';

interface Tratamiento {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  saldoPendiente: number;
}

interface ModalPagoRapidoTratamientoProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: string;
  pacienteNombre?: string;
  tratamiento: Tratamiento;
  onPagoExitoso: () => void;
}

export default function ModalPagoRapidoTratamiento({
  isOpen,
  onClose,
  pacienteId,
  pacienteNombre,
  tratamiento,
  onPagoExitoso,
}: ModalPagoRapidoTratamientoProps) {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePagoExitoso = (pagoId: string) => {
    setError(null);
    onPagoExitoso();
    onClose();
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pago Rápido de Tratamiento</h2>
              {pacienteNombre && (
                <p className="text-sm text-gray-600 mt-0.5">Paciente: {pacienteNombre}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Resumen del tratamiento */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{tratamiento.nombre}</h3>
            {tratamiento.descripcion && (
              <p className="text-sm text-gray-600 mb-3">{tratamiento.descripcion}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monto a pagar:</span>
              <span className="text-lg font-bold text-blue-900">
                €{tratamiento.saldoPendiente.toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Formulario de pago */}
          <FormularioPagoTarjeta
            monto={tratamiento.saldoPendiente}
            moneda="EUR"
            pacienteId={pacienteId}
            onPagoExitoso={handlePagoExitoso}
            onError={handleError}
            onCancelar={onClose}
          />
        </div>
      </div>
    </div>
  );
}


