// API para transferencia de pacientes entre sedes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PacienteGlobal {
  _id: string;
  nombre: string;
  apellidos: string;
  documentoIdentidad?: string;
  telefono?: string;
  email?: string;
  sede_actual: {
    _id: string;
    nombre: string;
  };
  historial_sedes?: Array<{
    sede_id: string;
    fecha_transferencia: string;
    motivo?: string;
  }>;
}

export interface Sede {
  _id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  estado: 'activa' | 'inactiva';
}

export interface TransferenciaPacienteData {
  sede_destino_id: string;
  motivo?: string;
}

export interface PacienteTransferido extends PacienteGlobal {
  sede_actual: {
    _id: string;
    nombre: string;
  };
  historial_sedes: Array<{
    sede_id: string;
    fecha_transferencia: string;
    motivo?: string;
  }>;
}

/**
 * Busca pacientes en todas las sedes por término de búsqueda
 * @param termino - El nombre, DNI o ID del paciente a buscar
 * @returns Array de pacientes que coinciden con el término de búsqueda
 */
export async function buscarPacienteGlobal(termino: string): Promise<PacienteGlobal[]> {
  if (!termino || termino.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    termino: termino.trim(),
  });

  const response = await fetch(`${API_BASE_URL}/pacientes/buscar-global?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al buscar pacientes' }));
    throw new Error(error.message || 'Error al buscar pacientes en la red');
  }

  return response.json();
}

/**
 * Obtiene una lista de todas las sedes activas en el sistema
 * @returns Array de sedes activas
 */
export async function obtenerSedesActivas(): Promise<Sede[]> {
  const response = await fetch(`${API_BASE_URL}/sedes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener sedes' }));
    throw new Error(error.message || 'Error al obtener la lista de sedes');
  }

  const sedes = await response.json();
  // Filtrar solo las sedes activas
  return sedes.filter((sede: Sede) => sede.estado === 'activa');
}

/**
 * Ejecuta la transferencia del paciente a una nueva sede
 * @param pacienteId - ID del paciente a transferir
 * @param data - Datos de la transferencia (sede destino y motivo)
 * @returns El objeto del paciente actualizado con la nueva sede
 */
export async function transferirPacienteASede(
  pacienteId: string,
  data: TransferenciaPacienteData
): Promise<PacienteTransferido> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/transferir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al transferir paciente' }));
    throw new Error(error.message || 'Error al transferir el paciente a la nueva sede');
  }

  return response.json();
}


