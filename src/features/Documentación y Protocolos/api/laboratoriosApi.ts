// API para gestión de laboratorios
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Laboratorio {
  _id: string;
  nombre: string;
  cif?: string;
  direccion?: string;
  personaContacto?: string;
  email?: string;
  telefono?: string;
  activo: boolean;
}

// Obtener lista de laboratorios
export async function obtenerLaboratorios(activos?: boolean): Promise<Laboratorio[]> {
  const params = new URLSearchParams();
  if (activos !== undefined) {
    params.append('activos', activos.toString());
  }

  const url = `${API_BASE_URL}/laboratorios${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la lista de laboratorios');
  }

  return response.json();
}

// Obtener un laboratorio por ID
export async function obtenerLaboratorioPorId(id: string): Promise<Laboratorio> {
  const response = await fetch(`${API_BASE_URL}/laboratorios/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el laboratorio');
  }

  return response.json();
}

// Crear nuevo laboratorio
export async function crearLaboratorio(laboratorio: Omit<Laboratorio, '_id'>): Promise<Laboratorio> {
  const response = await fetch(`${API_BASE_URL}/laboratorios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(laboratorio),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el laboratorio' }));
    throw new Error(error.message || 'Error al crear el laboratorio');
  }

  return response.json();
}

// Actualizar laboratorio
export async function actualizarLaboratorio(
  id: string,
  datos: Partial<Omit<Laboratorio, '_id'>>
): Promise<Laboratorio> {
  const response = await fetch(`${API_BASE_URL}/laboratorios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el laboratorio');
  }

  return response.json();
}

// Eliminar laboratorio
export async function eliminarLaboratorio(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/laboratorios/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el laboratorio');
  }
}



