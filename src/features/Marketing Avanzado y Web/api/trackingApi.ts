// API para configuración de píxeles y seguimiento UTM
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type TrackingPlatform = 'Meta' | 'GoogleAds' | 'TikTok';

export interface ConversionEvent {
  eventName: string;
  eventCode: string;
}

export interface TrackingConfig {
  _id?: string;
  clinicId: string;
  platform: TrackingPlatform;
  pixelId: string;
  isEnabled: boolean;
  conversionEvents: ConversionEvent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface PublicLead {
  name: string;
  email: string;
  phone: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Obtiene todas las configuraciones de píxeles y seguimiento para la clínica autenticada
 */
export async function getTrackingConfigurations(): Promise<TrackingConfig[]> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/tracking/configurations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las configuraciones de seguimiento');
  }

  return response.json();
}

/**
 * Crea una nueva configuración de píxel para una plataforma específica
 */
export async function createTrackingConfiguration(
  config: Omit<TrackingConfig, '_id' | 'createdAt' | 'updatedAt' | 'clinicId'>
): Promise<TrackingConfig> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/tracking/configurations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la configuración de seguimiento');
  }

  return response.json();
}

/**
 * Actualiza una configuración de seguimiento existente
 */
export async function updateTrackingConfiguration(
  id: string,
  updates: Partial<Omit<TrackingConfig, '_id' | 'createdAt' | 'updatedAt' | 'clinicId' | 'platform'>>
): Promise<TrackingConfig> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/tracking/configurations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la configuración de seguimiento');
  }

  return response.json();
}

/**
 * Elimina una configuración de seguimiento
 */
export async function deleteTrackingConfiguration(id: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/tracking/configurations/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la configuración de seguimiento');
  }
}

/**
 * Crea un nuevo lead desde el formulario web público, capturando datos UTM
 */
export async function createPublicLead(lead: PublicLead): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/leads/public`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el lead');
  }

  return response.json();
}

/**
 * Genera el snippet de JavaScript para insertar en el sitio web
 */
export function generateTrackingSnippet(configurations: TrackingConfig[]): string {
  const enabledConfigs = configurations.filter((config) => config.isEnabled);

  if (enabledConfigs.length === 0) {
    return '// No hay configuraciones de seguimiento activas';
  }

  let snippet = `<!-- Tracking Script generado por ERP Dental -->\n<script async defer>\n`;

  // Meta Pixel
  const metaConfig = enabledConfigs.find((c) => c.platform === 'Meta');
  if (metaConfig) {
    snippet += `\n  // Meta Pixel\n`;
    snippet += `  !function(f,b,e,v,n,t,s)\n`;
    snippet += `  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n`;
    snippet += `  n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n`;
    snippet += `  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n`;
    snippet += `  n.queue=[];t=b.createElement(e);t.async=!0;\n`;
    snippet += `  t.src=v;s=b.getElementsByTagName(e)[0];\n`;
    snippet += `  s.parentNode.insertBefore(t,s)}(window, document,'script',\n`;
    snippet += `  'https://connect.facebook.net/en_US/fbevents.js');\n`;
    snippet += `  fbq('init', '${metaConfig.pixelId}');\n`;
    snippet += `  fbq('track', 'PageView');\n`;
  }

  // Google Ads
  const googleConfig = enabledConfigs.find((c) => c.platform === 'GoogleAds');
  if (googleConfig) {
    snippet += `\n  // Google Ads Conversion Tracking\n`;
    snippet += `  gtag('config', '${googleConfig.pixelId}');\n`;
  }

  // TikTok Pixel
  const tiktokConfig = enabledConfigs.find((c) => c.platform === 'TikTok');
  if (tiktokConfig) {
    snippet += `\n  // TikTok Pixel\n`;
    snippet += `  !function (w, d, t) {\n`;
    snippet += `  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["track","page"],\n`;
    snippet += `  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};\n`;
    snippet += `  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);\n`;
    snippet += `  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},\n`;
    snippet += `  ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";\n`;
    snippet += `  ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},\n`;
    snippet += `  ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");\n`;
    snippet += `  o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;\n`;
    snippet += `  var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};\n`;
    snippet += `  ttq.load('${tiktokConfig.pixelId}');\n`;
    snippet += `  ttq.page();\n`;
    snippet += `  }(window, document, 'ttq');\n`;
  }

  // Script para capturar UTMs
  snippet += `\n  // Captura de parámetros UTM\n`;
  snippet += `  (function() {\n`;
  snippet += `    const urlParams = new URLSearchParams(window.location.search);\n`;
  snippet += `    const utmParams = {};\n`;
  snippet += `    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {\n`;
  snippet += `      if (urlParams.has(param)) {\n`;
  snippet += `        utmParams[param] = urlParams.get(param);\n`;
  snippet += `        sessionStorage.setItem(param, urlParams.get(param));\n`;
  snippet += `      }\n`;
  snippet += `    });\n`;
  snippet += `    window.erpDentalUTM = utmParams;\n`;
  snippet += `  })();\n`;

  snippet += `\n</script>\n`;

  return snippet;
}


