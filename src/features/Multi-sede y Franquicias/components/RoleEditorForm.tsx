import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Role, CreateRoleData, UpdateRoleData } from '../api/rolesApi';

interface RoleEditorFormProps {
  role: Role | null;
  onSave: (roleData: CreateRoleData | UpdateRoleData) => Promise<void>;
  onCancel: () => void;
  permissions: string[];
}

export default function RoleEditorForm({
  role,
  onSave,
  onCancel,
  permissions,
}: RoleEditorFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || '');
      setSelectedPermissions(new Set(role.permissions));
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions(new Set());
    }
    setErrors({});
  }, [role]);

  const togglePermission = (permission: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permission)) {
      newSelected.delete(permission);
    } else {
      newSelected.add(permission);
    }
    setSelectedPermissions(newSelected);
  };

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'El nombre del rol es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const roleData = {
        name: name.trim(),
        description: description.trim(),
        permissions: Array.from(selectedPermissions),
      };
      await onSave(roleData);
    } catch (error) {
      console.error('Error al guardar rol:', error);
      alert('Error al guardar el rol. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {role ? 'Editar Rol' : 'Nuevo Rol'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Rol *
          </label>
          <input
            id="role-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Recepcionista, Odontólogo, Director de Clínica"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="role-description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="role-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe las responsabilidades y funciones de este rol"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Permisos ({selectedPermissions.size} seleccionados)
          </label>
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
            {permissions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay permisos disponibles
              </p>
            ) : (
              permissions.map((permission) => {
                const isSelected = selectedPermissions.has(permission);
                return (
                  <label
                    key={permission}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePermission(permission)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{getPermissionLabel(permission)}</span>
                  </label>
                );
              })}
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


