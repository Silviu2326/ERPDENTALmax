import { Role } from '../api/rolesApi';
import { Shield, Lock } from 'lucide-react';

interface RolesListComponentProps {
  roles: Role[];
  rolSeleccionadoId: string | null;
  onRolSeleccionado: (rolId: string) => void;
  onNuevoRol: () => void;
}

export default function RolesListComponent({
  roles,
  rolSeleccionadoId,
  onRolSeleccionado,
  onNuevoRol,
}: RolesListComponentProps) {
  return (
    <div className="w-full md:w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Roles
          </h3>
        </div>
        <button
          onClick={onNuevoRol}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <span>+</span>
          <span>Nuevo Rol</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {roles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No hay roles creados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {roles.map((rol) => (
              <button
                key={rol._id}
                onClick={() => rol._id && onRolSeleccionado(rol._id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  rolSeleccionadoId === rol._id
                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className={`w-4 h-4 flex-shrink-0 ${
                        rolSeleccionadoId === rol._id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <h4 className="font-semibold text-gray-900 truncate">{rol.nombre}</h4>
                      {rol.isSystemRole && (
                        <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" title="Rol del sistema" />
                      )}
                    </div>
                    {rol.descripcion && (
                      <p className="text-xs text-gray-600 line-clamp-2">{rol.descripcion}</p>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      {rol.permisos?.length || 0} permiso{rol.permisos?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


