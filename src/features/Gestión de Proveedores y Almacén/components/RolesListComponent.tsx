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
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm ring-1 ring-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Roles
          </h3>
        </div>
        <button
          onClick={onNuevoRol}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 text-sm font-medium"
        >
          <span>+</span>
          <span>Nuevo Rol</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {roles.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay roles creados</h3>
            <p className="text-gray-600 mb-4 text-sm">Crea un nuevo rol para comenzar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roles.map((rol) => (
              <button
                key={rol._id}
                onClick={() => rol._id && onRolSeleccionado(rol._id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  rolSeleccionadoId === rol._id
                    ? 'bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 ring-1 ring-slate-200'
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
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{rol.descripcion}</p>
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



