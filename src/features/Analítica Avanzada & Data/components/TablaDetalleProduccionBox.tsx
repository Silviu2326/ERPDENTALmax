import { ProduccionProfesional } from '../api/analiticaApi';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface TablaDetalleProduccionBoxProps {
  datos: ProduccionProfesional[];
  loading?: boolean;
}

type SortField = 'nombreCompleto' | 'produccionTotal' | 'numeroCitas' | 'horasTrabajadas';
type SortDirection = 'asc' | 'desc';

export default function TablaDetalleProduccionBox({
  datos,
  loading = false,
}: TablaDetalleProduccionBoxProps) {
  const [sortField, setSortField] = useState<SortField>('produccionTotal');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...datos].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'nombreCompleto':
        aValue = a.nombreCompleto;
        bValue = b.nombreCompleto;
        break;
      case 'produccionTotal':
        aValue = a.produccionTotal;
        bValue = b.produccionTotal;
        break;
      case 'numeroCitas':
        aValue = a.numeroCitas;
        bValue = b.numeroCitas;
        break;
      case 'horasTrabajadas':
        aValue = a.horasTrabajadas;
        bValue = b.horasTrabajadas;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Producción por Profesional</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Producción por Profesional</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nombreCompleto')}
              >
                <div className="flex items-center space-x-1">
                  <span>Profesional</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('especialidad')}
              >
                Especialidad
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('produccionTotal')}
              >
                <div className="flex items-center space-x-1">
                  <span>Producción Total</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('numeroCitas')}
              >
                <div className="flex items-center space-x-1">
                  <span>N° Citas</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('horasTrabajadas')}
              >
                <div className="flex items-center space-x-1">
                  <span>Horas Trabajadas</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Boxes Asignados
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((profesional) => (
              <tr key={profesional.profesionalId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {profesional.nombreCompleto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {profesional.especialidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatearMoneda(profesional.produccionTotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {profesional.numeroCitas}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {profesional.horasTrabajadas.toFixed(1)}h
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {profesional.boxesAsignados.map((boxId) => (
                      <span
                        key={boxId}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {boxId}
                      </span>
                    ))}
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


