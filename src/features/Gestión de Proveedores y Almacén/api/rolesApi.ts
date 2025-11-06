// API para gestión de roles y permisos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Permission {
  _id: string;
  clave: string;
  descripcion: string;
  modulo: string;
}

export interface Role {
  _id?: string;
  nombre: string;
  descripcion?: string;
  permisos: string[]; // Array de IDs de permisos
  isSystemRole?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionsByModule {
  [module: string]: Permission[];
}

// Obtener todos los roles
export async function obtenerRoles(): Promise<Role[]> {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los roles');
  }

  return response.json();
}

// Obtener un rol por ID
export async function obtenerRolPorId(id: string): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el rol');
  }

  return response.json();
}

// Crear un nuevo rol
export async function crearRol(rol: Omit<Role, '_id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(rol),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el rol' }));
    throw new Error(error.message || 'Error al crear el rol');
  }

  return response.json();
}

// Actualizar un rol existente
export async function actualizarRol(id: string, rol: Partial<Omit<Role, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(rol),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el rol' }));
    throw new Error(error.message || 'Error al actualizar el rol');
  }

  return response.json();
}

// Eliminar un rol
export async function eliminarRol(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar el rol' }));
    throw new Error(error.message || 'Error al eliminar el rol');
  }

  return response.json();
}

// Obtener todos los permisos disponibles, agrupados por módulo
export async function obtenerPermisos(): Promise<PermissionsByModule> {
  const response = await fetch(`${API_BASE_URL}/permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los permisos');
  }

  return response.json();
}


