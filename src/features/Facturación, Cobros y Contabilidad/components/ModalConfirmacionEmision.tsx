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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-xl p-2 ring-1 ring-green-200/70">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Factura Emitida Correctamente</h2>
              <p className="text-sm text-gray-600">Número de factura: {factura.numeroFactura}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-xl p-1 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 ring-1 ring-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              La factura se ha creado exitosamente y se ha vinculado al paciente. Los tratamientos
              incluidos han sido marcados como "Facturado".
            </p>
          </div>

          {/* Información de la factura */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Paciente</p>
              <p className="text-sm font-semibold text-gray-900">
                {factura.paciente.nombre} {factura.paciente.apellidos}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Fecha de Emisión</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Total</p>
              <p className="text-lg font-bold text-blue-600">{factura.total.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Estado</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200">
                {factura.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="p-6 border-t border-gray-200/60 bg-slate-50">
          <div className="flex flex-wrap gap-3">
            {onImprimir && (
              <button
                onClick={onImprimir}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Printer size={18} />
                <span>Imprimir PDF</span>
              </button>
            )}
            {onEnviarEmail && (
              <button
                onClick={onEnviarEmail}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm"
              >
                <Mail size={18} />
                <span>Enviar por Email</span>
              </button>
            )}
            {onRegistrarPago && (
              <button
                onClick={onRegistrarPago}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
              >
                <FileText size={18} />
                <span>Registrar Pago</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
            >
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



