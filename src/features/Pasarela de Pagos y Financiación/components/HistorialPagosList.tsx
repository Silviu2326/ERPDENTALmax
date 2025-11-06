import { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle2, XCircle, Clock, Eye, Loader2, AlertCircle } from 'lucide-react';
import { obtenerPagosPorPaciente, obtenerPagoPorId, Pago } from '../api/pagosApi';

interface HistorialPagosListProps {
  pacienteId: string;
  onVerDetalle?: (pago: Pago) => void;
  compact?: boolean;
}

export default function HistorialPagosList({
  pacienteId,
  onVerDetalle,
  compact = false,
}: HistorialPagosListProps) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, [pacienteId]);

  const cargarPagos = async () => {
    setLoading(true);
    setError(null);

    try {
      const datos = await obtenerPagosPorPaciente(pacienteId);
      // Ordenar por fecha más reciente primero
      const ordenados = datos.sort((a, b) => {
        const fechaA = new Date(a.fecha).getTime();
        const fechaB = new Date(b.fecha).getTime();
        return fechaB - fechaA;
      });
      setPagos(ordenados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial de pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (pagoId: string) => {
    if (!onVerDetalle) return;

    setCargandoDetalle(true);
    try {
      const detalle = await obtenerPagoPorId(pagoId);
      setPagoSeleccionado(detalle);
      onVerDetalle(detalle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle del pago');
    } finally {
      setCargandoDetalle(false);
    }
  };

  const getEstadoIcon = (estado: Pago['estado']) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'fallido':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'reembolsado':
        return <XCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando historial de pagos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800 font-medium">Error al cargar historial</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No hay pagos registrados</p>
          <p className="text-sm text-gray-500 mt-1">El historial de pagos aparecerá aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Pagos</h3>
        <p className="text-sm text-gray-600 mt-1">{pagos.length} {pagos.length === 1 ? 'pago' : 'pagos'} registrado{pagos.length > 1 ? 's' : ''}</p>
      </div>

      <div className="divide-y divide-gray-200">
        {pagos.map((pago) => (
          <div
            key={pago._id}
            className={`p-6 hover:bg-gray-50 transition-colors ${compact ? 'p-4' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="mt-1">{getEstadoIcon(pago.estado)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoColor(pago.estado)}`}>
                      {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatearMetodoPago(pago.metodo)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatearFecha(pago.fecha)}</span>
                    </div>
                    {pago.gatewayTransactionId && (
                      <span className="text-xs text-gray-500">
                        ID: {pago.gatewayTransactionId.substring(0, 12)}...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {pago.moneda} {pago.monto.toFixed(2)}
                    </span>
                  </div>
                  {pago.facturas && pago.facturas.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Factura{pago.facturas.length > 1 ? 's' : ''}: {pago.facturas.map(f => f.numero).join(', ')}
                      </p>
                    </div>
                  )}
                  {pago.notas && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{pago.notas}"</p>
                  )}
                </div>
              </div>
              {onVerDetalle && (
                <button
                  onClick={() => pago._id && handleVerDetalle(pago._id)}
                  disabled={cargandoDetalle}
                  className="ml-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Ver detalle"
                >
                  {cargandoDetalle && pagoSeleccionado?._id === pago._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


