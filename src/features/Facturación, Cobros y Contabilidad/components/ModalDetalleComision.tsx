import { X, DollarSign, Calendar, User, FileText, CheckCircle } from 'lucide-react';
import { DetalleComisionProfesional, TratamientoComisionable } from '../api/comisionesApi';

interface ModalDetalleComisionProps {
  detalle: DetalleComisionProfesional | null;
  loading?: boolean;
  onCerrar: () => void;
  onLiquidar?: (profesionalId: string, fechaInicio: string, fechaFin: string) => void;
}

export default function ModalDetalleComision({
  detalle,
  loading = false,
  onCerrar,
  onLiquidar,
}: ModalDetalleComisionProps) {
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  if (!detalle) {
    return null;
  }

  const tratamientosPendientes = detalle.tratamientos.filter(
    (t) => t.estadoLiquidacion === 'pendiente'
  );
  const tratamientosLiquidadas = detalle.tratamientos.filter(
    (t) => t.estadoLiquidacion === 'liquidado'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">
                {detalle.profesional.nombre} {detalle.profesional.apellidos}
              </h2>
              <p className="text-sm text-blue-100">
                {detalle.profesional.especialidad || 'Profesional'}
                {detalle.profesional.sede && ` • ${detalle.profesional.sede.nombre}`}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Tratamientos</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{detalle.resumen.totalTratamientos}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Monto Cobrado</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatearMoneda(detalle.resumen.totalMontoCobrado)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Total Comisiones</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatearMoneda(detalle.resumen.totalComisiones)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">Promedio</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatearMoneda(detalle.resumen.promedioComisionPorTratamiento)}
                  </p>
                </div>
              </div>

              {/* Periodo */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Periodo: {formatearFecha(detalle.periodo.fechaInicio)} -{' '}
                    {formatearFecha(detalle.periodo.fechaFin)}
                  </span>
                </div>
              </div>

              {/* Tabs para Pendientes y Liquidadas */}
              <div className="mb-4">
                <div className="flex space-x-4 border-b border-gray-200">
                  <div className="px-4 py-2 border-b-2 border-blue-600">
                    <span className="font-semibold text-blue-600">
                      Pendientes ({tratamientosPendientes.length})
                    </span>
                  </div>
                  <div className="px-4 py-2 text-gray-500">
                    <span className="font-semibold">
                      Liquidadas ({tratamientosLiquidadas.length})
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabla de Tratamientos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Paciente
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tratamiento
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Descuento
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Monto Cobrado
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Comisión
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {detalle.tratamientos.map((tratamiento) => (
                      <tr
                        key={tratamiento._id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(tratamiento.fechaRealizacion).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="font-medium text-gray-900">
                            {tratamiento.paciente.nombre} {tratamiento.paciente.apellidos}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {tratamiento.tratamiento.nombre}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatearMoneda(tratamiento.precio)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatearMoneda(tratamiento.descuento)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                          {formatearMoneda(tratamiento.montoCobrado)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                          {formatearMoneda(tratamiento.comisionCalculada)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {tratamiento.estadoLiquidacion === 'liquidado' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Liquidado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Pendiente
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {tratamientosPendientes.length > 0 && onLiquidar && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{tratamientosPendientes.length}</span> comisiones pendientes
              por un total de{' '}
              <span className="font-bold text-blue-600">
                {formatearMoneda(
                  tratamientosPendientes.reduce(
                    (sum, t) => sum + t.comisionCalculada,
                    0
                  )
                )}
              </span>
            </div>
            <button
              onClick={() =>
                onLiquidar(
                  detalle.profesional._id,
                  detalle.periodo.fechaInicio,
                  detalle.periodo.fechaFin
                )
              }
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Liquidar Comisiones
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


