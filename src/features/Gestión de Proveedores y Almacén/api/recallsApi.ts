// API para gestión de circuitos automáticos (recalls)
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface RecallCircuit {
  _id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  trigger: {
    type: string;
    details: {
      treatmentId?: string;
      appointmentType?: string;
    };
    daysAfter: number;
  };
  communicationSequence: Array<{
    step: number;
    channel: 'email' | 'sms' | 'whatsapp';
    templateId?: string;
    delayDays: number;
  }>;
  createdBy?: string;
  clinicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecallLog {
  _id?: string;
  recallCircuitId: string;
  patientId: string;
  communicationStep: number;
  channel: 'email' | 'sms' | 'whatsapp';
  status: 'sent' | 'failed' | 'pending';
  sentAt?: string;
  errorDetails?: string;
  appointmentBookedId?: string;
}

export interface RecallStats {
  totalCircuits: number;
  activeCircuits: number;
  totalMessagesSent: number;
  appointmentsBooked: number;
  conversionRate: number;
  messagesByChannel: {
    email: number;
    sms: number;
    whatsapp: number;
  };
}

export interface PatientPreview {
  _id: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  ultimaCita?: string;
  ultimoTratamiento?: string;
}

export interface PreviewPatientsResponse {
  patients: PatientPreview[];
  total: number;
  page: number;
  limit: number;
}

// Obtener todos los circuitos de recall
export async function obtenerCircuitosRecall(status?: 'active' | 'inactive'): Promise<RecallCircuit[]> {
  const params = new URLSearchParams();
  if (status) {
    params.append('status', status);
  }

  const response = await fetch(`${API_BASE_URL}/recalls?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los circuitos de recall');
  }

  return response.json();
}

// Obtener un circuito de recall por ID
export async function obtenerCircuitoRecallPorId(id: string): Promise<RecallCircuit> {
  const response = await fetch(`${API_BASE_URL}/recalls/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el circuito de recall');
  }

  return response.json();
}

// Crear un nuevo circuito de recall
export async function crearCircuitoRecall(circuito: Omit<RecallCircuit, '_id' | 'createdAt' | 'updatedAt'>): Promise<RecallCircuit> {
  const response = await fetch(`${API_BASE_URL}/recalls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(circuito),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el circuito de recall' }));
    throw new Error(error.message || 'Error al crear el circuito de recall');
  }

  return response.json();
}

// Actualizar un circuito de recall
export async function actualizarCircuitoRecall(id: string, circuito: Partial<RecallCircuit>): Promise<RecallCircuit> {
  const response = await fetch(`${API_BASE_URL}/recalls/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(circuito),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el circuito de recall' }));
    throw new Error(error.message || 'Error al actualizar el circuito de recall');
  }

  return response.json();
}

// Eliminar un circuito de recall
export async function eliminarCircuitoRecall(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recalls/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el circuito de recall');
  }
}

// Obtener vista previa de pacientes elegibles para un circuito
export async function obtenerPacientesElegibles(
  id: string,
  page: number = 1,
  limit: number = 20
): Promise<PreviewPatientsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/recalls/${id}/preview-patients?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los pacientes elegibles');
  }

  return response.json();
}

// Obtener estadísticas de rendimiento de los circuitos
export async function obtenerEstadisticasRecalls(): Promise<RecallStats> {
  const response = await fetch(`${API_BASE_URL}/recalls/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las estadísticas de recalls');
  }

  return response.json();
}

// Obtener logs de recall para un circuito
export async function obtenerLogsRecall(circuitId: string, page: number = 1, limit: number = 50): Promise<{
  logs: RecallLog[];
  total: number;
  page: number;
  limit: number;
}> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/recalls/${circuitId}/logs?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los logs de recall');
  }

  return response.json();
}



