import { useState } from 'react';
import { X, Calendar, CreditCard, User, FileText, CheckCircle2, XCircle, Clock, Download, Loader2 } from 'lucide-react';
import { Pago, generarReciboPago } from '../api/pagosApi';

interface ModalDetallePagoProps {
  pago: Pago | null;
  isOpen: boolean;
  onClose: () => void;
  onReciboGenerado?: () => void;
}

export default function ModalDetallePago({
  pago,
  isOpen,
  onClose,
  onReciboGenerado,
}: ModalDetallePagoProps) {
  const [generandoRecibo, setGenerandoRecibo] = useState(false);

  if (!isOpen || !pago) return null;

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearMetodoPago = (metodo: Pago['metodo']) => {
    const metodos: Record<string, string> = {
      tarjeta_credito: 'Tarjeta de Crédito',
      tarjeta_debito: 'Tarjeta de Débito',
      efectivo: 'Efectivo',
      transferencia: 'Transferencia',
      financiacion: 'Financiación',
    };
    return metodos[metodo] || metodo;
  };

  const formatearMoneda = (valor: number, moneda: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda || 'EUR',
    }).format(valor);
  };

  const getEstadoIcon = (estado: Pago['estado']) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'fallido':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'pendiente':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'reembolsado':
        return <XCircle className="w-6 h-6 text-orange-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: Pago['estado']) => {
    switch (estado) {
      case 'completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fallido':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reembolsado':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleGenerarRecibo = async () => {
    if (!pago._id) return;

    setGenerandoRecibo(true);
    try {
      const blob = await generarReciboPago(pago._id);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo-pago-${pago._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (onReciboGenerado) {
        onReciboGenerado();
      }
    } catch (error) {
      console.error('Error al generar recibo:', error);
      alert('Error al generar el recibo. Por favor, inténtalo de nuevo.');
    } finally {
      setGenerandoRecibo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Detalle del Pago</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Estado y Monto Principal */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getEstadoIcon(pago.estado)}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Estado del Pago</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(pago.estado)}`}>
                    {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Monto Total</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatearMoneda(pago.monto, pago.moneda)}
                </div>
              </div>
            </div>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Fecha del Pago</span>
              </div>
              <p className="text-gray-900">{formatearFecha(pago.fecha)}</p>
            </div>

            {/* Método de Pago */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Método de Pago</span>
              </div>
              <p className="text-gray-900">{formatearMetodoPago(pago.metodo)}</p>
            </div>

            {/* Paciente */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <User className="w-5 h-5" />
                <span className="font-medium">Paciente</span>
              </div>
              <p className="text-gray-900">
                {pago.paciente.nombre} {pago.paciente.apellidos}
              </p>
              {pago.paciente.documentoIdentidad && (
                <p className="text-sm text-gray-600 mt-1">
                  {pago.paciente.documentoIdentidad}
                </p>
              )}
            </div>

            {/* ID de Transacción */}
            {pago.gatewayTransactionId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">ID de Transacción</span>
                </div>
                <p className="text-sm text-gray-900 font-mono break-all">
                  {pago.gatewayTransactionId}
                </p>
              </div>
            )}
          </div>

          {/* Tratamientos */}
          {pago.tratamientos && pago.tratamientos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tratamientos Asociados</h3>
              <div className="space-y-3">
                {pago.tratamientos.map((tratamiento, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{tratamiento.nombre}</h4>
                        {tratamiento.descripcion && (
                          <p className="text-sm text-gray-600 mt-1">{tratamiento.descripcion}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-600">Precio</div>
                        <div className="font-semibold text-gray-900">
                          {formatearMoneda(tratamiento.precio, pago.moneda)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facturas */}
          {pago.facturas && pago.facturas.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturas Asociadas</h3>
              <div className="space-y-3">
                {pago.facturas.map((factura, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Factura #{factura.numero}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Pagado: {formatearMoneda(factura.montoPagado, pago.moneda)} / {formatearMoneda(factura.montoTotal, pago.moneda)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {pago.notas && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notas</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 italic">{pago.notas}</p>
              </div>
            </div>
          )}

          {/* Información de Auditoría */}
          {(pago.createdAt || pago.creadoPor) && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Información de Auditoría</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {pago.creadoPor && (
                  <p>Creado por: {pago.creadoPor.nombre}</p>
                )}
                {pago.createdAt && (
                  <p>Fecha de creación: {new Date(pago.createdAt).toLocaleString('es-ES')}</p>
                )}
                {pago.updatedAt && (
                  <p>Última actualización: {new Date(pago.updatedAt).toLocaleString('es-ES')}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer con Acciones */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
          {pago._id && (
            <button
              onClick={handleGenerarRecibo}
              disabled={generandoRecibo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {generandoRecibo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Recibo PDF</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

