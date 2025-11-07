import { useState } from 'react';
import { Permission, PermissionsByModule, Role } from '../api/rolesApi';
import { Check, X, Save, AlertCircle } from 'lucide-react';

interface PermissionsMatrixComponentProps {
  permisosPorModulo: PermissionsByModule;
  rol: Role | null;
  onGuardarPermisos: (permisos: string[]) => Promise<void>;
  loading?: boolean;
}

export default function PermissionsMatrixComponent({
  permisosPorModulo,
  rol,
  onGuardarPermisos,
  loading = false,
}: PermissionsMatrixComponentProps) {
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<Set<string>>(
    new Set(rol?.permisos || [])
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleTogglePermiso = (permisoId: string) => {
    if (!rol || rol.isSystemRole) return; // No permitir modificar roles del sistema
    
    setPermisosSeleccionados((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(permisoId)) {
        nuevo.delete(permisoId);
      } else {
        nuevo.add(permisoId);
      }
      return nuevo;
    });
    setExito(false);
    setError(null);
  };

  const handleGuardar = async () => {
    if (!rol) return;

    setGuardando(true);
    setError(null);
    setExito(false);

    try {
      await onGuardarPermisos(Array.from(permisosSeleccionados));
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los permisos');
    } finally {
      setGuardando(false);
    }
  };

  if (!rol) {
    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm ring-1 ring-slate-200 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un rol</h3>
          <p className="text-gray-600">Selecciona un rol para gestionar sus permisos</p>
        </div>
      </div>
    );
  }

  const tieneCambios = JSON.stringify(Array.from(permisosSeleccionados).sort()) !== 
    JSON.stringify((rol.permisos || []).sort());

  const modulos = Object.keys(permisosPorModulo).sort();

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm ring-1 ring-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Permisos: {rol.nombre}</h3>
            {rol.descripcion && (
              <p className="text-sm text-gray-600 mt-1">{rol.descripcion}</p>
            )}
            {rol.isSystemRole && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Rol del sistema - permisos limitados
              </p>
            )}
          </div>
          <button
            onClick={handleGuardar}
            disabled={!tieneCambios || guardando || loading || rol.isSystemRole}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tieneCambios && !guardando && !loading && !rol.isSystemRole
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-600/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {exito && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            Permisos guardados correctamente
          </div>
        )}
      </div>

      {/* Matriz de permisos */}
      <div className="flex-1 overflow-y-auto p-4">
        {modulos.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay permisos disponibles</h3>
            <p className="text-gray-600">No se encontraron permisos para mostrar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {modulos.map((modulo) => {
              const permisos = permisosPorModulo[modulo];
              const todosSeleccionados = permisos.every((p) => permisosSeleccionados.has(p._id));
              const algunosSeleccionados = permisos.some((p) => permisosSeleccionados.has(p._id));

              const handleToggleModulo = () => {
                if (rol.isSystemRole) return;
                
                if (todosSeleccionados) {
                  // Deseleccionar todos
                  setPermisosSeleccionados((prev) => {
                    const nuevo = new Set(prev);
                    permisos.forEach((p) => nuevo.delete(p._id));
                    return nuevo;
                  });
                } else {
                  // Seleccionar todos
                  setPermisosSeleccionados((prev) => {
                    const nuevo = new Set(prev);
                    permisos.forEach((p) => nuevo.add(p._id));
                    return nuevo;
                  });
                }
                setExito(false);
                setError(null);
              };

              return (
                <div key={modulo} className="border border-gray-200 rounded-xl overflow-hidden ring-1 ring-slate-200">
                  <div className="bg-slate-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{modulo}</h4>
                      <button
                        onClick={handleToggleModulo}
                        disabled={rol.isSystemRole}
                        className={`text-xs px-3 py-1.5 rounded-xl transition-all font-medium ${
                          rol.isSystemRole
                            ? 'text-gray-400 cursor-not-allowed'
                            : todosSeleccionados
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : algunosSeleccionados
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {todosSeleccionados
                          ? 'Deseleccionar todos'
                          : 'Seleccionar todos'}
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {permisos.map((permiso) => {
                      const estaSeleccionado = permisosSeleccionados.has(permiso._id);
                      return (
                        <div
                          key={permiso._id}
                          className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                            estaSeleccionado ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {permiso.clave}
                              </span>
                              {estaSeleccionado && (
                                <Check className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            {permiso.descripcion && (
                              <p className="text-sm text-gray-600 mt-1">
                                {permiso.descripcion}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleTogglePermiso(permiso._id)}
                            disabled={rol.isSystemRole}
                            className={`ml-4 p-2 rounded-xl transition-all ${
                              rol.isSystemRole
                                ? 'cursor-not-allowed opacity-50'
                                : estaSeleccionado
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={estaSeleccionado ? 'Deseleccionar' : 'Seleccionar'}
                          >
                            {estaSeleccionado ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}



