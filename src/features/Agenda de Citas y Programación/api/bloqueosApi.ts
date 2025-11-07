// API para gestión de bloqueos de sala y horarios
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Bloqueo {
  _id?: string;
  sede: {
    _id: string;
    nombre: string;
  };
  tipo: 'SALA' | 'PROFESIONAL';
  recursoId: {
    _id: string;
    nombre?: string;
    apellidos?: string;
    numero?: string;
    nombreCompleto?: string;
  };
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  motivo: string;
  esDiaCompleto: boolean;
  recurrencia?: {
    tipo: 'diaria' | 'semanal' | 'mensual';
    frecuencia: number;
    finFecha?: string;
    finOcurrencias?: number;
    diasSemana?: number[]; // 0-6 (domingo-sábado)
    diaMes?: number; // 1-31
  };
  creadoPor?: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevoBloqueo {
  sedeId: string;
  tipo: 'SALA' | 'PROFESIONAL';
  recursoId: string;
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  motivo: string;
  esDiaCompleto: boolean;
  recurrencia?: {
    tipo: 'diaria' | 'semanal' | 'mensual';
    frecuencia: number;
    finFecha?: string;
    finOcurrencias?: number;
    diasSemana?: number[];
    diaMes?: number;
  };
}

export interface FiltrosBloqueos {
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  sedeId?: string;
  recursoId?: string;
  tipo?: 'SALA' | 'PROFESIONAL';
}

export interface Sala {
  _id: string;
  numero: string;
  nombre?: string;
  sede: {
    _id: string;
    nombre: string;
  };
}

// Obtener bloqueos con filtros
export async function obtenerBloqueos(filtros: FiltrosBloqueos): Promise<Bloqueo[]> {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }
  if (filtros.recursoId) {
    params.append('recursoId', filtros.recursoId);
  }
  if (filtros.tipo) {
    params.append('tipo', filtros.tipo);
  }

  const response = await fetch(`${API_BASE_URL}/bloqueos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los bloqueos');
  }

  return response.json();
}

// Crear un nuevo bloqueo
export async function crearBloqueo(bloqueo: NuevoBloqueo): Promise<Bloqueo> {
  const response = await fetch(`${API_BASE_URL}/bloqueos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bloqueo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el bloqueo');
  }

  return response.json();
}

// Actualizar un bloqueo existente
export async function actualizarBloqueo(id: string, bloqueo: Partial<NuevoBloqueo>): Promise<Bloqueo> {
  const response = await fetch(`${API_BASE_URL}/bloqueos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bloqueo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el bloqueo');
  }

  return response.json();
}

// Eliminar un bloqueo
export async function eliminarBloqueo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bloqueos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el bloqueo');
  }
}

// Obtener lista de salas/boxes disponibles
export async function obtenerSalas(sedeId?: string): Promise<Sala[]> {
  const params = new URLSearchParams();
  if (sedeId) {
    params.append('sedeId', sedeId);
  }

  const url = sedeId
    ? `${API_BASE_URL}/salas?${params.toString()}`
    : `${API_BASE_URL}/salas`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las salas');
  }

  return response.json();
}

// Validar conflicto con citas existentes
export async function validarConflictoConCitas(
  tipo: 'SALA' | 'PROFESIONAL',
  recursoId: string,
  fechaInicio: string,
  fechaFin: string
): Promise<{ tieneConflicto: boolean; citasConflictivas?: Array<{ _id: string; fecha_hora_inicio: string }> }> {
  const response = await fetch(`${API_BASE_URL}/bloqueos/validar-conflicto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      tipo,
      recursoId,
      fechaInicio,
      fechaFin,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al validar conflictos');
  }

  return response.json();
}



