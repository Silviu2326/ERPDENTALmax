// API para gestión de campañas de email
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface EmailCampaign {
  _id?: string;
  name: string;
  subject: string;
  htmlContent: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  segmentCriteria: SegmentCriteria;
  stats?: {
    totalRecipients: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
  };
  templateId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SegmentCriteria {
  lastVisitDate?: {
    operator: 'before' | 'after' | 'between';
    value?: string;
    value2?: string;
  };
  treatments?: string[];
  accountBalance?: {
    operator: 'greater' | 'less' | 'equal';
    value: number;
  };
  ageRange?: {
    min?: number;
    max?: number;
  };
  gender?: 'male' | 'female' | 'other';
}

export interface EmailTemplate {
  _id?: string;
  name: string;
  htmlContent: string;
  thumbnailUrl?: string;
}

export interface CampaignReport {
  campaignId: string;
  totalRecipients: number;
  opens: number;
  clicks: number;
  bounces: number;
  unsubscribes: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  sentAt: string;
}

export interface CampaignListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  status?: string;
}

export interface CampaignListResponse {
  campaigns: EmailCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Obtener lista de campañas
export async function obtenerCampanas(params: CampaignListParams = {}): Promise<CampaignListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/campaigns?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las campañas');
  }

  return response.json();
}

// Obtener detalle de una campaña
export async function obtenerCampanaPorId(id: string): Promise<EmailCampaign> {
  const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la campaña');
  }

  return response.json();
}

// Crear nueva campaña
export async function crearCampana(campana: {
  name: string;
  subject: string;
  templateId?: string;
  segmentCriteria: SegmentCriteria;
}): Promise<EmailCampaign> {
  const response = await fetch(`${API_BASE_URL}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(campana),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la campaña');
  }

  return response.json();
}

// Actualizar campaña
export async function actualizarCampana(
  id: string,
  campana: {
    name?: string;
    subject?: string;
    htmlContent?: string;
    segmentCriteria?: SegmentCriteria;
  }
): Promise<EmailCampaign> {
  const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(campana),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la campaña');
  }

  return response.json();
}

// Eliminar campaña
export async function eliminarCampana(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la campaña');
  }
}

// Programar campaña
export async function programarCampana(
  id: string,
  scheduledAt: string
): Promise<EmailCampaign> {
  const response = await fetch(`${API_BASE_URL}/campaigns/${id}/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ scheduledAt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al programar la campaña');
  }

  return response.json();
}

// Obtener reporte de campaña
export async function obtenerReporteCampana(id: string): Promise<CampaignReport> {
  const response = await fetch(`${API_BASE_URL}/campaigns/${id}/report`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el reporte de la campaña');
  }

  return response.json();
}

// Obtener plantillas de email
export async function obtenerPlantillas(): Promise<EmailTemplate[]> {
  const response = await fetch(`${API_BASE_URL}/email-templates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las plantillas');
  }

  return response.json();
}

// Obtener conteo de pacientes para un segmento
export async function obtenerConteoPacientesSegmento(
  segmentCriteria: SegmentCriteria
): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/patients/segment/count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ segmentCriteria }),
  });

  if (!response.ok) {
    throw new Error('Error al obtener el conteo de pacientes');
  }

  const data = await response.json();
  return data.count;
}

// Obtener pacientes en un segmento
export async function obtenerPacientesEnSegmento(
  segmentCriteria: SegmentCriteria,
  page?: number,
  limit?: number
): Promise<{ patients: any[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page.toString());
  if (limit) queryParams.append('limit', limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/patients/segment?${queryParams.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ segmentCriteria }),
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener los pacientes del segmento');
  }

  return response.json();
}



