import { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  Loader2,
  AlertCircle,
  User,
  FileText
} from 'lucide-react';
import { Pago } from '../api/pagosApi';

interface HistorialPagosTableProps {
  pagos: Pago[];
  loading?: boolean;
  onVerDetalle?: (pago: Pago) => void;
  onGenerarRecibo?: (pagoId: string) => void;
  mostrarPaciente?: boolean;
}

export default function HistorialPagosTable({
  pagos,
  loading = false,
  onVerDetalle,
  onGenerarRecibo,
  mostrarPaciente = false,
}: HistorialPagosTableProps) {
  const [generandoRecibo, setGenerandoRecibo] = useState<string | null>(null);

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

  const formatearMoneda = (valor: number, moneda: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda || 'EUR',
    }).format(valor);
  };

  const handleGenerarRecibo = async (pagoId: string) => {
    if (!onGenerarRecibo || !pagoId) return;
    
    setGenerandoRecibo(pagoId);
    try {
      await onGenerarRecibo(pagoId);
    } catch (error) {
      console.error('Error al generar recibo:', error);
    } finally {
      setGenerandoRecibo(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Cargando pagos...</span>
        </div>
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pagos registrados</h3>
          <p className="text-gray-600">El historial de pagos aparecerá aquí cuando se registren transacciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {mostrarPaciente && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamientos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagos.map((pago) => (
              <tr key={pago._id} className="hover:bg-gray-50 transition-colors">
                {mostrarPaciente && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pago.paciente.nombre} {pago.paciente.apellidos}
                        </div>
                        {pago.paciente.documentoIdentidad && (
                          <div className="text-sm text-gray-500">
                            {pago.paciente.documentoIdentidad}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    {formatearFecha(pago.fecha)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(pago.monto, pago.moneda)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                    {formatearMetodoPago(pago.metodo)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getEstadoIcon(pago.estado)}
                    <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoColor(pago.estado)}`}>
                      {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {pago.tratamientos && pago.tratamientos.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {pago.tratamientos.slice(0, 2).map((tratamiento, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {tratamiento.nombre}
                          </span>
                        ))}
                        {pago.tratamientos.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{pago.tratamientos.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin tratamientos</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(pago)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    {onGenerarRecibo && pago._id && (
                      <button
                        onClick={() => handleGenerarRecibo(pago._id!)}
                        disabled={generandoRecibo === pago._id}
                        className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descargar recibo"
                      >
                        {generandoRecibo === pago._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


