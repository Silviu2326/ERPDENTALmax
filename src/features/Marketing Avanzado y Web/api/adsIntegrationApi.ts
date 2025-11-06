// API para integración con Google Ads y Meta Ads
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type Platform = 'google' | 'meta';

export interface PlatformConnection {
  platform: Platform;
  connected: boolean;
  accountName?: string;
  accountId?: string;
  connectedAt?: string;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  platform: Platform;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue?: number;
  roi?: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface CampaignPerformanceSummary {
  totalImpressions: number;
  totalClicks: number;
  totalCost: number;
  totalConversions: number;
  totalRevenue?: number;
  averageROI?: number;
  campaigns: CampaignPerformance[];
}

export interface ConversionEvent {
  erpEvent: string;
  platformEvent: string;
  platform: Platform;
  enabled: boolean;
}

export interface ConversionEventSettings {
  conversionEvents: ConversionEvent[];
}

/**
 * Inicia el flujo de autenticación OAuth 2.0 para una plataforma específica
 */
export async function initiateOAuthConnection(platform: Platform): Promise<{ redirectUrl: string }> {
  const response = await fetch(`${API_BASE_URL}/marketing/ads/connect/${platform}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al iniciar la conexión OAuth' }));
    throw new Error(error.message || 'Error al iniciar la conexión OAuth');
  }

  return response.json();
}

/**
 * Obtiene el estado actual de las integraciones (qué plataformas están conectadas)
 */
export async function getConnectionsStatus(): Promise<PlatformConnection[]> {
  const response = await fetch(`${API_BASE_URL}/marketing/ads/connections`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el estado de las conexiones' }));
    throw new Error(error.message || 'Error al obtener el estado de las conexiones');
  }

  return response.json();
}

/**
 * Recupera los datos de rendimiento de las campañas sincronizadas
 */
export async function getCampaignPerformance(
  dateRange: string = 'last_30_days'
): Promise<CampaignPerformanceSummary> {
  const response = await fetch(`${API_BASE_URL}/marketing/ads/performance?dateRange=${dateRange}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el rendimiento de las campañas' }));
    throw new Error(error.message || 'Error al obtener el rendimiento de las campañas');
  }

  return response.json();
}

/**
 * Guarda la configuración de la integración (qué eventos del ERP se deben enviar como conversiones)
 */
export async function saveConversionEventSettings(
  settings: ConversionEventSettings
): Promise<ConversionEventSettings> {
  const response = await fetch(`${API_BASE_URL}/marketing/ads/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al guardar la configuración' }));
    throw new Error(error.message || 'Error al guardar la configuración');
  }

  return response.json();
}

/**
 * Obtiene la configuración actual de eventos de conversión
 */
export async function getConversionEventSettings(): Promise<ConversionEventSettings> {
  const response = await fetch(`${API_BASE_URL}/marketing/ads/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener la configuración' }));
    throw new Error(error.message || 'Error al obtener la configuración');
  }

  return response.json();
}

/**
 * Desconecta una plataforma publicitaria
 */
export async function disconnectPlatform(platform: Platform): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/marketing/ads/disconnect/${platform}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al desconectar la plataforma' }));
    throw new Error(error.message || 'Error al desconectar la plataforma');
  }
}


