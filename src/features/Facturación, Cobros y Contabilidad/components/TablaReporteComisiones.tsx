import { Eye, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { ReporteComisionProfesional } from '../api/comisionesApi';

interface TablaReporteComisionesProps {
  reportes: ReporteComisionProfesional[];
  loading?: boolean;
  onVerDetalle?: (profesionalId: string) => void;
}

export default function TablaReporteComisiones({
  reportes,
  loading = false,
  onVerDetalle,
}: TablaReporteComisionesProps) {
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const formatearPorcentaje = (valor: number): string => {
    return `${valor.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
        <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay comisiones para mostrar</h3>
        <p className="text-gray-600 mb-4">Ajusta los filtros para ver resultados</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Profesional</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sede</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Tratamientos</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Total Comisiones</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Pendientes</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Liquidadas</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reportes.map((reporte) => (
              <tr
                key={reporte.profesional._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {reporte.profesional.nombre} {reporte.profesional.apellidos}
                    </span>
                    {reporte.profesional.especialidad && (
                      <span className="text-sm text-gray-600">{reporte.profesional.especialidad}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">
                    {reporte.profesional.sede?.nombre || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-gray-900">{reporte.cantidadTratamientos}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-lg text-blue-600">
                    {formatearMoneda(reporte.totalComisiones)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Clock size={16} className="text-amber-500" />
                    <span className="font-semibold text-amber-600">
                      {formatearMoneda(reporte.totalComisionesPendientes)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="font-semibold text-green-600">
                      {formatearMoneda(reporte.totalComisionesLiquidadas)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(reporte.profesional._id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen Total */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Total General:</span>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Total Comisiones</span>
              <span className="text-lg font-bold text-blue-600">
                {formatearMoneda(
                  reportes.reduce((sum, r) => sum + r.totalComisiones, 0)
                )}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Pendientes</span>
              <span className="text-lg font-bold text-amber-600">
                {formatearMoneda(
                  reportes.reduce((sum, r) => sum + r.totalComisionesPendientes, 0)
                )}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Liquidadas</span>
              <span className="text-lg font-bold text-green-600">
                {formatearMoneda(
                  reportes.reduce((sum, r) => sum + r.totalComisionesLiquidadas, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



