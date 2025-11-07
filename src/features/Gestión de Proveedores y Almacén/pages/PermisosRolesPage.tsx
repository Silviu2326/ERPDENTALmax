import { useState, useEffect } from 'react';
import { Shield, AlertCircle, Trash2, Edit, Loader2 } from 'lucide-react';
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
  const [rolIdPendienteSeleccion, setRolIdPendienteSeleccion] = useState<string | null>(null);

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

  // Efecto para seleccionar rol pendiente después de cargar datos
  useEffect(() => {
    if (rolIdPendienteSeleccion && roles.length > 0) {
      const rol = roles.find(r => r._id === rolIdPendienteSeleccion);
      if (rol) {
        setRolSeleccionado(rol);
        setRolIdPendienteSeleccion(null);
      } else if (rolIdPendienteSeleccion === 'ultimo') {
        // Si es 'ultimo', seleccionar el último rol
        const ultimoRol = roles[roles.length - 1];
        if (ultimoRol?._id) {
          setRolSeleccionado(ultimoRol);
          setRolIdPendienteSeleccion(null);
        }
      }
    }
  }, [roles, rolIdPendienteSeleccion]);

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
    const rolIdAGuardar = rolEditando?._id;
    await cargarDatos();
    
    // Marcar el rol que debe seleccionarse después de que se actualicen los roles
    if (rolIdAGuardar) {
      // Si se editó un rol, mantenerlo seleccionado
      setRolIdPendienteSeleccion(rolIdAGuardar);
    } else {
      // Si se creó un nuevo rol, seleccionar el último
      setRolIdPendienteSeleccion('ultimo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Shield size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Asignación de Permisos y Roles
                  </h1>
                  <p className="text-gray-600">
                    Gestiona los roles y permisos del módulo de Proveedores y Almacén
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando roles y permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Shield size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Asignación de Permisos y Roles
                </h1>
                <p className="text-gray-600">
                  Gestiona los roles y permisos del módulo de Proveedores y Almacén
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-lg p-4 border border-red-200 bg-red-50 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: '600px' }}>
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
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEditarRol(rolSeleccionado)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
              >
                <Edit size={20} />
                Editar Rol
              </button>
              {!rolSeleccionado.isSystemRole && (
                <button
                  onClick={() => handleEliminarRol(rolSeleccionado)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700 shadow-sm ring-1 ring-red-600/20"
                >
                  <Trash2 size={20} />
                  Eliminar Rol
                </button>
              )}
            </div>
          )}
        </div>
      </div>

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
  );
}

