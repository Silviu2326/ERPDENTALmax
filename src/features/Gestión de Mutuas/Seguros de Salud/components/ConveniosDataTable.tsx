import { Edit, Trash2, Eye, Calendar, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Convenio } from '../api/conveniosApi';

interface ConveniosDataTableProps {
  convenios: Convenio[];
  loading?: boolean;
  onEditar?: (convenio: Convenio) => void;
  onEliminar?: (convenio: Convenio) => void;
  onVerDetalle?: (convenio: Convenio) => void;
}

export default function ConveniosDataTable({
  convenios,
  loading = false,
  onEditar,
  onEliminar,
  onVerDetalle,
}: ConveniosDataTableProps) {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        );
      case 'inactivo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Inactivo
          </span>
        );
      case 'borrador':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FileText className="w-3 h-3" />
            Borrador
          </span>
        );
      default:
        return null;
    }
  };

  const formatearFecha = (fecha: string | Date) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const estaVigente = (fechaInicio: string | Date, fechaFin: string | Date) => {
    const ahora = new Date();
    const inicio = typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio;
    const fin = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;
    return ahora >= inicio && ahora <= fin;
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

  if (convenios.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay convenios registrados</p>
          <p className="text-sm">Comienza agregando un nuevo convenio o acuerdo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mutua
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vigencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coberturas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {convenios.map((convenio) => {
              const vigente = estaVigente(convenio.fechaInicio, convenio.fechaFin);
              return (
                <tr key={convenio._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{convenio.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{convenio.codigo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {typeof convenio.mutua === 'object' ? convenio.mutua.nombreComercial : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div>{formatearFecha(convenio.fechaInicio)}</div>
                        <div className="text-xs text-gray-500">hasta {formatearFecha(convenio.fechaFin)}</div>
                        {!vigente && (
                          <span className="text-xs text-red-600 font-medium">(No vigente)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {convenio.coberturas?.length || 0} tratamiento{convenio.coberturas?.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(convenio.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {onVerDetalle && (
                        <button
                          onClick={() => onVerDetalle(convenio)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEditar && (
                        <button
                          onClick={() => onEditar(convenio)}
                          className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          onClick={() => onEliminar(convenio)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


