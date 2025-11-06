import { Pago } from '../api/pagoApi';
import { CreditCard, Banknote, Building2, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';

interface HistorialPagosMiniaturaProps {
  pagos: Pago[];
  loading?: boolean;
  onVerDetalle?: (pagoId: string) => void;
}

export default function HistorialPagosMiniatura({
  pagos,
  loading = false,
  onVerDetalle,
}: HistorialPagosMiniaturaProps) {
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const getIconoMetodo = (metodo: string) => {
    switch (metodo) {
      case 'Tarjeta':
        return <CreditCard className="w-4 h-4" />;
      case 'Efectivo':
        return <Banknote className="w-4 h-4" />;
      case 'Transferencia':
        return <Building2 className="w-4 h-4" />;
      case 'Financiacion':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Banknote className="w-4 h-4" />;
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'Completado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pendiente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Fallido':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fallido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Pagos</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No hay pagos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Pagos</h3>
        <p className="text-sm text-gray-600 mt-1">
          Últimos {pagos.length} {pagos.length === 1 ? 'pago' : 'pagos'}
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {pagos.map((pago) => (
          <div
            key={pago._id}
            onClick={() => onVerDetalle && pago._id && onVerDetalle(pago._id)}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              onVerDetalle && pago._id ? 'cursor-pointer' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-gray-400">{getIconoMetodo(pago.metodoPago)}</div>
                  <span className="font-medium text-gray-900">
                    {formatearMoneda(pago.monto)} {pago.moneda}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pago.estado)}`}>
                    <div className="flex items-center space-x-1">
                      {getEstadoIcono(pago.estado)}
                      <span>{pago.estado}</span>
                    </div>
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Método:</span> {pago.metodoPago}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span> {formatearFecha(pago.fecha)}
                  </p>
                  {pago.tratamientos && pago.tratamientos.length > 0 && (
                    <p>
                      <span className="font-medium">Tratamientos:</span>{' '}
                      {pago.tratamientos.map((t) => t.nombre).join(', ')}
                    </p>
                  )}
                  {pago.notas && (
                    <p className="text-gray-500 italic">Notas: {pago.notas}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


