// API para gestión de plantillas de auditoría y auditorías clínicas

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Tipos para Plantillas de Auditoría
export interface ChecklistItem {
  id: string;
  type: 'checkbox' | 'text' | 'select' | 'file';
  label: string;
  options?: string[]; // Para tipo 'select'
  isRequired: boolean;
  order: number;
}

export interface AuditTemplate {
  _id?: string;
  name: string;
  description: string;
  clinicId: string;
  createdBy: string;
  isActive: boolean;
  items: ChecklistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAuditTemplateRequest {
  name: string;
  description: string;
  items: ChecklistItem[];
}

export interface UpdateAuditTemplateRequest {
  name?: string;
  description?: string;
  items?: ChecklistItem[];
  isActive?: boolean;
}

// Tipos para Instancias de Auditoría
export interface AuditAnswer {
  itemId: string;
  value: any; // string, boolean, string[] dependiendo del tipo de item
  notes?: string;
  fileUrl?: string; // Para items de tipo 'file'
}

export interface AuditInstance {
  _id?: string;
  templateId: string;
  template?: AuditTemplate; // Populado cuando se obtiene el detalle
  patientId: string;
  patient?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  odontologistId: string;
  odontologist?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  clinicId: string;
  status: 'in-progress' | 'completed';
  answers: AuditAnswer[];
  completionDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAuditInstanceRequest {
  templateId: string;
  patientId: string;
  odontologistId: string;
}

export interface UpdateAuditInstanceRequest {
  answers?: AuditAnswer[];
  status?: 'in-progress' | 'completed';
}

// ========== APIs de Plantillas ==========

/**
 * Obtiene todas las plantillas de auditoría disponibles para la clínica
 */
export async function obtenerPlantillasAuditoria(
  clinicId?: string
): Promise<AuditTemplate[]> {
  try {
    const params = new URLSearchParams();
    if (clinicId) {
      params.append('clinicId', clinicId);
    }

    const response = await fetch(`${API_BASE_URL}/audit-templates?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener plantillas: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.templates || [];
  } catch (error) {
    console.error('Error en obtenerPlantillasAuditoria:', error);
    throw error;
  }
}

/**
 * Obtiene una plantilla específica por ID
 */
export async function obtenerPlantillaPorId(templateId: string): Promise<AuditTemplate> {
  try {
    const response = await fetch(`${API_BASE_URL}/audit-templates/${templateId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener plantilla: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerPlantillaPorId:', error);
    throw error;
  }
}

/**
 * Crea una nueva plantilla de auditoría (Rol: Director/Admin)
 */
export async function crearPlantillaAuditoria(
  template: CreateAuditTemplateRequest
): Promise<AuditTemplate> {
  try {
    const response = await fetch(`${API_BASE_URL}/audit-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error(`Error al crear plantilla: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en crearPlantillaAuditoria:', error);
    throw error;
  }
}

/**
 * Actualiza una plantilla de auditoría existente (Rol: Director/Admin)
 */
export async function actualizarPlantillaAuditoria(
  templateId: string,
  updates: UpdateAuditTemplateRequest
): Promise<AuditTemplate> {
  try {
    const response = await fetch(`${API_BASE_URL}/audit-templates/${templateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar plantilla: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en actualizarPlantillaAuditoria:', error);
    throw error;
  }
}

/**
 * Desactiva una plantilla de auditoría (Rol: Director/Admin)
 */
export async function desactivarPlantillaAuditoria(
  templateId: string
): Promise<AuditTemplate> {
  return actualizarPlantillaAuditoria(templateId, { isActive: false });
}

// ========== APIs de Instancias de Auditoría ==========

/**
 * Crea una nueva instancia de auditoría para un paciente
 */
export async function crearInstanciaAuditoria(
  request: CreateAuditInstanceRequest
): Promise<AuditInstance> {
  try {
    const response = await fetch(`${API_BASE_URL}/audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error al crear auditoría: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en crearInstanciaAuditoria:', error);
    throw error;
  }
}

/**
 * Obtiene una instancia de auditoría por ID
 */
export async function obtenerInstanciaAuditoriaPorId(
  auditId: string
): Promise<AuditInstance> {
  try {
    const response = await fetch(`${API_BASE_URL}/audits/${auditId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener auditoría: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerInstanciaAuditoriaPorId:', error);
    throw error;
  }
}

/**
 * Obtiene el historial de auditorías completadas para un paciente específico
 */
export async function obtenerAuditoriasPorPaciente(
  patientId: string
): Promise<AuditInstance[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/audits/patient/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener auditorías del paciente: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.audits || [];
  } catch (error) {
    console.error('Error en obtenerAuditoriasPorPaciente:', error);
    throw error;
  }
}

/**
 * Actualiza el progreso o finaliza una auditoría en curso
 */
export async function actualizarInstanciaAuditoria(
  auditId: string,
  updates: UpdateAuditInstanceRequest
): Promise<AuditInstance> {
  try {
    const response = await fetch(`${API_BASE_URL}/audits/${auditId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar auditoría: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en actualizarInstanciaAuditoria:', error);
    throw error;
  }
}



