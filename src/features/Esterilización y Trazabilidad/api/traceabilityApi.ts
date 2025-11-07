// API para informes de trazabilidad
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface TraceabilityEvent {
  _id: string;
  kitId: string;
  kitCode: string;
  kitDescription?: string;
  patientId?: string;
  patientName?: string;
  patientDni?: string;
  treatmentId?: string;
  treatmentDate?: string;
  treatmentProcedure?: string;
  sterilizationCycleId?: string;
  sterilizationCycleNumber?: string;
  sterilizationDate?: string;
  sterilizationStatus?: 'passed' | 'failed';
  sterilizationOperator?: string;
  eventType: 'sterilization' | 'use' | 'cleaning' | 'packaging';
  eventDate: string;
  clinicId?: string;
  clinicName?: string;
}

export interface TraceabilityReportFilters {
  patientId?: string;
  instrumentKitId?: string;
  sterilizationCycleId?: string;
  startDate?: string;
  endDate?: string;
  clinicId?: string;
  page?: number;
  limit?: number;
}

export interface TraceabilityReportResponse {
  data: TraceabilityEvent[];
  total: number;
  page: number;
  pages: number;
}

export interface TimelineEvent {
  _id: string;
  eventType: 'sterilization' | 'use' | 'cleaning' | 'packaging';
  eventDate: string;
  description: string;
  patientId?: string;
  patientName?: string;
  treatmentId?: string;
  treatmentProcedure?: string;
  sterilizationCycleId?: string;
  sterilizationCycleNumber?: string;
  operatorId?: string;
  operatorName?: string;
  status?: string;
  metadata?: Record<string, any>;
}

/**
 * Obtiene un informe de trazabilidad completo basado en diversos filtros
 */
export async function obtenerInformeTrazabilidad(
  filtros: TraceabilityReportFilters
): Promise<TraceabilityReportResponse> {
  const params = new URLSearchParams();

  if (filtros.patientId) {
    params.append('patientId', filtros.patientId);
  }
  if (filtros.instrumentKitId) {
    params.append('instrumentKitId', filtros.instrumentKitId);
  }
  if (filtros.sterilizationCycleId) {
    params.append('sterilizationCycleId', filtros.sterilizationCycleId);
  }
  if (filtros.startDate) {
    params.append('startDate', filtros.startDate);
  }
  if (filtros.endDate) {
    params.append('endDate', filtros.endDate);
  }
  if (filtros.clinicId) {
    params.append('clinicId', filtros.clinicId);
  }
  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }

  const response = await fetch(`${API_BASE_URL}/traceability/reports?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener el informe de trazabilidad' }));
    throw new Error(errorData.message || 'Error al obtener el informe de trazabilidad');
  }

  return response.json();
}

/**
 * Genera y descarga un informe de trazabilidad en formato PDF o CSV
 */
export async function exportarInformeTrazabilidad(
  filtros: TraceabilityReportFilters,
  format: 'pdf' | 'csv'
): Promise<Blob> {
  const params = new URLSearchParams();
  params.append('format', format);

  if (filtros.patientId) {
    params.append('patientId', filtros.patientId);
  }
  if (filtros.instrumentKitId) {
    params.append('instrumentKitId', filtros.instrumentKitId);
  }
  if (filtros.sterilizationCycleId) {
    params.append('sterilizationCycleId', filtros.sterilizationCycleId);
  }
  if (filtros.startDate) {
    params.append('startDate', filtros.startDate);
  }
  if (filtros.endDate) {
    params.append('endDate', filtros.endDate);
  }
  if (filtros.clinicId) {
    params.append('clinicId', filtros.clinicId);
  }

  const response = await fetch(`${API_BASE_URL}/traceability/reports/export?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al exportar el informe' }));
    throw new Error(errorData.message || 'Error al exportar el informe');
  }

  return response.blob();
}

/**
 * Obtiene el historial completo y cronológico de un kit de instrumental específico
 */
export async function obtenerTimelineKit(kitId: string): Promise<TimelineEvent[]> {
  const response = await fetch(`${API_BASE_URL}/traceability/timeline/${kitId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener el timeline del kit' }));
    throw new Error(errorData.message || 'Error al obtener el timeline del kit');
  }

  return response.json();
}



