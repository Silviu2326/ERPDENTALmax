import { useState } from 'react';
import { Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ProductividadProfesional } from '../api/reportesProductividadApi';

interface ProductividadDataTableProps {
  datos: ProductividadProfesional[];
  loading?: boolean;
}

type ColumnaOrdenable = 'nombreCompleto' | 'ingresosTotales' | 'numeroTratamientos' | 'horasSillon' | 'costeMateriales' | 'rentabilidad' | 'productividadPorHora';
type Orden = 'asc' | 'desc' | null;

export default function ProductividadDataTable({
  datos,
  loading = false,
}: ProductividadDataTableProps) {
  const [columnaOrden, setColumnaOrden] = useState<ColumnaOrdenable>('ingresosTotales');
  const [orden, setOrden] = useState<Orden>('desc');

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearNumero = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 1,
    }).format(valor);
  };

  const manejarOrden = (columna: ColumnaOrdenable) => {
    if (columnaOrden === columna) {
      if (orden === 'desc') {
        setOrden('asc');
      } else if (orden === 'asc') {
        setOrden(null);
        setColumnaOrden('ingresosTotales');
      }
    } else {
      setColumnaOrden(columna);
      setOrden('desc');
    }
  };

  const datosOrdenados = [...datos].sort((a, b) => {
    if (!orden) return 0;

    let valorA: number | string = a[columnaOrden];
    let valorB: number | string = b[columnaOrden];

    if (typeof valorA === 'string') {
      valorA = valorA.toLowerCase();
      valorB = (valorB as string).toLowerCase();
    }

    if (orden === 'asc') {
      return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
    } else {
      return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
    }
  });

  const exportarCSV = () => {
    const headers = [
      'Profesional',
      'Ingresos Totales',
      'Tratamientos',
      'Horas de Sillón',
      'Coste Materiales',
      'Rentabilidad',
      'Productividad/Hora',
    ];

    const filas = datosOrdenados.map((dato) => [
      dato.nombreCompleto,
      dato.ingresosTotales.toString(),
      dato.numeroTratamientos.toString(),
      dato.horasSillon.toString(),
      dato.costeMateriales.toString(),
      dato.rentabilidad.toString(),
      dato.productividadPorHora.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...filas.map((fila) => fila.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `productividad-profesional-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const obtenerIconoOrden = (columna: ColumnaOrdenable) => {
    if (columnaOrden !== columna) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (orden === 'asc') {
      return <ArrowUp className="w-4 h-4 text-blue-600" />;
    }
    if (orden === 'desc') {
      return <ArrowDown className="w-4 h-4 text-blue-600" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
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

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm">Seleccione un rango de fechas para ver los datos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Detalle por Profesional</h3>
            <p className="text-sm text-gray-600 mt-1">
              {datos.length} profesional{datos.length !== 1 ? 'es' : ''} encontrado{datos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={exportarCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => manejarOrden('nombreCompleto')}
              >
                <div className="flex items-center gap-2">
                  Profesional
                  {obtenerIconoOrden('nombreCompleto')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => manejarOrden('ingresosTotales')}
              >
                <div className="flex items-center justify-end gap-2">
                  Ingresos Totales
                  {obtenerIconoOrden('ingresosTotales')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => manejarOrden('numeroTratamientos')}
              >
                <div className="flex items-center justify-end gap-2">
                  Tratamientos
                  {obtenerIconoOrden('numeroTratamientos')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => manejarOrden('horasSillon')}
              >
                <div className="flex items-center justify-end gap-2">
                  Horas de Sillón
                  {obtenerIconoOrden('horasSillon')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => manejarOrden('costeMateriales')}
              >
                <div className="flex items-center justify-end gap-2">
                  Coste Materiales
                  {obtenerIconoOrden('costeMateriales')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => manejarOrden('rentabilidad')}
              >
                <div className="flex items-center justify-end gap-2">
                  Rentabilidad
                  {obtenerIconoOrden('rentabilidad')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => manejarOrden('productividadPorHora')}
              >
                <div className="flex items-center justify-end gap-2">
                  Productividad/Hora
                  {obtenerIconoOrden('productividadPorHora')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {datosOrdenados.map((dato, index) => (
              <tr key={dato.profesionalId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{dato.nombreCompleto}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-blue-600">
                    {formatearMoneda(dato.ingresosTotales)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{dato.numeroTratamientos}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{formatearNumero(dato.horasSillon)} h</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{formatearMoneda(dato.costeMateriales)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div
                    className={`text-sm font-semibold ${
                      dato.rentabilidad >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatearMoneda(dato.rentabilidad)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-indigo-600">
                    {formatearMoneda(dato.productividadPorHora)}
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


