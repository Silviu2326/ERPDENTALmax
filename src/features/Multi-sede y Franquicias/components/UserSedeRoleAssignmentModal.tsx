import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Trash2 } from 'lucide-react';
import { Role, UserAssignment, CreateAssignmentData } from '../api/rolesApi';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Sede {
  _id: string;
  nombre: string;
}

interface UserSedeRoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sede: Sede | null;
  roles: Role[];
  assignments: UserAssignment[];
  onAssign: (assignmentData: CreateAssignmentData) => Promise<void>;
  onRemoveAssignment: (assignmentId: string) => Promise<void>;
  onSearchUsers: (query: string) => Promise<User[]>;
}

export default function UserSedeRoleAssignmentModal({
  isOpen,
  onClose,
  sede,
  roles,
  assignments,
  onAssign,
  onRemoveAssignment,
  onSearchUsers,
}: UserSedeRoleAssignmentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUser(null);
      setSelectedRole('');
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await onSearchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedRole || !sede) {
      alert('Por favor, selecciona un usuario y un rol');
      return;
    }

    // Verificar si ya existe una asignación para este usuario en esta sede
    const existingAssignment = assignments.find(
      (a) => a.userId === selectedUser._id && a.sedeId === sede._id
    );

    if (existingAssignment) {
      alert('Este usuario ya tiene un rol asignado en esta sede');
      return;
    }

    setAssigning(true);
    try {
      await onAssign({
        userId: selectedUser._id,
        roleId: selectedRole,
        sedeId: sede._id,
      });
      setSelectedUser(null);
      setSelectedRole('');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error al asignar rol:', error);
      alert('Error al asignar el rol. Por favor, intenta de nuevo.');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta asignación?')) {
      return;
    }

    try {
      await onRemoveAssignment(assignmentId);
    } catch (error) {
      console.error('Error al eliminar asignación:', error);
      alert('Error al eliminar la asignación. Por favor, intenta de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Asignar Usuarios a Roles</h2>
            {sede && (
              <p className="text-sm text-gray-600 mt-1">Sede: {sede.nombre}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Buscar y asignar usuario */}
          <div className="bg-slate-50 rounded-2xl ring-1 ring-slate-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Asignación</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buscar Usuario
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      placeholder="Buscar por nombre o email..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm ring-1 ring-blue-600/20 font-medium"
                  >
                    {searching ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-xl bg-white max-h-48 overflow-y-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          selectedUser?._id === user._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedUser && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{selectedUser.name}</div>
                        <div className="text-sm text-gray-600">{selectedUser.email}</div>
                      </div>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-red-600 hover:text-red-700 rounded-lg p-1 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar Rol
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAssign}
                disabled={!selectedUser || !selectedRole || assigning}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ring-1 ring-green-600/20 font-medium"
              >
                <UserPlus size={20} />
                <span>{assigning ? 'Asignando...' : 'Asignar Rol'}</span>
              </button>
            </div>
          </div>

          {/* Lista de asignaciones existentes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Asignaciones Actuales</h3>
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-xl">
                <p className="text-gray-600">No hay asignaciones en esta sede</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{assignment.user.name}</div>
                      <div className="text-sm text-gray-600">{assignment.user.email}</div>
                      <div className="mt-1">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg">
                          {assignment.role.name}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(assignment._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-4"
                      title="Eliminar asignación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



