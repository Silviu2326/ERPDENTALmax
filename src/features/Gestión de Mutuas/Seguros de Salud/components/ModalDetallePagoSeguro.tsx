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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Detalle del Pago</h2>
              <p className="text-gray-600 text-sm">Información completa del pago de seguro</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-blue-600" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Monto Total</label>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatearMoneda(pago.montoTotal)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Estado</label>
                <div className="mt-1">
                  {getEstadoBadge(pago.estado)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar size={16} />
                  Fecha de Pago
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {formatearFecha(pago.fechaPago)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <CreditCard size={16} />
                  Método de Pago
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {getMetodoPagoLabel(pago.metodoPago)}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Referencia</label>
                <p className="text-lg font-mono text-gray-900 mt-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 ring-1 ring-slate-200">
                  {pago.referencia || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Aseguradora */}
          {pago.aseguradora && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                Aseguradora
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nombre Comercial</label>
                  <p className="text-lg font-medium text-gray-900">{pago.aseguradora.nombreComercial}</p>
                </div>
                {pago.aseguradora.razonSocial && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Razón Social</label>
                    <p className="text-lg text-gray-900">{pago.aseguradora.razonSocial}</p>
                  </div>
                )}
                {pago.aseguradora.cif && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">CIF</label>
                    <p className="text-lg font-mono text-gray-900">{pago.aseguradora.cif}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reclamaciones Cubiertas */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope size={20} className="text-blue-600" />
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
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <User size={16} />
                          Paciente
                        </label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                          {reclamacion.reclamacion?.paciente
                            ? `${reclamacion.reclamacion.paciente.nombre} ${reclamacion.reclamacion.paciente.apellidos}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Tratamiento</label>
                        <p className="text-base text-gray-900 mt-1">
                          {reclamacion.reclamacion?.tratamiento?.nombre || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Monto Aplicado</label>
                        <p className="text-base font-semibold text-gray-900 mt-1">
                          {formatearMoneda(reclamacion.montoAplicado)}
                        </p>
                        {reclamacion.reclamacion && (
                          <p className="text-xs text-slate-600 mt-1">
                            Reclamado: {formatearMoneda(reclamacion.reclamacion.montoReclamado)}
                          </p>
                        )}
                      </div>
                    </div>
                    {reclamacion.reclamacion && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <label className="text-sm font-medium text-slate-700">Estado de Reclamación</label>
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
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl flex justify-end">
          <button
            onClick={onCerrar}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



