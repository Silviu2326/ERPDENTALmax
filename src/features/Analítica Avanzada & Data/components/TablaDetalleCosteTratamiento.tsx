import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { CostePorTratamiento } from '../api/analiticaApi';

interface TablaDetalleCosteTratamientoProps {
  datos: CostePorTratamiento[];
  loading?: boolean;
}

export default function TablaDetalleCosteTratamiento({
  datos,
  loading = false,
}: TablaDetalleCosteTratamientoProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof CostePorTratamiento>('margen');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  const toggleRow = (tratamientoId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(tratamientoId)) {
      newExpanded.delete(tratamientoId);
    } else {
      newExpanded.add(tratamientoId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: keyof CostePorTratamiento) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const datosOrdenados = [...datos].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Detalle de Costes</h3>
            <p className="text-sm text-gray-500">Desglose por tratamiento</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Detalle de Costes</h3>
            <p className="text-sm text-gray-500">Desglose por tratamiento</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Detalle de Costes</h3>
          <p className="text-sm text-gray-500">Desglose por tratamiento</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamiento
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('ingresos')}
              >
                Ingresos {sortField === 'ingresos' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('costeTotal')}
              >
                Coste Total {sortField === 'costeTotal' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('margen')}
              >
                Margen {sortField === 'margen' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('margenPorcentual')}
              >
                Margen % {sortField === 'margenPorcentual' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalle
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {datosOrdenados.map((tratamiento) => {
              const isExpanded = expandedRows.has(tratamiento.tratamientoId);
              return (
                <tr key={tratamiento.tratamientoId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {tratamiento.tratamientoNombre}
                      </div>
                      <div className="text-xs text-gray-500">{tratamiento.areaClinica}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearMoneda(tratamiento.ingresos)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatearMoneda(tratamiento.costeTotal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatearMoneda(tratamiento.margen)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tratamiento.margenPorcentual >= 60
                          ? 'bg-green-100 text-green-800'
                          : tratamiento.margenPorcentual >= 40
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tratamiento.margenPorcentual.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {tratamiento.cantidadRealizados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleRow(tratamiento.tratamientoId)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Ocultar</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>Ver</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Filas expandidas con detalle */}
      {datosOrdenados.map((tratamiento) => {
        if (!expandedRows.has(tratamiento.tratamientoId)) return null;
        return (
          <div
            key={`detail-${tratamiento.tratamientoId}`}
            className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h4 className="font-semibold text-gray-800 mb-3">Desglose de Costes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Coste Materiales</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatearMoneda(tratamiento.costeMateriales)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Coste Laboratorio</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatearMoneda(tratamiento.costeLaboratorio)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Coste Personal</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatearMoneda(tratamiento.costePersonal)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Precio Unitario</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatearMoneda(tratamiento.precioUnitario)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


