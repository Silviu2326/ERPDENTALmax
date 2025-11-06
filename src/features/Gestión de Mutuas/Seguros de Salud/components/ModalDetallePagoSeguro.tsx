import { X, Calendar, Building2, DollarSign, CreditCard, FileText, User, Stethoscope } from 'lucide-react';
import { PagoSeguro } from '../api/pagosSeguroApi';

interface ModalDetallePagoSeguroProps {
  pago: PagoSeguro | null;
  onCerrar: () => void;
}

export default function ModalDetallePagoSeguro({
  pago,
  onCerrar,
}: ModalDetallePagoSeguroProps) {
  if (!pago) return null;

  const formatearFecha = (fecha: string | Date) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(monto);
  };

  const getMetodoPagoLabel = (metodo: string) => {
    switch (metodo) {
      case 'transferencia':
        return 'Transferencia Bancaria';
      case 'cheque':
        return 'Cheque';
      case 'otro':
        return 'Otro';
      default:
        return metodo;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'conciliado':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Conciliado
          </span>
        );
      case 'parcial':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Parcial
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Pendiente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Detalle del Pago</h2>
              <p className="text-blue-100 text-sm">Información completa del pago de seguro</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Monto Total</label>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatearMoneda(pago.montoTotal)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <div className="mt-1">
                  {getEstadoBadge(pago.estado)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Pago
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {formatearFecha(pago.fechaPago)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Método de Pago
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {getMetodoPagoLabel(pago.metodoPago)}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Referencia</label>
                <p className="text-lg font-mono text-gray-900 mt-1 bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {pago.referencia || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Aseguradora */}
          {pago.aseguradora && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Aseguradora
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre Comercial</label>
                  <p className="text-lg font-medium text-gray-900">{pago.aseguradora.nombreComercial}</p>
                </div>
                {pago.aseguradora.razonSocial && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Razón Social</label>
                    <p className="text-lg text-gray-900">{pago.aseguradora.razonSocial}</p>
                  </div>
                )}
                {pago.aseguradora.cif && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">CIF</label>
                    <p className="text-lg font-mono text-gray-900">{pago.aseguradora.cif}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reclamaciones Cubiertas */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Reclamaciones Cubiertas ({pago.reclamacionesCubiertas?.length || 0})
            </h3>
            {pago.reclamacionesCubiertas && pago.reclamacionesCubiertas.length > 0 ? (
              <div className="space-y-3">
                {pago.reclamacionesCubiertas.map((reclamacion, index) => (
                  <div
                    key={reclamacion.idReclamacion || index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Paciente
                        </label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                          {reclamacion.reclamacion?.paciente
                            ? `${reclamacion.reclamacion.paciente.nombre} ${reclamacion.reclamacion.paciente.apellidos}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tratamiento</label>
                        <p className="text-base text-gray-900 mt-1">
                          {reclamacion.reclamacion?.tratamiento?.nombre || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Monto Aplicado</label>
                        <p className="text-base font-semibold text-gray-900 mt-1">
                          {formatearMoneda(reclamacion.montoAplicado)}
                        </p>
                        {reclamacion.reclamacion && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reclamado: {formatearMoneda(reclamacion.reclamacion.montoReclamado)}
                          </p>
                        )}
                      </div>
                    </div>
                    {reclamacion.reclamacion && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <label className="text-sm font-medium text-gray-500">Estado de Reclamación</label>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {reclamacion.reclamacion.estado}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Total Aplicado:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatearMoneda(
                        pago.reclamacionesCubiertas.reduce(
                          (sum, r) => sum + r.montoAplicado,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay reclamaciones asociadas a este pago</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl flex justify-end">
          <button
            onClick={onCerrar}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


