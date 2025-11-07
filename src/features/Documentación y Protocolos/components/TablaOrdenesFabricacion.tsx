import { Eye, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Package } from 'lucide-react';
import { OrdenFabricacion, EstadoFabricacion } from '../api/fabricacionApi';

interface TablaOrdenesFabricacionProps {
  ordenes: OrdenFabricacion[];
  loading?: boolean;
  onVerDetalle: (ordenId: string) => void;
}

const getEstadoColor = (estado: EstadoFabricacion): string => {
  const colores: Record<EstadoFabricacion, string> = {
    'Pendiente de Aceptación': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Recibido en laboratorio': 'bg-blue-100 text-blue-800 border-blue-300',
    'En Proceso': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'Diseño CAD': 'bg-purple-100 text-purple-800 border-purple-300',
    'Fresado/Impresión': 'bg-pink-100 text-pink-800 border-pink-300',
    'Acabado y Pulido': 'bg-orange-100 text-orange-800 border-orange-300',
    'Control de Calidad': 'bg-cyan-100 text-cyan-800 border-cyan-300',
    'Enviado a clínica': 'bg-teal-100 text-teal-800 border-teal-300',
    'Lista para Entrega': 'bg-green-100 text-green-800 border-green-300',
    'Recibido en Clínica': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Cancelada': 'bg-red-100 text-red-800 border-red-300',
  };
  return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const getEstadoIcon = (estado: EstadoFabricacion) => {
  if (estado === 'Cancelada') return <XCircle className="w-4 h-4" />;
  if (estado === 'Recibido en Clínica') return <CheckCircle className="w-4 h-4" />;
  if (estado === 'Pendiente de Aceptación') return <AlertCircle className="w-4 h-4" />;
  return <Clock className="w-4 h-4" />;
};

export default function TablaOrdenesFabricacion({
  ordenes,
  loading = false,
  onVerDetalle,
}: TablaOrdenesFabricacionProps) {
  if (loading) {
    return (
      <div className="p-8 text-center bg-white shadow-sm rounded-lg">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando órdenes de fabricación...</p>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="p-8 text-center bg-white shadow-sm rounded-lg">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron órdenes de fabricación</h3>
        <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Laboratorio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tipo de Prótesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Entrega Estimada
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordenes.map((orden) => (
              <tr
                key={orden._id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => orden._id && onVerDetalle(orden._id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{orden._id?.slice(-8) || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {orden.pacienteId?.nombre} {orden.pacienteId?.apellidos}
                  </div>
                  {orden.pacienteId?.dni && (
                    <div className="text-sm text-gray-500">DNI: {orden.pacienteId.dni}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{orden.laboratorioId?.nombre}</div>
                  {orden.laboratorioId?.telefono && (
                    <div className="text-sm text-gray-500">{orden.laboratorioId.telefono}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {orden.especificaciones?.tipoProtesis || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {orden.especificaciones?.material || ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(
                      orden.estadoActual
                    )}`}
                  >
                    {getEstadoIcon(orden.estadoActual)}
                    <span className="ml-1">{orden.estadoActual}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatearFecha(orden.fechaCreacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {orden.fechaEntregaEstimada
                    ? formatearFecha(orden.fechaEntregaEstimada)
                    : 'No especificada'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (orden._id) onVerDetalle(orden._id);
                    }}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Detalle</span>
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



