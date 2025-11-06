import { X, CheckCircle, FileText, Mail, Printer } from 'lucide-react';
import { Factura } from '../api/facturacionApi';

interface ModalConfirmacionEmisionProps {
  factura: Factura | null;
  onClose: () => void;
  onImprimir?: () => void;
  onEnviarEmail?: () => void;
  onRegistrarPago?: () => void;
}

export default function ModalConfirmacionEmision({
  factura,
  onClose,
  onImprimir,
  onEnviarEmail,
  onRegistrarPago,
}: ModalConfirmacionEmisionProps) {
  if (!factura) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Factura Emitida Correctamente</h2>
              <p className="text-sm text-gray-600">Número de factura: {factura.numeroFactura}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              La factura se ha creado exitosamente y se ha vinculado al paciente. Los tratamientos
              incluidos han sido marcados como "Facturado".
            </p>
          </div>

          {/* Información de la factura */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Paciente</p>
              <p className="text-sm font-semibold text-gray-900">
                {factura.paciente.nombre} {factura.paciente.apellidos}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Fecha de Emisión</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Total</p>
              <p className="text-lg font-bold text-blue-600">{factura.total.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Estado</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {factura.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-3">
            {onImprimir && (
              <button
                onClick={onImprimir}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir PDF</span>
              </button>
            )}
            {onEnviarEmail && (
              <button
                onClick={onEnviarEmail}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Enviar por Email</span>
              </button>
            )}
            {onRegistrarPago && (
              <button
                onClick={onRegistrarPago}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Registrar Pago</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


