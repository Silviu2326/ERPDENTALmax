import { Role } from '../api/permisosApi';
import { Users, Trash2, Edit2 } from 'lucide-react';

interface RolesListProps {
  roles: Role[];
  rolSeleccionado: Role | null;
  onSeleccionarRol: (role: Role) => void;
  onEliminarRol: (roleId: string) => void;
  onEditarRol: (role: Role) => void;
  isLoading?: boolean;
}

export default function RolesList({
  roles,
  rolSeleccionado,
  onSeleccionarRol,
  onEliminarRol,
  onEditarRol,
  isLoading = false,
}: RolesListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Roles del Sistema
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {roles.length} {roles.length === 1 ? 'rol definido' : 'roles definidos'}
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando roles...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No hay roles definidos</p>
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role._id}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                rolSeleccionado?._id === role._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
              onClick={() => onSeleccionarRol(role)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  {role.description && (
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditarRol(role);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar rol"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`¿Está seguro de eliminar el rol "${role.name}"?`)) {
                        onEliminarRol(role._id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar rol"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



