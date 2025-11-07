// API para gestión de planes de mantenimiento preventivo
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Equipment {
  _id: string;
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie?: string;
}

export interface User {
  _id: string;
  nombre: string;
  apellidos?: string;
  email?: string;
}

export interface Clinic {
  _id: string;
  nombre: string;
}

export interface MaintenancePlan {
  _id?: string;
  name: string;
  description?: string;
  equipment: Equipment;
  frequencyType: 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL';
  frequencyValue: number;
  nextDueDate: string;
  tasks: string[];
  assignedTo: User;
  clinic: Clinic;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceLog {
  _id?: string;
  maintenancePlan: MaintenancePlan;
  equipment: Equipment;
  completionDate: string;
  performedBy: User;
  notes?: string;
  cost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosMaintenancePlans {
  page?: number;
  limit?: number;
  equipmentId?: string;
  status?: 'active' | 'inactive';
  clinicId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NuevoMaintenancePlan {
  name: string;
  description?: string;
  equipment: string;
  frequencyType: 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL';
  frequencyValue: number;
  tasks: string[];
  assignedTo: string;
}

export interface NuevoMaintenanceLog {
  maintenancePlan: string;
  equipment: string;
  completionDate: string;
  performedBy: string;
  notes?: string;
  cost?: number;
}

// Obtener lista de planes de mantenimiento con filtros
export async function obtenerMaintenancePlans(
  filtros: FiltrosMaintenancePlans = {}
): Promise<PaginatedResponse<MaintenancePlan>> {
  const params = new URLSearchParams();

  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.equipmentId) params.append('equipmentId', filtros.equipmentId);
  if (filtros.status) params.append('status', filtros.status);
  if (filtros.clinicId) params.append('clinicId', filtros.clinicId);

  const response = await fetch(`${API_BASE_URL}/maintenance-plans?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los planes de mantenimiento');
  }

  return response.json();
}

// Obtener un plan de mantenimiento por ID
export async function obtenerMaintenancePlanPorId(id: string): Promise<MaintenancePlan> {
  const response = await fetch(`${API_BASE_URL}/maintenance-plans/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el plan de mantenimiento');
  }

  return response.json();
}

// Crear un nuevo plan de mantenimiento
export async function crearMaintenancePlan(
  plan: NuevoMaintenancePlan
): Promise<MaintenancePlan> {
  const response = await fetch(`${API_BASE_URL}/maintenance-plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el plan de mantenimiento');
  }

  return response.json();
}

// Actualizar un plan de mantenimiento existente
export async function actualizarMaintenancePlan(
  id: string,
  plan: Partial<NuevoMaintenancePlan>
): Promise<MaintenancePlan> {
  const response = await fetch(`${API_BASE_URL}/maintenance-plans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el plan de mantenimiento');
  }

  return response.json();
}

// Eliminar un plan de mantenimiento (borrado lógico)
export async function eliminarMaintenancePlan(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/maintenance-plans/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el plan de mantenimiento');
  }
}

// Obtener logs de mantenimiento de un plan
export async function obtenerMaintenanceLogs(planId: string): Promise<MaintenanceLog[]> {
  const response = await fetch(`${API_BASE_URL}/maintenance-plans/${planId}/logs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los logs de mantenimiento');
  }

  return response.json();
}

// Crear un nuevo log de mantenimiento
export async function crearMaintenanceLog(log: NuevoMaintenanceLog): Promise<MaintenanceLog> {
  const response = await fetch(`${API_BASE_URL}/maintenance-logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(log),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el log de mantenimiento');
  }

  return response.json();
}



