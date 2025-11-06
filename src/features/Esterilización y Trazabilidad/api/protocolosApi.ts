// API para gestión de protocolos de limpieza y desinfección
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface VersionProtocolo {
  version: number;
  contenido: string;
  fecha: string;
  autor: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
}

export interface LecturaConfirmada {
  usuario: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  version: number;
  fecha: string;
}

export interface Protocolo {
  _id: string;
  titulo: string;
  categoria: string;
  versionActual: number;
  activo: boolean;
  sedes: Array<{
    _id: string;
    nombre: string;
  }>;
  autor: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  versiones: VersionProtocolo[];
  lecturasConfirmadas?: LecturaConfirmada[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevoProtocolo {
  titulo: string;
  categoria: string;
  contenido: string;
  sedesAsignadas: string[];
}

export interface ActualizarProtocolo {
  titulo?: string;
  contenido: string;
}

export interface FiltrosProtocolos {
  categoria?: string;
  sedeId?: string;
  noLeidos?: boolean;
}

// Obtener lista de protocolos
export async function obtenerProtocolos(filtros: FiltrosProtocolos = {}): Promise<Protocolo[]> {
  const params = new URLSearchParams();
  
  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }
  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }
  if (filtros.noLeidos !== undefined) {
    params.append('noLeidos', filtros.noLeidos.toString());
  }

  const response = await fetch(`${API_BASE_URL}/esterilizacion/protocolos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los protocolos');
  }

  return response.json();
}

// Obtener detalle de un protocolo específico
export async function obtenerProtocoloPorId(id: string): Promise<Protocolo> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/protocolos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el protocolo');
  }

  return response.json();
}

// Crear un nuevo protocolo
export async function crearProtocolo(protocolo: NuevoProtocolo): Promise<Protocolo> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/protocolos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(protocolo),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el protocolo' }));
    throw new Error(error.message || 'Error al crear el protocolo');
  }

  return response.json();
}

// Actualizar un protocolo existente (crea nueva versión)
export async function actualizarProtocolo(
  id: string,
  datos: ActualizarProtocolo
): Promise<Protocolo> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/protocolos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el protocolo' }));
    throw new Error(error.message || 'Error al actualizar el protocolo');
  }

  return response.json();
}

// Archivar un protocolo
export async function archivarProtocolo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/protocolos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al archivar el protocolo' }));
    throw new Error(error.message || 'Error al archivar el protocolo');
  }
}

// Confirmar lectura de un protocolo
export async function confirmarLecturaProtocolo(
  id: string,
  version: number
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/protocolos/${id}/confirmar-lectura`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ version }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al confirmar la lectura' }));
    throw new Error(error.message || 'Error al confirmar la lectura');
  }

  return response.json();
}


