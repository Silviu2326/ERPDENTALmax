import { Edit, Trash2, Eye, CheckCircle, XCircle, Loader2, Package } from 'lucide-react';
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
          <CheckCircle size={12} />
          Activa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle size={12} />
        Inactiva
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (mutuas.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay mutuas registradas</h3>
        <p className="text-gray-600 mb-4">Comienza agregando una nueva mutua o seguro</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Nombre Comercial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Razón Social
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                CIF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
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
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEditar && (
                      <button
                        onClick={() => onEditar(mutua)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(mutua)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
                        title={mutua.activo ? 'Desactivar' : 'Activar'}
                      >
                        <Trash2 size={16} />
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



