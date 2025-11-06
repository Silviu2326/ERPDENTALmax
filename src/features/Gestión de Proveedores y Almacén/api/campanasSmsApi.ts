// API para gestión de campañas de SMS
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface SmsCampaign {
  _id?: string;
  name: string;
  message: string;
  targetSegment: TargetSegment;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  createdBy?: string;
  stats?: {
    total: number;
    sent: number;
    delivered: number;
    failed: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TargetSegment {
  lastVisitBefore?: string; // Fecha en formato ISO
  lastVisitAfter?: string;
  ageRange?: {
    min?: number;
    max?: number;
  };
  pendingTreatments?: string[];
  treatmentsCompleted?: string[];
  gender?: 'male' | 'female' | 'other';
  marketingConsent?: boolean; // Requerido para cumplimiento GDPR/LOPD
}

export interface CampaignStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  failureRate: number;
}

export interface CampaignListParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
}

export interface CampaignListResponse {
  campaigns: SmsCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SegmentPreviewResponse {
  count: number;
}

// Obtener lista de campañas SMS
export async function obtenerCampanasSms(
  params: CampaignListParams = {}
): Promise<CampaignListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/sms-campaigns?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las campañas de SMS');
  }

  return response.json();
}

// Obtener detalle de una campaña SMS
export async function obtenerCampanaSmsPorId(id: string): Promise<SmsCampaign> {
  const response = await fetch(`${API_BASE_URL}/sms-campaigns/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la campaña de SMS');
  }

  return response.json();
}

// Crear nueva campaña SMS
export async function crearCampanaSms(campana: {
  name: string;
  message: string;
  targetSegment: TargetSegment;
}): Promise<SmsCampaign> {
  const response = await fetch(`${API_BASE_URL}/sms-campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(campana),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la campaña de SMS');
  }

  return response.json();
}

// Actualizar campaña SMS
export async function actualizarCampanaSms(
  id: string,
  campana: {
    name?: string;
    message?: string;
    targetSegment?: TargetSegment;
    scheduledAt?: string;
  }
): Promise<SmsCampaign> {
  const response = await fetch(`${API_BASE_URL}/sms-campaigns/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(campana),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la campaña de SMS');
  }

  return response.json();
}

// Eliminar campaña SMS (solo borradores)
export async function eliminarCampanaSms(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sms-campaigns/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la campaña de SMS');
  }
}

// Obtener estadísticas de una campaña SMS enviada
export async function obtenerEstadisticasCampana(id: string): Promise<CampaignStats> {
  const response = await fetch(`${API_BASE_URL}/sms-campaigns/${id}/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las estadísticas de la campaña');
  }

  const stats = await response.json();
  return {
    ...stats,
    deliveryRate: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
    failureRate: stats.total > 0 ? (stats.failed / stats.total) * 100 : 0,
  };
}

// Obtener vista previa del número de pacientes que coinciden con un segmento
export async function obtenerVistaPreviaSegmento(
  targetSegment: TargetSegment
): Promise<SegmentPreviewResponse> {
  const response = await fetch(`${API_BASE_URL}/sms-campaigns/preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ targetSegment }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la vista previa del segmento');
  }

  return response.json();
}


