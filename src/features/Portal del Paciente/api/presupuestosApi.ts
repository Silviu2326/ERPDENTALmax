// API para gestión de presupuestos del Portal del Paciente
// Endpoints: /api/portal/presupuestos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ItemPresupuesto {
  tratamiento: {
    _id: string;
    nombre: string;
    descripcion?: string;
  };
  descripcion: string;
  precioUnitario: number;
  cantidad: number;
  descuento: number;
  subtotal: number;
}

export interface PresupuestoPaciente {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  dentista: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaCreacion: string;
  fechaExpiracion?: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Expirado';
  items: ItemPresupuesto[];
  totalNeto: number;
  totalDescuento: number;
  totalFinal: number;
  notasClinica?: string;
  notasPaciente?: string;
  fechaDecision?: string;
}

export interface PresupuestoResumen {
  _id: string;
  fechaCreacion: string;
  fechaExpiracion?: string;
  totalFinal: number;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Expirado';
}

/**
 * Obtiene la lista de todos los presupuestos (resumen) asociados al paciente autenticado
 * GET /api/portal/presupuestos
 */
export async function obtenerMisPresupuestos(): Promise<PresupuestoResumen[]> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/presupuestos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los presupuestos' }));
    throw new Error(error.message || 'Error al obtener los presupuestos');
  }

  return response.json();
}

/**
 * Obtiene el detalle completo de un presupuesto específico
 * GET /api/portal/presupuestos/:id
 */
export async function obtenerDetallePresupuesto(id: string): Promise<PresupuestoPaciente> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/presupuestos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el presupuesto' }));
    throw new Error(error.message || 'Error al obtener el presupuesto');
  }

  return response.json();
}

/**
 * Permite al paciente aprobar un presupuesto
 * PUT /api/portal/presupuestos/:id/aprobar
 */
export async function aprobarPresupuesto(id: string): Promise<PresupuestoPaciente> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/presupuestos/${id}/aprobar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al aprobar el presupuesto' }));
    throw new Error(error.message || 'Error al aprobar el presupuesto');
  }

  return response.json();
}

/**
 * Permite al paciente rechazar un presupuesto
 * PUT /api/portal/presupuestos/:id/rechazar
 */
export async function rechazarPresupuesto(id: string, notasPaciente?: string): Promise<PresupuestoPaciente> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/presupuestos/${id}/rechazar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ notasPaciente: notasPaciente || '' }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al rechazar el presupuesto' }));
    throw new Error(error.message || 'Error al rechazar el presupuesto');
  }

  return response.json();
}



