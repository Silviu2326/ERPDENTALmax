import { Edit, Trash2, Users } from 'lucide-react';
import { Role } from '../api/rolesApi';

interface RolesListProps {
  roles: Role[];
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
  loading?: boolean;
}

export default function RolesList({
  roles,
  selectedRole,
  onSelectRole,
  onEditRole,
  onDeleteRole,
  loading = false,
}: RolesListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8 text-gray-500">Cargando roles...</div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Roles del Sistema</h3>
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No hay roles definidos en el sistema</p>
          <p className="text-sm mt-2">Crea un nuevo rol para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Roles del Sistema</h3>
      <div className="space-y-2">
        {roles.map((role) => {
          const isSelected = selectedRole?._id === role._id;
          return (
            <div
              key={role._id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-1"
                  onClick={() => onSelectRole(role)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Users className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{role.name}</h4>
                      {role.description && (
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      )}
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-xs text-gray-500">
                          {role.permissions.length} permiso(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRole(role);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar rol"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`)) {
                        onDeleteRole(role);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar rol"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


