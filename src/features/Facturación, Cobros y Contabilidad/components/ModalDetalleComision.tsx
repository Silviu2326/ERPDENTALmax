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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {detalle.profesional.nombre} {detalle.profesional.apellidos}
              </h2>
              <p className="text-sm text-gray-600">
                {detalle.profesional.especialidad || 'Profesional'}
                {detalle.profesional.sede && ` • ${detalle.profesional.sede.nombre}`}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-600">Cargando...</p>
            </div>
          ) : (
            <>
              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Tratamientos</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{detalle.resumen.totalTratamientos}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
                      <DollarSign size={16} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Monto Cobrado</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatearMoneda(detalle.resumen.totalMontoCobrado)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
                      <DollarSign size={16} className="text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Total Comisiones</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatearMoneda(detalle.resumen.totalComisiones)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-amber-100 rounded-xl ring-1 ring-amber-200/70">
                      <Calendar size={16} className="text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Promedio</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatearMoneda(detalle.resumen.promedioComisionPorTratamiento)}
                  </p>
                </div>
              </div>

              {/* Periodo */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200 ring-1 ring-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Calendar size={16} />
                  <span>
                    Periodo: {formatearFecha(detalle.periodo.fechaInicio)} -{' '}
                    {formatearFecha(detalle.periodo.fechaFin)}
                  </span>
                </div>
              </div>

              {/* Tabs para Pendientes y Liquidadas */}
              <div className="mb-4">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
                  <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200">
                    <span>Pendientes ({tratamientosPendientes.length})</span>
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70">
                    <span>Liquidadas ({tratamientosLiquidadas.length})</span>
                  </button>
                </div>
              </div>

              {/* Tabla de Tratamientos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Paciente
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Tratamiento
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Descuento
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Monto Cobrado
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Comisión
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {detalle.tratamientos.map((tratamiento) => (
                      <tr
                        key={tratamiento._id}
                        className="hover:bg-slate-50 transition-colors"
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
                              <CheckCircle size={12} className="mr-1" />
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
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
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
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all"
            >
              Liquidar Comisiones
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



