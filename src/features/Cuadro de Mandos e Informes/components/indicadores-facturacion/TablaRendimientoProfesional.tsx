import { Users, TrendingUp } from 'lucide-react';
import { FacturacionPorProfesional } from '../../api/informesFacturacionApi';

interface TablaRendimientoProfesionalProps {
  datos: FacturacionPorProfesional[];
  loading?: boolean;
}

export default function TablaRendimientoProfesional({
  datos,
  loading = false,
}: TablaRendimientoProfesionalProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Profesional</h3>
            <p className="text-sm text-gray-600">Facturación y tratamientos</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Profesional</h3>
            <p className="text-sm text-gray-600">Facturación y tratamientos</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-600">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Ordenar por total facturado (descendente)
  const datosOrdenados = [...datos].sort((a, b) => b.totalFacturado - a.totalFacturado);
  const maxFacturado = Math.max(...datosOrdenados.map((d) => d.totalFacturado));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Profesional</h3>
          <p className="text-sm text-gray-600">Facturación y tratamientos</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">#</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Profesional</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">
                Total Facturado
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">
                Tratamientos
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">
                Ticket Medio
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Progreso</th>
            </tr>
          </thead>
          <tbody>
            {datosOrdenados.map((profesional, index) => {
              const ticketMedio =
                profesional.numeroTratamientos > 0
                  ? profesional.totalFacturado / profesional.numeroTratamientos
                  : 0;
              const porcentaje = (profesional.totalFacturado / maxFacturado) * 100;

              return (
                <tr
                  key={profesional.profesionalId}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{profesional.nombre}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-blue-600">
                      {formatearMoneda(profesional.totalFacturado)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="text-gray-700">{profesional.numeroTratamientos}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="text-gray-700">{formatearMoneda(ticketMedio)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-12 text-right">
                        {porcentaje.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Facturado</div>
            <div className="text-xl font-semibold text-blue-600">
              {formatearMoneda(
                datosOrdenados.reduce((sum, p) => sum + p.totalFacturado, 0)
              )}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Tratamientos</div>
            <div className="text-xl font-semibold text-green-600">
              {datosOrdenados.reduce((sum, p) => sum + p.numeroTratamientos, 0)}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Ticket Medio Global</div>
            <div className="text-xl font-semibold text-purple-600">
              {formatearMoneda(
                datosOrdenados.reduce((sum, p) => sum + p.totalFacturado, 0) /
                  Math.max(
                    datosOrdenados.reduce((sum, p) => sum + p.numeroTratamientos, 0),
                    1
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



