import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Loader2, Eye, Calendar } from 'lucide-react';
import { obtenerPagosPorPaciente, obtenerPagoPorId, Pago } from '../api/pagosApi';
import FormularioPagoTarjeta from '../components/FormularioPagoTarjeta';
import HistorialPagosList from '../components/HistorialPagosList';

interface PortalPacientePagosPageProps {
  pacienteId: string; // El paciente actualmente autenticado en el portal
  pacienteNombre?: string;
}

export default function PortalPacientePagosPage({
  pacienteId,
  pacienteNombre,
}: PortalPacientePagosPageProps) {
  const [facturasPendientes, setFacturasPendientes] = useState<any[]>([]);
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<string[]>([]);
  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagoDetalle, setPagoDetalle] = useState<Pago | null>(null);
  const [mostrarDetallePago, setMostrarDetallePago] = useState(false);

  useEffect(() => {
    cargarFacturasPendientes();
    cargarHistorialPagos();
  }, [pacienteId]);

  const cargarFacturasPendientes = async () => {
    setLoading(true);
    try {
      // TODO: Implementar API para obtener facturas pendientes del paciente
      // Por ahora simulamos datos
      setFacturasPendientes([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar facturas pendientes');
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorialPagos = async () => {
    // Se carga automáticamente en HistorialPagosList
  };

  const handleFacturaToggle = (facturaId: string) => {
    setFacturasSeleccionadas((prev) =>
      prev.includes(facturaId)
        ? prev.filter((id) => id !== facturaId)
        : [...prev, facturaId]
    );
  };

  const handlePagoExitoso = (pagoId: string) => {
    setMostrarFormularioPago(false);
    setFacturasSeleccionadas([]);
    setPagoExitoso(true);
    cargarFacturasPendientes();
    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => setPagoExitoso(false), 5000);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const getTotalSeleccionado = (): number => {
    // TODO: Calcular total basado en facturas seleccionadas
    return 0;
  };

  const handleVerDetallePago = async (pago: Pago) => {
    try {
      if (pago._id) {
        const detalle = await obtenerPagoPorId(pago._id);
        setPagoDetalle(detalle);
        setMostrarDetallePago(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle del pago');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <CreditCard size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Facturación y Pagos
                </h1>
                <p className="text-gray-600">
                  {pacienteNombre ? `Bienvenido, ${pacienteNombre}` : 'Gestiona tus facturas y pagos'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Mensaje de éxito */}
          {pagoExitoso && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 font-medium">
                ¡Pago procesado exitosamente! Tu factura ha sido actualizada.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Facturas Pendientes */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Facturas Pendientes</h2>
              <p className="text-sm text-gray-600 mt-1">
                Selecciona una o más facturas para realizar el pago
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando facturas...</p>
              </div>
            ) : facturasPendientes.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {facturasPendientes.map((factura) => (
                  <div
                    key={factura._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={facturasSeleccionadas.includes(factura._id)}
                        onChange={() => handleFacturaToggle(factura._id)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Factura #{factura.numero}</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Fecha: {new Date(factura.fecha).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-2">
                          Monto pendiente: €{factura.montoPendiente?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay facturas pendientes</h3>
                <p className="text-gray-600 mb-4">
                  Todas tus facturas están al día
                </p>
              </div>
            )}

            {/* Botón de pago */}
            {facturasSeleccionadas.length > 0 && !mostrarFormularioPago && (
              <div className="p-4 border-t border-gray-100 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total a pagar:</p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{getTotalSeleccionado().toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => setMostrarFormularioPago(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
                  >
                    <CreditCard size={20} />
                    <span>Pagar con Tarjeta</span>
                  </button>
                </div>
              </div>
            )}

            {/* Formulario de pago */}
            {mostrarFormularioPago && (
              <div className="p-4 border-t border-gray-100">
                <FormularioPagoTarjeta
                  monto={getTotalSeleccionado()}
                  moneda="EUR"
                  pacienteId={pacienteId}
                  facturaIds={facturasSeleccionadas}
                  onPagoExitoso={handlePagoExitoso}
                  onError={handleError}
                  onCancelar={() => setMostrarFormularioPago(false)}
                />
              </div>
            )}
          </div>

          {/* Historial de Pagos */}
          <HistorialPagosList
            pacienteId={pacienteId}
            onVerDetalle={handleVerDetallePago}
          />
        </div>
      </div>

      {/* Modal de detalle de pago */}
      {mostrarDetallePago && pagoDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Detalle del Pago</h2>
              <button
                onClick={() => {
                  setMostrarDetallePago(false);
                  setPagoDetalle(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Estado</p>
                  <p className="font-semibold text-gray-900 capitalize">{pagoDetalle.estado}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Método de Pago</p>
                  <p className="font-semibold text-gray-900">{pagoDetalle.metodo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Monto</p>
                  <p className="font-semibold text-gray-900">
                    {pagoDetalle.moneda} {pagoDetalle.monto.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Fecha</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(pagoDetalle.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {pagoDetalle.gatewayTransactionId && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-700 mb-2">ID de Transacción</p>
                    <p className="font-mono text-sm text-gray-900">{pagoDetalle.gatewayTransactionId}</p>
                  </div>
                )}
                {pagoDetalle.notas && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-700 mb-2">Notas</p>
                    <p className="text-sm text-gray-900">{pagoDetalle.notas}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



