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
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-gray-600">Cargando roles...</div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Roles del Sistema</h3>
        <p className="text-gray-600 mb-4">No hay roles definidos en el sistema</p>
        <p className="text-sm text-gray-500">Crea un nuevo rol para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles del Sistema</h3>
      <div className="space-y-3">
        {roles.map((role) => {
          const isSelected = selectedRole?._id === role._id;
          return (
            <div
              key={role._id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-1"
                  onClick={() => onSelectRole(role)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-100 ring-1 ring-blue-200/70' : 'bg-gray-100'}`}>
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
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRole(role);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
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
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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



