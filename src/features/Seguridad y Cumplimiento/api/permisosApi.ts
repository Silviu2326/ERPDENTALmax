// API para gestión de permisos y roles
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Role {
  _id: string;
  name: string;
  description?: string;
}

export interface Permissions {
  [module: string]: {
    [action: string]: boolean;
  };
}

export interface PermissionsSchema {
  [module: string]: string[];
}

// Obtener todos los roles
export async function obtenerRoles(): Promise<Role[]> {
  const response = await fetch(`${API_BASE_URL}/security/roles`, {
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

// Crear un nuevo rol
export async function crearRol(role: { name: string; description?: string }): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/security/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(role),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el rol');
  }

  return response.json();
}

// Obtener permisos de un rol específico
export async function obtenerPermisosRol(roleId: string): Promise<Permissions> {
  const response = await fetch(`${API_BASE_URL}/security/roles/${roleId}/permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los permisos del rol');
  }

  return response.json();
}

// Actualizar permisos de un rol
export async function actualizarPermisosRol(
  roleId: string,
  permissions: Permissions
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/security/roles/${roleId}/permissions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ permissions }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar los permisos del rol');
  }

  return response.json();
}

// Eliminar un rol
export async function eliminarRol(roleId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/security/roles/${roleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el rol');
  }

  return response.json();
}

// Obtener el esquema completo de permisos
export async function obtenerEsquemaPermisos(): Promise<PermissionsSchema> {
  const response = await fetch(`${API_BASE_URL}/security/permissions-schema`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el esquema de permisos');
  }

  return response.json();
}


