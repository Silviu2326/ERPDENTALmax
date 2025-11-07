import { useState, useEffect } from 'react';
import { Permissions, PermissionsSchema } from '../api/permisosApi';
import { Check, X } from 'lucide-react';

interface PermissionsMatrixProps {
  permissionsSchema: PermissionsSchema;
  permissions: Permissions;
  onPermissionsChange: (permissions: Permissions) => void;
  isLoading?: boolean;
}

export default function PermissionsMatrix({
  permissionsSchema,
  permissions,
  onPermissionsChange,
  isLoading = false,
}: PermissionsMatrixProps) {
  const [localPermissions, setLocalPermissions] = useState<Permissions>(permissions);

  useEffect(() => {
    setLocalPermissions(permissions);
  }, [permissions]);

  const handleTogglePermission = (module: string, action: string) => {
    const newPermissions = { ...localPermissions };
    if (!newPermissions[module]) {
      newPermissions[module] = {};
    }
    newPermissions[module][action] = !newPermissions[module][action];
    setLocalPermissions(newPermissions);
    onPermissionsChange(newPermissions);
  };

  const handleToggleModule = (module: string, enabled: boolean) => {
    const newPermissions = { ...localPermissions };
    if (!newPermissions[module]) {
      newPermissions[module] = {};
    }
    permissionsSchema[module].forEach((action) => {
      newPermissions[module][action] = enabled;
    });
    setLocalPermissions(newPermissions);
    onPermissionsChange(newPermissions);
  };

  const getModuleLabel = (module: string): string => {
    const labels: { [key: string]: string } = {
      agenda: 'Agenda de Citas',
      pacientes: 'Gestión de Pacientes',
      facturacion: 'Facturación y Cobros',
      presupuestos: 'Presupuestos y Planes',
      inventario: 'Inventario y Compras',
      proveedores: 'Proveedores y Almacén',
      mutuas: 'Mutuas y Seguros',
      informes: 'Cuadro de Mandos e Informes',
      documentacion: 'Documentación y Protocolos',
      radiologia: 'Integración Radiológica',
      portal: 'Portal de Cita Online',
      pagos: 'Pasarela de Pagos',
      seguridad: 'Seguridad y Cumplimiento',
    };
    return labels[module] || module;
  };

  const getActionLabel = (action: string): string => {
    const labels: { [key: string]: string } = {
      read: 'Ver',
      create: 'Crear',
      update: 'Editar',
      delete: 'Eliminar',
      generate_invoice: 'Generar Factura',
      export: 'Exportar',
      approve: 'Aprobar',
    };
    return labels[action] || action;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Cargando permisos...</p>
      </div>
    );
  }

  const modules = Object.keys(permissionsSchema);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Matriz de Permisos</h3>
        <p className="text-sm text-gray-500 mt-1">
          Seleccione los permisos para cada módulo y acción
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Módulo
              </th>
              {Object.values(permissionsSchema)[0]?.map((action) => (
                <th
                  key={action}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {getActionLabel(action)}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Todo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modules.map((module) => {
              const actions = permissionsSchema[module];
              const modulePermissions = localPermissions[module] || {};

              // Verificar si todos los permisos del módulo están habilitados
              const allEnabled = actions.every(
                (action) => modulePermissions[action] === true
              );
              const someEnabled = actions.some(
                (action) => modulePermissions[action] === true
              );

              return (
                <tr key={module} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {getModuleLabel(module)}
                    </span>
                  </td>
                  {actions.map((action) => {
                    const isEnabled = modulePermissions[action] === true;
                    return (
                      <td key={action} className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePermission(module, action)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-md border-2 transition-colors ${
                            isEnabled
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                          }`}
                          title={`${isEnabled ? 'Deshabilitar' : 'Habilitar'} ${getActionLabel(action)} para ${getModuleLabel(module)}`}
                        >
                          {isEnabled ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleModule(module, !allEnabled)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-md border-2 transition-colors ${
                        allEnabled
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : someEnabled
                          ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                          : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                      }`}
                      title={allEnabled ? 'Deshabilitar todo' : 'Habilitar todo'}
                    >
                      {allEnabled ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



