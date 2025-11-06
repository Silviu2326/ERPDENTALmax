import { Eye, FileText, DollarSign, CreditCard, TrendingDown } from 'lucide-react';
import { DatosPrevisualizacion } from '../api/contabilidadApi';

interface PrevisualizacionDatosExportarProps {
  datos: DatosPrevisualizacion | null;
  loading?: boolean;
}

export default function PrevisualizacionDatosExportar({
  datos,
  loading = false,
}: PrevisualizacionDatosExportarProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Vista Previa de Datos</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!datos || (!datos.facturas && !datos.cobros && !datos.gastos)) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Vista Previa de Datos</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Seleccione los parámetros de exportación para ver una vista previa</p>
        </div>
      </div>
    );
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Vista Previa de Datos</h2>
      </div>

      <div className="space-y-6">
        {/* Facturas */}
        {datos.facturas && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Facturas Emitidas</h3>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Registros</div>
                <div className="text-lg font-bold text-blue-600">{datos.facturas.total}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Importe Total</div>
              <div className="text-2xl font-bold text-gray-900">{formatearMoneda(datos.facturas.totalImporte)}</div>
            </div>
            {datos.facturas.muestras && datos.facturas.muestras.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Nº Factura</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Fecha</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Paciente</th>
                      <th className="px-3 py-2 text-right text-gray-700 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {datos.facturas.muestras.map((muestra, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-900">{muestra.numeroFactura}</td>
                        <td className="px-3 py-2 text-gray-600">{formatearFecha(muestra.fechaEmision)}</td>
                        <td className="px-3 py-2 text-gray-600">{muestra.paciente}</td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900">
                          {formatearMoneda(muestra.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {datos.facturas.total > datos.facturas.muestras.length && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Mostrando {datos.facturas.muestras.length} de {datos.facturas.total} registros
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cobros */}
        {datos.cobros && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Cobros Realizados</h3>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Registros</div>
                <div className="text-lg font-bold text-green-600">{datos.cobros.total}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Importe Total</div>
              <div className="text-2xl font-bold text-gray-900">{formatearMoneda(datos.cobros.totalImporte)}</div>
            </div>
            {datos.cobros.muestras && datos.cobros.muestras.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Fecha</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Paciente</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Método Pago</th>
                      <th className="px-3 py-2 text-right text-gray-700 font-medium">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {datos.cobros.muestras.map((muestra, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-600">{formatearFecha(muestra.fechaCobro)}</td>
                        <td className="px-3 py-2 text-gray-600">{muestra.paciente}</td>
                        <td className="px-3 py-2 text-gray-600">{muestra.metodoPago}</td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900">
                          {formatearMoneda(muestra.importe)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {datos.cobros.total > datos.cobros.muestras.length && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Mostrando {datos.cobros.muestras.length} de {datos.cobros.total} registros
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Gastos */}
        {datos.gastos && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Gastos</h3>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Registros</div>
                <div className="text-lg font-bold text-red-600">{datos.gastos.total}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Importe Total</div>
              <div className="text-2xl font-bold text-gray-900">{formatearMoneda(datos.gastos.totalImporte)}</div>
            </div>
            {datos.gastos.muestras && datos.gastos.muestras.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Fecha</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Proveedor</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Concepto</th>
                      <th className="px-3 py-2 text-right text-gray-700 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {datos.gastos.muestras.map((muestra, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-600">{formatearFecha(muestra.fecha)}</td>
                        <td className="px-3 py-2 text-gray-600">{muestra.proveedor}</td>
                        <td className="px-3 py-2 text-gray-600">{muestra.concepto}</td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900">
                          {formatearMoneda(muestra.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {datos.gastos.total > datos.gastos.muestras.length && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Mostrando {datos.gastos.muestras.length} de {datos.gastos.total} registros
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


