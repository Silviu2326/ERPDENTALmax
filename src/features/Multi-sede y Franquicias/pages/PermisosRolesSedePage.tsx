import { useState, useEffect } from 'react';
import { Plus, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import {
  getAllRoles,
  createRole,
  updateRole,
  getAssignmentsBySede,
  createAssignment,
  deleteAssignment,
  getAvailablePermissions,
  searchUsers,
  getAllSedes,
  Role,
  UserAssignment,
  CreateRoleData,
  UpdateRoleData,
  CreateAssignmentData,
  User,
  Sede,
} from '../api/rolesApi';
import RolesList from '../components/RolesList';
import PermissionsMatrix from '../components/PermissionsMatrix';
import RoleEditorForm from '../components/RoleEditorForm';
import UserSedeRoleAssignmentModal from '../components/UserSedeRoleAssignmentModal';

export default function PermisosRolesSedePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedSede) {
      loadAssignments();
    } else {
      setAssignments([]);
    }
  }, [selectedSede]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rolesData, sedesData, permissionsData] = await Promise.all([
        getAllRoles(),
        getAllSedes(),
        getAvailablePermissions(),
      ]);
      setRoles(rolesData);
      setSedes(sedesData);
      setAvailablePermissions(permissionsData);
      if (sedesData.length > 0) {
        setSelectedSede(sedesData[0]);
      }
    } catch (err) {
      console.error('Error al cargar datos iniciales:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar los datos. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    if (!selectedSede) return;

    try {
      const assignmentsData = await getAssignmentsBySede(selectedSede._id);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error('Error al cargar asignaciones:', err);
      setError('Error al cargar las asignaciones de la sede');
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowRoleEditor(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleEditor(true);
  };

  const handleDeleteRole = async (role: Role) => {
    try {
      // TODO: Implementar deleteRole en la API si es necesario
      // Por ahora, solo actualizamos la lista localmente
      setRoles(roles.filter((r) => r._id !== role._id));
      if (selectedRole?._id === role._id) {
        setSelectedRole(null);
      }
    } catch (err) {
      console.error('Error al eliminar rol:', err);
      alert('Error al eliminar el rol. Por favor, intenta de nuevo.');
    }
  };

  const handleSaveRole = async (roleData: CreateRoleData | UpdateRoleData) => {
    try {
      if (editingRole) {
        const updatedRole = await updateRole(editingRole._id, roleData as UpdateRoleData);
        setRoles(roles.map((r) => (r._id === updatedRole._id ? updatedRole : r)));
        if (selectedRole?._id === updatedRole._id) {
          setSelectedRole(updatedRole);
        }
      } else {
        const newRole = await createRole(roleData as CreateRoleData);
        setRoles([...roles, newRole]);
        setSelectedRole(newRole);
      }
      setShowRoleEditor(false);
      setEditingRole(null);
    } catch (err) {
      console.error('Error al guardar rol:', err);
      throw err;
    }
  };

  const handlePermissionsChange = async (permissions: string[]) => {
    if (!selectedRole) return;

    try {
      const updatedRole = await updateRole(selectedRole._id, { permissions });
      setRoles(roles.map((r) => (r._id === updatedRole._id ? updatedRole : r)));
      setSelectedRole(updatedRole);
    } catch (err) {
      console.error('Error al actualizar permisos:', err);
      alert('Error al actualizar los permisos. Por favor, intenta de nuevo.');
    }
  };

  const handleAssignUser = async (assignmentData: CreateAssignmentData) => {
    try {
      const newAssignment = await createAssignment(assignmentData);
      setAssignments([...assignments, newAssignment]);
    } catch (err) {
      console.error('Error al asignar usuario:', err);
      throw err;
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId);
      setAssignments(assignments.filter((a) => a._id !== assignmentId));
    } catch (err) {
      console.error('Error al eliminar asignación:', err);
      throw err;
    }
  };

  const handleSearchUsers = async (query: string): Promise<User[]> => {
    try {
      return await searchUsers(query);
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando permisos y roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Permisos y Roles por Sede</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gestiona los roles de trabajo y permisos de acceso por sede
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateRole}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Rol</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Selector de Sede */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Sede
          </label>
          <select
            value={selectedSede?._id || ''}
            onChange={(e) => {
              const sede = sedes.find((s) => s._id === e.target.value);
              setSelectedSede(sede || null);
            }}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona una sede</option>
            {sedes.map((sede) => (
              <option key={sede._id} value={sede._id}>
                {sede.nombre}
              </option>
            ))}
          </select>
          {selectedSede && (
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Asignar Usuario</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lista de Roles */}
          <RolesList
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
            loading={loading}
          />

          {/* Matriz de Permisos o Editor de Rol */}
          {showRoleEditor ? (
            <RoleEditorForm
              role={editingRole}
              onSave={handleSaveRole}
              onCancel={() => {
                setShowRoleEditor(false);
                setEditingRole(null);
              }}
              permissions={availablePermissions}
            />
          ) : (
            <PermissionsMatrix
              role={selectedRole}
              onPermissionsChange={handlePermissionsChange}
            />
          )}
        </div>

        {/* Lista de Asignaciones por Sede */}
        {selectedSede && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Asignaciones en {selectedSede.nombre}
            </h3>
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay asignaciones en esta sede
              </div>
            ) : (
              <div className="space-y-2">
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{assignment.user.name}</div>
                      <div className="text-sm text-gray-600">{assignment.user.email}</div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                        {assignment.role.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(assignment._id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar asignación"
                    >
                      <span className="text-sm">Eliminar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de Asignación */}
        {selectedSede && (
          <UserSedeRoleAssignmentModal
            isOpen={showAssignmentModal}
            onClose={() => setShowAssignmentModal(false)}
            sede={selectedSede}
            roles={roles}
            assignments={assignments}
            onAssign={handleAssignUser}
            onRemoveAssignment={handleRemoveAssignment}
            onSearchUsers={handleSearchUsers}
          />
        )}
      </div>
    </div>
  );
}


