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
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <DollarSign className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay comisiones para mostrar</p>
          <p className="text-sm">Ajusta los filtros para ver resultados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Profesional</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Sede</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Tratamientos</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Total Comisiones</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Pendientes</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Liquidadas</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reportes.map((reporte) => (
              <tr
                key={reporte.profesional._id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {reporte.profesional.nombre} {reporte.profesional.apellidos}
                    </span>
                    {reporte.profesional.especialidad && (
                      <span className="text-sm text-gray-500">{reporte.profesional.especialidad}</span>
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
                  <div className="flex items-center justify-end space-x-1">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-amber-600">
                      {formatearMoneda(reporte.totalComisionesPendientes)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-600">
                      {formatearMoneda(reporte.totalComisionesLiquidadas)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(reporte.profesional._id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
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
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total General:</span>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Total Comisiones</span>
              <span className="text-lg font-bold text-blue-600">
                {formatearMoneda(
                  reportes.reduce((sum, r) => sum + r.totalComisiones, 0)
                )}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Pendientes</span>
              <span className="text-lg font-bold text-amber-600">
                {formatearMoneda(
                  reportes.reduce((sum, r) => sum + r.totalComisionesPendientes, 0)
                )}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Liquidadas</span>
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


