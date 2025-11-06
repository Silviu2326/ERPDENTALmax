import { useState } from 'react';
import { Eye, Edit, Trash2, Calendar, User, Building2 } from 'lucide-react';
import { OrdenLaboratorio, EstadoOrden } from '../api/ordenesLaboratorioApi';

interface ListaOrdenesLaboratorioProps {
  ordenes: OrdenLaboratorio[];
  loading?: boolean;
  onVerDetalle: (orden: OrdenLaboratorio) => void;
  onEditar?: (orden: OrdenLaboratorio) => void;
  onEliminar?: (orden: OrdenLaboratorio) => void;
}

const ESTADO_COLORS: Record<EstadoOrden, string> = {
  'Borrador': 'bg-gray-100 text-gray-800',
  'Enviada': 'bg-blue-100 text-blue-800',
  'Recibida': 'bg-yellow-100 text-yellow-800',
  'En Proceso': 'bg-orange-100 text-orange-800',
  'Control Calidad': 'bg-purple-100 text-purple-800',
  'Enviada a Clínica': 'bg-indigo-100 text-indigo-800',
  'Recibida en Clínica': 'bg-green-100 text-green-800',
  'Completada': 'bg-emerald-100 text-emerald-800',
};

export default function ListaOrdenesLaboratorio({
  ordenes,
  loading = false,
  onVerDetalle,
  onEditar,
  onEliminar,
}: ListaOrdenesLaboratorioProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando órdenes...</p>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No se encontraron órdenes</p>
        <p className="text-gray-500 text-sm mt-2">
          Utilice los filtros para buscar órdenes o cree una nueva orden
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laboratorio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Trabajo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrega Prevista
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordenes.map((orden) => (
              <tr key={orden._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{orden._id?.slice(-6) || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {orden.paciente.nombre} {orden.paciente.apellidos}
                      </div>
                      {orden.paciente.dni && (
                        <div className="text-xs text-gray-500">{orden.paciente.dni}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">{orden.laboratorio.nombre}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{orden.tipoTrabajo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ESTADO_COLORS[orden.estado] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {orden.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    {new Date(orden.fechaCreacion).toLocaleDateString('es-ES')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orden.fechaEntregaPrevista ? (
                    <div className="text-sm text-gray-900">
                      {new Date(orden.fechaEntregaPrevista).toLocaleDateString('es-ES')}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No especificada</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onVerDetalle(orden)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(orden)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(orden)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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


