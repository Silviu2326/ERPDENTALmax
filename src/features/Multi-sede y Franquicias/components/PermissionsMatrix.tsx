import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Role, getAvailablePermissions } from '../api/rolesApi';

interface PermissionsMatrixProps {
  role: Role | null;
  onPermissionsChange: (permissions: string[]) => void;
}

export default function PermissionsMatrix({ role, onPermissionsChange }: PermissionsMatrixProps) {
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        const permissions = await getAvailablePermissions();
        setAvailablePermissions(permissions);

        // Agrupar permisos por módulo (ej: 'agenda.read' -> 'agenda')
        const grouped: Record<string, string[]> = {};
        permissions.forEach((perm) => {
          const [module] = perm.split('.');
          if (!grouped[module]) {
            grouped[module] = [];
          }
          grouped[module].push(perm);
        });
        setGroupedPermissions(grouped);
      } catch (error) {
        console.error('Error al cargar permisos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  useEffect(() => {
    if (role) {
      setSelectedPermissions(new Set(role.permissions));
    } else {
      setSelectedPermissions(new Set());
    }
  }, [role]);

  const togglePermission = (permission: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permission)) {
      newSelected.delete(permission);
    } else {
      newSelected.add(permission);
    }
    setSelectedPermissions(newSelected);
    onPermissionsChange(Array.from(newSelected));
  };

  const getPermissionLabel = (permission: string): string => {
    const parts = permission.split('.');
    if (parts.length === 2) {
      const [module, action] = parts;
      const actionLabels: Record<string, string> = {
        read: 'Leer',
        create: 'Crear',
        update: 'Actualizar',
        delete: 'Eliminar',
        manage: 'Gestionar',
        approve: 'Aprobar',
        export: 'Exportar',
      };
      const moduleLabels: Record<string, string> = {
        agenda: 'Agenda',
        pacientes: 'Pacientes',
        facturacion: 'Facturación',
        inventario: 'Inventario',
        reportes: 'Reportes',
        configuracion: 'Configuración',
        sedes: 'Sedes',
        roles: 'Roles',
      };
      return `${moduleLabels[module] || module}: ${actionLabels[action] || action}`;
    }
    return permission;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Cargando permisos...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Matriz de Permisos
        {role && <span className="text-sm font-normal text-gray-600 ml-2">- {role.name}</span>}
      </h3>

      {Object.keys(groupedPermissions).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay permisos disponibles en el sistema
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([module, permissions]) => (
            <div key={module} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                {module}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {permissions.map((permission) => {
                  const isSelected = selectedPermissions.has(permission);
                  return (
                    <button
                      key={permission}
                      onClick={() => togglePermission(permission)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-left">{getPermissionLabel(permission)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPermissions.size > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{selectedPermissions.size}</span> permiso(s) seleccionado(s)
          </p>
        </div>
      )}
    </div>
  );
}


