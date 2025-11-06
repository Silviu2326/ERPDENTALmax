import { Eye, CheckCircle2, DollarSign } from 'lucide-react';
import { Nomina } from '../../api/nominasApi';

interface TablaNominasProps {
  nominas: Nomina[];
  loading?: boolean;
  onVerDetalle: (nomina: Nomina) => void;
}

export default function TablaNominas({ nominas, loading, onVerDetalle }: TablaNominasProps) {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const getEstadoBadge = (estado: Nomina['estado']) => {
    const estilos = {
      Calculada: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Aprobada: 'bg-blue-100 text-blue-800 border-blue-200',
      Pagada: 'bg-green-100 text-green-800 border-green-200',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${estilos[estado] || estilos.Calculada}`}
      >
        {estado}
      </span>
    );
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando nóminas...</p>
        </div>
      </div>
    );
  }

  if (nominas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No se encontraron nóminas</p>
        <p className="text-gray-500 text-sm mt-2">
          Utiliza el panel de control para calcular nóminas de un período
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha Cálculo
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Salario Base
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Comisiones
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Deducciones
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Neto a Pagar
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nominas.map((nomina) => (
              <tr key={nomina._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {nomina.empleadoNombre || `Empleado ${nomina.empleadoId}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {meses[nomina.periodo.mes - 1]} {nomina.periodo.anio}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatearFecha(nomina.fechaCalculo)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatearMoneda(nomina.salarioBase)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-green-600">
                    {formatearMoneda(nomina.totalComisiones)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-red-600">
                    -{formatearMoneda(nomina.totalDeducciones)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-bold text-blue-600">
                    {formatearMoneda(nomina.netoAPagar)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{getEstadoBadge(nomina.estado)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onVerDetalle(nomina)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


