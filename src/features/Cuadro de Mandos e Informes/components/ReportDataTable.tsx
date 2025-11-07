import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface ReportDataTableProps {
  data: any[];
  columns: string[];
  totalRecords?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export default function ReportDataTable({
  data,
  columns,
  totalRecords,
  page = 1,
  limit = 50,
  onPageChange,
  loading = false,
}: ReportDataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    const headers = columns.join(',');
    const rows = data.map((row) =>
      columns.map((col) => {
        const value = row[col];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/,/g, ';');
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `informe_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const sortedData = [...data];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const totalPages = totalRecords ? Math.ceil(totalRecords / limit) : 1;

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Datos del Informe</h3>
          <p className="text-sm text-gray-600">
            {totalRecords !== undefined
              ? `${totalRecords} ${totalRecords === 1 ? 'registro' : 'registros'}`
              : `${data.length} ${data.length === 1 ? 'fila' : 'filas'}`}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700"
        >
          <Download size={20} />
          <span>Exportar CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column}</span>
                    {sortColumn === column && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No hay datos para mostrar
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {columns.map((column) => {
                    const value = row[column];
                    let displayValue: string;
                    if (value === null || value === undefined) {
                      displayValue = '-';
                    } else if (typeof value === 'object') {
                      displayValue = JSON.stringify(value);
                    } else if (typeof value === 'number') {
                      displayValue = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(value);
                    } else {
                      displayValue = String(value);
                    }
                    return (
                      <td key={column} className="px-4 py-3 text-gray-700">
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalRecords !== undefined && onPageChange && totalPages > 1 && (
        <div className="bg-white shadow-sm rounded-xl p-4 mt-6">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-600 px-4">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



