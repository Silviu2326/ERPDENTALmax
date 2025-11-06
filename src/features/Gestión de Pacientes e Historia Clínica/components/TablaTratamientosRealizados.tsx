import { Eye, Calendar, DollarSign, User, Tooth } from 'lucide-react';
import { TratamientoRealizado } from '../api/tratamientosRealizadosApi';

interface TablaTratamientosRealizadosProps {
  tratamientos: TratamientoRealizado[];
  loading: boolean;
  onVerDetalle: (tratamiento: TratamientoRealizado) => void;
}

export default function TablaTratamientosRealizados({
  tratamientos,
  loading,
  onVerDetalle,
}: TablaTratamientosRealizadosProps) {
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(monto);
  };

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Pagado Parcial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tratamientos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Tooth className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">No hay tratamientos realizados</p>
        <p className="text-gray-400 text-sm mt-2">
          Los tratamientos completados aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pieza Dental
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profesional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado Pago
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tratamientos.map((tratamiento) => (
              <tr key={tratamiento._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatearFecha(tratamiento.fechaRealizacion)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {tratamiento.tratamientoBase.nombre}
                  </div>
                  {tratamiento.tratamientoBase.codigo && (
                    <div className="text-xs text-gray-500">
                      Código: {tratamiento.tratamientoBase.codigo}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {tratamiento.piezaDental ? (
                    <div className="flex items-center text-sm text-gray-900">
                      <Tooth className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{tratamiento.piezaDental}</span>
                      {tratamiento.superficie && (
                        <span className="ml-1 text-gray-500">({tratamiento.superficie})</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {tratamiento.odontologo.nombre} {tratamiento.odontologo.apellidos}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                    {formatearMoneda(tratamiento.costo)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoPagoColor(
                      tratamiento.estadoPago
                    )}`}
                  >
                    {tratamiento.estadoPago}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onVerDetalle(tratamiento)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
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


