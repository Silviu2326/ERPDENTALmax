// API para gestión de roles y asignaciones de permisos por sede
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAssignment {
  _id: string;
  userId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  roleId: string;
  role: Role;
  sedeId: string;
  sede: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface CreateAssignmentData {
  userId: string;
  roleId: string;
  sedeId: string;
}

/**
 * Obtiene todos los roles definidos en el sistema con sus permisos
 */
export async function getAllRoles(): Promise<Role[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener roles: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getAllRoles:', error);
    throw error;
  }
}

/**
 * Crea un nuevo rol en el sistema
 */
export async function createRole(roleData: CreateRoleData): Promise<Role> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear rol: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en createRole:', error);
    throw error;
  }
}

/**
 * Actualiza un rol existente, incluyendo su nombre, descripción y lista de permisos
 */
export async function updateRole(roleId: string, roleData: UpdateRoleData): Promise<Role> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar rol: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en updateRole:', error);
    throw error;
  }
}

/**
 * Obtiene todos los usuarios y sus roles asignados para una sede específica
 */
export async function getAssignmentsBySede(sedeId: string): Promise<UserAssignment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sedes/${sedeId}/roles-asignaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener asignaciones: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getAssignmentsBySede:', error);
    throw error;
  }
}

/**
 * Asigna un rol específico a un usuario en una sede determinada
 */
export async function createAssignment(assignmentData: CreateAssignmentData): Promise<UserAssignment> {
  try {
    const response = await fetch(`${API_BASE_URL}/asignaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear asignación: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en createAssignment:', error);
    throw error;
  }
}

/**
 * Elimina la asignación de un rol a un usuario en una sede
 */
export async function deleteAssignment(assignmentId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/asignaciones/${assignmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al eliminar asignación: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error en deleteAssignment:', error);
    throw error;
  }
}

/**
 * Obtiene la lista de permisos disponibles en el sistema
 */
export async function getAvailablePermissions(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener permisos: ${response.statusText}`);
    }

    const data = await response.json();
    return data.permissions || [];
  } catch (error) {
    console.error('Error en getAvailablePermissions:', error);
    throw error;
  }
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

/**
 * Busca usuarios por nombre o email
 */
export async function searchUsers(query: string): Promise<User[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query.trim(),
    });

    const response = await fetch(`${API_BASE_URL}/users/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al buscar usuarios: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en searchUsers:', error);
    throw error;
  }
}

export interface Sede {
  _id: string;
  nombre: string;
}

/**
 * Obtiene todas las sedes disponibles
 */
export async function getAllSedes(): Promise<Sede[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sedes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener sedes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getAllSedes:', error);
    throw error;
  }
}

