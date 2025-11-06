import { DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { FacturaLaboratorio } from '../api/facturacionLaboratorioApi';

interface PanelResumenFacturacionLabProps {
  facturas: FacturaLaboratorio[];
  loading?: boolean;
}

export default function PanelResumenFacturacionLab({
  facturas,
  loading = false,
}: PanelResumenFacturacionLabProps) {
  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  const calcularResumen = () => {
    const total = facturas.reduce((sum, factura) => sum + factura.total, 0);
    const pendientes = facturas.filter((f) => f.estado === 'Pendiente');
    const pagadas = facturas.filter((f) => f.estado === 'Pagada');
    const vencidas = facturas.filter((f) => f.estado === 'Vencida');

    const totalPendiente = pendientes.reduce((sum, f) => sum + f.total, 0);
    const totalPagado = pagadas.reduce((sum, f) => sum + f.total, 0);
    const totalVencido = vencidas.reduce((sum, f) => sum + f.total, 0);

    return {
      total,
      totalPendiente,
      totalPagado,
      totalVencido,
      cantidadPendientes: pendientes.length,
      cantidadPagadas: pagadas.length,
      cantidadVencidas: vencidas.length,
      cantidadTotal: facturas.length,
    };
  };

  const resumen = calcularResumen();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total General */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Facturado</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatearMoneda(resumen.total)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resumen.cantidadTotal} {resumen.cantidadTotal === 1 ? 'factura' : 'facturas'}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Pendientes */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pendientes de Pago</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatearMoneda(resumen.totalPendiente)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resumen.cantidadPendientes} {resumen.cantidadPendientes === 1 ? 'factura' : 'facturas'}
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Pagadas */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pagadas</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatearMoneda(resumen.totalPagado)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resumen.cantidadPagadas} {resumen.cantidadPagadas === 1 ? 'factura' : 'facturas'}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Vencidas */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Vencidas</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatearMoneda(resumen.totalVencido)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resumen.cantidadVencidas} {resumen.cantidadVencidas === 1 ? 'factura' : 'facturas'}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}


