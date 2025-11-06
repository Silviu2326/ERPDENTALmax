import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Mutua } from '../api/mutuasApi';

interface MutuasTableProps {
  mutuas: Mutua[];
  loading?: boolean;
  onEditar?: (mutua: Mutua) => void;
  onEliminar?: (mutua: Mutua) => void;
  onVerDetalle?: (mutua: Mutua) => void;
}

export default function MutuasTable({
  mutuas,
  loading = false,
  onEditar,
  onEliminar,
  onVerDetalle,
}: MutuasTableProps) {
  const getEstadoBadge = (activo: boolean) => {
    if (activo) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Activa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3" />
        Inactiva
      </span>
    );
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

  if (mutuas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <CheckCircle className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay mutuas registradas</p>
          <p className="text-sm">Comienza agregando una nueva mutua o seguro</p>
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
                Nombre Comercial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Razón Social
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CIF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
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
            {mutuas.map((mutua) => (
              <tr key={mutua._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {mutua.nombreComercial}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {mutua.razonSocial || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">
                    {mutua.cif}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {mutua.contacto?.telefono && (
                      <div className="mb-1">{mutua.contacto.telefono}</div>
                    )}
                    {mutua.contacto?.email && (
                      <div className="text-gray-600">{mutua.contacto.email}</div>
                    )}
                    {!mutua.contacto?.telefono && !mutua.contacto?.email && (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(mutua.activo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(mutua)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEditar && (
                      <button
                        onClick={() => onEditar(mutua)}
                        className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(mutua)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title={mutua.activo ? 'Desactivar' : 'Activar'}
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


