import { useState } from 'react';
import { Table, TrendingUp, TrendingDown, ArrowUpDown, Loader2 } from 'lucide-react';
import { SedeSummary } from '../api/dashboardSedesApi';

interface TablaRendimientoSedesProps {
  datos: SedeSummary[];
  loading?: boolean;
}

type ColumnaOrden = 'nombre' | 'ingresos' | 'pacientes' | 'citas' | 'ocupacion' | 'ticket';
type DireccionOrden = 'asc' | 'desc';

export default function TablaRendimientoSedes({
  datos,
  loading = false,
}: TablaRendimientoSedesProps) {
  const [columnaOrden, setColumnaOrden] = useState<ColumnaOrden>('ingresos');
  const [direccionOrden, setDireccionOrden] = useState<DireccionOrden>('desc');

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearPorcentaje = (valor: number) => {
    return `${(valor * 100).toFixed(1)}%`;
  };

  const ordenarDatos = () => {
    const datosOrdenados = [...datos];

    datosOrdenados.sort((a, b) => {
      let valorA: number;
      let valorB: number;

      switch (columnaOrden) {
        case 'nombre':
          return direccionOrden === 'asc'
            ? a.nombreSede.localeCompare(b.nombreSede)
            : b.nombreSede.localeCompare(a.nombreSede);
        case 'ingresos':
          valorA = a.totalIngresos;
          valorB = b.totalIngresos;
          break;
        case 'pacientes':
          valorA = a.nuevosPacientes;
          valorB = b.nuevosPacientes;
          break;
        case 'citas':
          valorA = a.citasAtendidas;
          valorB = b.citasAtendidas;
          break;
        case 'ocupacion':
          valorA = a.tasaOcupacion;
          valorB = b.tasaOcupacion;
          break;
        case 'ticket':
          valorA = a.ticketPromedio;
          valorB = b.ticketPromedio;
          break;
        default:
          return 0;
      }

      if (columnaOrden !== 'nombre') {
        return direccionOrden === 'asc' ? valorA - valorB : valorB - valorA;
      }

      return 0;
    });

    return datosOrdenados;
  };

  const handleOrdenar = (columna: ColumnaOrden) => {
    if (columnaOrden === columna) {
      setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc');
    } else {
      setColumnaOrden(columna);
      setDireccionOrden('desc');
    }
  };

  const IconoOrden = ({ columna }: { columna: ColumnaOrden }) => {
    if (columnaOrden !== columna) {
      return <ArrowUpDown size={16} className="text-slate-400" />;
    }
    return direccionOrden === 'asc' ? (
      <TrendingUp size={16} className="text-blue-600" />
    ) : (
      <TrendingDown size={16} className="text-blue-600" />
    );
  };

  const datosOrdenados = ordenarDatos();

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center ring-1 ring-slate-200">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando datos de la tabla...</p>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center ring-1 ring-slate-200">
        <Table size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron datos para mostrar la tabla de rendimiento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 ring-1 ring-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <Table size={20} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Rendimiento por Sede</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th
                className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleOrdenar('nombre')}
              >
                <div className="flex items-center gap-1">
                  <span>Sede</span>
                  <IconoOrden columna="nombre" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleOrdenar('ingresos')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Ingresos</span>
                  <IconoOrden columna="ingresos" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleOrdenar('pacientes')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Nuevos Pacientes</span>
                  <IconoOrden columna="pacientes" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleOrdenar('citas')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Citas Atendidas</span>
                  <IconoOrden columna="citas" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleOrdenar('ocupacion')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Tasa Ocupación</span>
                  <IconoOrden columna="ocupacion" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleOrdenar('ticket')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Ticket Promedio</span>
                  <IconoOrden columna="ticket" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tasa Cancelación
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {datosOrdenados.map((sede, index) => (
              <tr
                key={sede.sedeId}
                className={`hover:bg-slate-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{sede.nombreSede}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-bold text-green-700">
                    {formatearMoneda(sede.totalIngresos)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {sede.nuevosPacientes}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {sede.citasAtendidas}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end">
                    <span
                      className={`text-sm font-semibold ${
                        sede.tasaOcupacion >= 0.75
                          ? 'text-green-700'
                          : sede.tasaOcupacion >= 0.5
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}
                    >
                      {formatearPorcentaje(sede.tasaOcupacion)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(sede.ticketPromedio)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end">
                    <span
                      className={`text-sm font-semibold ${
                        sede.tasaCancelacion <= 0.1
                          ? 'text-green-700'
                          : sede.tasaCancelacion <= 0.2
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}
                    >
                      {formatearPorcentaje(sede.tasaCancelacion)}
                    </span>
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



