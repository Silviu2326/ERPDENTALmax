import { useState, useEffect } from 'react';
import { Shield, AlertCircle, Trash2, Edit } from 'lucide-react';
import {
  Role,
  PermissionsByModule,
} from '../api/rolesApi';
import RolesListComponent from '../components/RolesListComponent';
import PermissionsMatrixComponent from '../components/PermissionsMatrixComponent';
import ModalGestionRol from '../components/ModalGestionRol';

export default function PermisosRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permisosPorModulo, setPermisosPorModulo] = useState<PermissionsByModule>({});
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalRol, setMostrarModalRol] = useState(false);
  const [rolEditando, setRolEditando] = useState<Role | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Datos falsos de roles
      const rolesData: Role[] = [
        {
          _id: '1',
          nombre: 'Administrador',
          descripcion: 'Acceso completo a todas las funcionalidades del módulo',
          permisos: ['proveedores:crear', 'proveedores:editar', 'proveedores:eliminar', 'proveedores:ver', 'almacenes:crear', 'almacenes:editar', 'almacenes:eliminar', 'almacenes:ver', 'productos:crear', 'productos:editar', 'productos:eliminar', 'productos:ver', 'transferencias:crear', 'transferencias:editar', 'transferencias:eliminar', 'transferencias:ver', 'recepcion:crear', 'recepcion:editar', 'recepcion:ver'],
          isSystemRole: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          _id: '2',
          nombre: 'Gestor de Almacén',
          descripcion: 'Puede gestionar almacenes, productos y transferencias',
          permisos: ['almacenes:crear', 'almacenes:editar', 'almacenes:ver', 'productos:crear', 'productos:editar', 'productos:ver', 'transferencias:crear', 'transferencias:editar', 'transferencias:ver', 'recepcion:crear', 'recepcion:ver'],
          isSystemRole: false,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-20T14:30:00Z',
        },
        {
          _id: '3',
          nombre: 'Gestor de Proveedores',
          descripcion: 'Puede gestionar proveedores y catálogo de productos',
          permisos: ['proveedores:crear', 'proveedores:editar', 'proveedores:ver', 'productos:crear', 'productos:editar', 'productos:ver'],
          isSystemRole: false,
          createdAt: '2024-01-20T09:00:00Z',
          updatedAt: '2024-03-10T11:15:00Z',
        },
        {
          _id: '4',
          nombre: 'Operador de Almacén',
          descripcion: 'Puede ver y registrar recepciones de mercancías',
          permisos: ['almacenes:ver', 'productos:ver', 'transferencias:ver', 'recepcion:crear', 'recepcion:ver'],
          isSystemRole: false,
          createdAt: '2024-02-01T08:00:00Z',
          updatedAt: '2024-02-15T16:45:00Z',
        },
        {
          _id: '5',
          nombre: 'Consulta',
          descripcion: 'Solo lectura de información',
          permisos: ['proveedores:ver', 'almacenes:ver', 'productos:ver', 'transferencias:ver', 'recepcion:ver'],
          isSystemRole: false,
          createdAt: '2024-02-10T10:00:00Z',
          updatedAt: '2024-02-10T10:00:00Z',
        },
      ];
      
      // Datos falsos de permisos agrupados por módulo
      const permisosData: PermissionsByModule = {
        'Proveedores': [
          { _id: 'proveedores:crear', clave: 'proveedores:crear', descripcion: 'Crear proveedores', modulo: 'Proveedores' },
          { _id: 'proveedores:editar', clave: 'proveedores:editar', descripcion: 'Editar proveedores', modulo: 'Proveedores' },
          { _id: 'proveedores:eliminar', clave: 'proveedores:eliminar', descripcion: 'Eliminar proveedores', modulo: 'Proveedores' },
          { _id: 'proveedores:ver', clave: 'proveedores:ver', descripcion: 'Ver proveedores', modulo: 'Proveedores' },
        ],
        'Almacenes': [
          { _id: 'almacenes:crear', clave: 'almacenes:crear', descripcion: 'Crear almacenes', modulo: 'Almacenes' },
          { _id: 'almacenes:editar', clave: 'almacenes:editar', descripcion: 'Editar almacenes', modulo: 'Almacenes' },
          { _id: 'almacenes:eliminar', clave: 'almacenes:eliminar', descripcion: 'Eliminar almacenes', modulo: 'Almacenes' },
          { _id: 'almacenes:ver', clave: 'almacenes:ver', descripcion: 'Ver almacenes', modulo: 'Almacenes' },
        ],
        'Productos': [
          { _id: 'productos:crear', clave: 'productos:crear', descripcion: 'Crear productos', modulo: 'Productos' },
          { _id: 'productos:editar', clave: 'productos:editar', descripcion: 'Editar productos', modulo: 'Productos' },
          { _id: 'productos:eliminar', clave: 'productos:eliminar', descripcion: 'Eliminar productos', modulo: 'Productos' },
          { _id: 'productos:ver', clave: 'productos:ver', descripcion: 'Ver productos', modulo: 'Productos' },
        ],
        'Transferencias': [
          { _id: 'transferencias:crear', clave: 'transferencias:crear', descripcion: 'Crear transferencias', modulo: 'Transferencias' },
          { _id: 'transferencias:editar', clave: 'transferencias:editar', descripcion: 'Editar transferencias', modulo: 'Transferencias' },
          { _id: 'transferencias:eliminar', clave: 'transferencias:eliminar', descripcion: 'Eliminar transferencias', modulo: 'Transferencias' },
          { _id: 'transferencias:ver', clave: 'transferencias:ver', descripcion: 'Ver transferencias', modulo: 'Transferencias' },
        ],
        'Recepción': [
          { _id: 'recepcion:crear', clave: 'recepcion:crear', descripcion: 'Registrar recepciones', modulo: 'Recepción' },
          { _id: 'recepcion:editar', clave: 'recepcion:editar', descripcion: 'Editar recepciones', modulo: 'Recepción' },
          { _id: 'recepcion:ver', clave: 'recepcion:ver', descripcion: 'Ver recepciones', modulo: 'Recepción' },
        ],
      };
      
      setRoles(rolesData);
      setPermisosPorModulo(permisosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleRolSeleccionado = async (rolId: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Buscar el rol en los datos actuales
      const rol = roles.find(r => r._id === rolId);
      if (rol) {
        setRolSeleccionado(rol);
      } else {
        setError('Rol no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el rol');
    }
  };

  const handleNuevoRol = () => {
    setRolEditando(null);
    setMostrarModalRol(true);
  };

  const handleEditarRol = (rol: Role) => {
    setRolEditando(rol);
    setMostrarModalRol(true);
  };

  const handleEliminarRol = async (rol: Role) => {
    if (!rol._id) return;

    if (rol.isSystemRole) {
      alert('No se pueden eliminar roles del sistema');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el rol "${rol.nombre}"?`)) {
      return;
    }

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simular eliminación
      console.log('Eliminando rol:', rol._id);
      if (rolSeleccionado?._id === rol._id) {
        setRolSeleccionado(null);
      }
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el rol');
    }
  };

  const handleGuardarPermisos = async (permisos: string[]) => {
    if (!rolSeleccionado?._id) return;

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      // Simular actualización
      console.log('Actualizando permisos del rol:', rolSeleccionado._id, permisos);
      
      // Actualizar el rol seleccionado localmente
      const rolActualizado = {
        ...rolSeleccionado,
        permisos,
      };
      setRolSeleccionado(rolActualizado);
      
      // Actualizar la lista de roles
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar los permisos');
    }
  };

  const handleRolGuardado = async () => {
    await cargarDatos();
    // Si se creó un nuevo rol, seleccionarlo
    if (rolEditando === null) {
      // Esperar a que se carguen los roles
      await new Promise(resolve => setTimeout(resolve, 100));
      if (roles.length > 0) {
        const ultimoRol = roles[roles.length - 1];
        if (ultimoRol._id) {
          await handleRolSeleccionado(ultimoRol._id);
        }
      }
    } else if (rolEditando._id) {
      // Si se editó un rol, mantenerlo seleccionado
      await handleRolSeleccionado(rolEditando._id);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Cargando roles y permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Asignación de Permisos y Roles
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Gestiona los roles y permisos del módulo de Proveedores y Almacén
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-6" style={{ minHeight: '600px' }}>
          {/* Lista de Roles */}
          <RolesListComponent
            roles={roles}
            rolSeleccionadoId={rolSeleccionado?._id || null}
            onRolSeleccionado={handleRolSeleccionado}
            onNuevoRol={handleNuevoRol}
          />

          {/* Matriz de Permisos */}
          <PermissionsMatrixComponent
            permisosPorModulo={permisosPorModulo}
            rol={rolSeleccionado}
            onGuardarPermisos={handleGuardarPermisos}
            loading={loading}
          />
        </div>

        {/* Acciones adicionales para el rol seleccionado */}
        {rolSeleccionado && (
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={() => handleEditarRol(rolSeleccionado)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar Rol
            </button>
            {!rolSeleccionado.isSystemRole && (
              <button
                onClick={() => handleEliminarRol(rolSeleccionado)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Rol
              </button>
            )}
          </div>
        )}

        {/* Modal de Gestión de Rol */}
        {mostrarModalRol && (
          <ModalGestionRol
            rol={rolEditando}
            onClose={() => {
              setMostrarModalRol(false);
              setRolEditando(null);
            }}
            onGuardado={handleRolGuardado}
          />
        )}
      </div>
    </div>
  );
}

