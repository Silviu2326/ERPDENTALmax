// API para el Embudo de Conversión (Lead → Paciente)
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ConversionFunnelParams {
  startDate: string; // ISO date format, ej: '2023-01-01'
  endDate: string; // ISO date format, ej: '2023-03-31'
  clinicId?: string; // ObjectId de la clínica para filtrar (opcional, requerido para roles no-admin)
  source?: string; // Origen del lead, ej: 'Facebook Ads', 'Google Organic'
}

export interface FunnelStage {
  name: string; // Nombre de la etapa, ej: 'Nuevos Leads', 'Cita Agendada'
  count: number; // Número de leads en esta etapa
  conversionRate?: number; // Tasa de conversión desde la etapa anterior (porcentaje)
}

export interface SourceBreakdown {
  source: string; // Origen del lead
  count: number; // Número de leads por este origen
}

export interface ConversionFunnelResponse {
  stages: FunnelStage[]; // Array con los datos de cada etapa
  sourceBreakdown: SourceBreakdown[]; // Array con el conteo de leads por origen
}

/**
 * Obtiene los datos agregados para construir el embudo de conversión.
 * Calcula el número de leads en cada etapa y las tasas de conversión entre ellas.
 * Permite el filtrado por fecha, clínica y origen del lead.
 * 
 * @param params Parámetros de filtrado para el embudo
 * @returns Datos del embudo con etapas y desglose por origen
 */
export async function getConversionFunnelData(
  params: ConversionFunnelParams
): Promise<ConversionFunnelResponse> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  if (params.clinicId) {
    queryParams.append('clinicId', params.clinicId);
  }

  if (params.source) {
    queryParams.append('source', params.source);
  }

  const response = await fetch(
    `${API_BASE_URL}/analytics/conversion-funnel?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al obtener datos del embudo de conversión',
    }));
    throw new Error(
      errorData.message || `Error ${response.status}: ${response.statusText}`
    );
  }

  return await response.json();
}



