import { useState, useEffect } from 'react';
import { Shield, Plus, Save, AlertCircle } from 'lucide-react';
import {
  obtenerRoles,
  crearRol,
  eliminarRol,
  obtenerPermisosRol,
  actualizarPermisosRol,
  obtenerEsquemaPermisos,
  Role,
  Permissions,
  PermissionsSchema,
} from '../api/permisosApi';
import RolesList from '../components/RolesList';
import PermissionsMatrix from '../components/PermissionsMatrix';
import RoleEditorModal from '../components/RoleEditorModal';

export default function GestionPermisosPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [permissionsSchema, setPermissionsSchema] = useState<PermissionsSchema>({});
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [rolParaEditar, setRolParaEditar] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar roles y esquema de permisos al montar el componente
  useEffect(() => {
    cargarRoles();
    cargarEsquemaPermisos();
  }, []);

  // Cargar permisos cuando se selecciona un rol
  useEffect(() => {
    if (rolSeleccionado) {
      cargarPermisosRol(rolSeleccionado._id);
    } else {
      setPermissions({});
    }
  }, [rolSeleccionado]);

  const cargarRoles = async () => {
    setIsLoadingRoles(true);
    setError(null);
    try {
      const rolesData = await obtenerRoles();
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los roles');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const cargarEsquemaPermisos = async () => {
    try {
      const schema = await obtenerEsquemaPermisos();
      setPermissionsSchema(schema);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el esquema de permisos');
    }
  };

  const cargarPermisosRol = async (roleId: string) => {
    setIsLoadingPermissions(true);
    setError(null);
    try {
      const permisos = await obtenerPermisosRol(roleId);
      setPermissions(permisos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los permisos del rol');
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleCrearRol = () => {
    setRolParaEditar(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditarRol = (role: Role) => {
    setRolParaEditar(role);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleGuardarRol = async (roleData: { name: string; description?: string }) => {
    try {
      if (modalMode === 'create') {
        const nuevoRol = await crearRol(roleData);
        setRoles([...roles, nuevoRol]);
        setSuccessMessage(`Rol "${roleData.name}" creado exitosamente`);
      } else if (rolParaEditar) {
        // En modo edición, actualizar el rol en la lista
        // Nota: La API actual no tiene un endpoint PUT para actualizar nombre/descripción
        // Por ahora, recargamos la lista
        await cargarRoles();
        setSuccessMessage(`Rol "${roleData.name}" actualizado exitosamente`);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  const handleEliminarRol = async (roleId: string) => {
    try {
      const role = roles.find((r) => r._id === roleId);
      await eliminarRol(roleId);
      setRoles(roles.filter((r) => r._id !== roleId));
      if (rolSeleccionado?._id === roleId) {
        setRolSeleccionado(null);
      }
      setSuccessMessage(`Rol "${role?.name}" eliminado exitosamente`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el rol');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleGuardarPermisos = async () => {
    if (!rolSeleccionado) return;

    setIsSaving(true);
    setError(null);
    try {
      await actualizarPermisosRol(rolSeleccionado._id, permissions);
      setSuccessMessage('Permisos actualizados exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar los permisos');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermissionsChange = (newPermissions: Permissions) => {
    setPermissions(newPermissions);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mensajes de éxito y error */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Permisos</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Administre los roles y permisos del sistema (RBAC)
                </p>
              </div>
            </div>
            <button
              onClick={handleCrearRol}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Rol</span>
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel lateral: Lista de roles */}
          <div className="lg:col-span-1">
            <RolesList
              roles={roles}
              rolSeleccionado={rolSeleccionado}
              onSeleccionarRol={setRolSeleccionado}
              onEliminarRol={handleEliminarRol}
              onEditarRol={handleEditarRol}
              isLoading={isLoadingRoles}
            />
          </div>

          {/* Panel principal: Matriz de permisos */}
          <div className="lg:col-span-2">
            {rolSeleccionado ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Permisos: {rolSeleccionado.name}
                      </h2>
                      {rolSeleccionado.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {rolSeleccionado.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleGuardarPermisos}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <PermissionsMatrix
                  permissionsSchema={permissionsSchema}
                  permissions={permissions}
                  onPermissionsChange={handlePermissionsChange}
                  isLoading={isLoadingPermissions}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Seleccione un rol
                </h3>
                <p className="text-sm text-gray-500">
                  Seleccione un rol de la lista para ver y editar sus permisos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear/editar rol */}
      <RoleEditorModal
        isOpen={isModalOpen}
        role={rolParaEditar}
        onClose={() => setIsModalOpen(false)}
        onSave={handleGuardarRol}
        mode={modalMode}
      />
    </div>
  );
}


