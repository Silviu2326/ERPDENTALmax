// API para gestionar integraciones y conectores

export interface ConectorMensajeria {
  id: string;
  nombre: string;
  proveedor: string;
  estado: 'activo' | 'inactivo' | 'error';
  tipo: 'sms' | 'whatsapp' | 'email';
  configuracion: {
    apiKey?: string;
    apiSecret?: string;
    numeroRemitente?: string;
    dominio?: string;
  };
  ultimaVerificacion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Webhook {
  id: string;
  url: string;
  evento: string;
  estado: 'activo' | 'inactivo';
  secret?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  evento: string;
  payload: any;
  respuesta?: any;
  statusCode?: number;
  exito: boolean;
  error?: string;
  intentadoEn: string;
}

export interface ApiPublica {
  id: string;
  nombre: string;
  descripcion: string;
  endpoint: string;
  metodo: 'GET' | 'POST' | 'PUT' | 'DELETE';
  autenticacion: 'api-key' | 'oauth' | 'bearer';
  estado: 'activo' | 'inactivo';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiKey {
  id: string;
  nombre: string;
  permisos: string[];
  expiracion?: string;
  ultimaUtilizacion?: string;
  createdAt: string;
  // La clave solo se muestra una vez al crearla
  clave?: string;
}

export type WebhookEvento = 
  | 'cita.creada'
  | 'cita.actualizada'
  | 'cita.cancelada'
  | 'factura.creada'
  | 'factura.pagada'
  | 'paciente.creado'
  | 'paciente.actualizado'
  | 'presupuesto.aprobado'
  | 'presupuesto.rechazado';

const API_BASE_URL = '/api/integraciones';

// Funciones para conectores de mensajería
export async function obtenerConectoresMensajeria(): Promise<ConectorMensajeria[]> {
  // TODO: Implementar llamada al backend
  return [];
}

export async function crearConectorMensajeria(
  conector: Omit<ConectorMensajeria, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ConectorMensajeria> {
  // TODO: Implementar llamada al backend
  throw new Error('No implementado');
}

export async function actualizarConectorMensajeria(
  id: string,
  conector: Partial<ConectorMensajeria>
): Promise<ConectorMensajeria> {
  // TODO: Implementar llamada al backend
  throw new Error('No implementado');
}

export async function eliminarConectorMensajeria(id: string): Promise<void> {
  // TODO: Implementar llamada al backend
  throw new Error('No implementado');
}

export async function probarConectorMensajeria(id: string): Promise<{ exito: boolean; mensaje: string }> {
  // TODO: Implementar llamada al backend
  throw new Error('No implementado');
}

// Funciones para webhooks
export async function obtenerWebhooks(): Promise<Webhook[]> {
  const response = await fetch(`${API_BASE_URL}/webhooks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los webhooks');
  }

  return response.json();
}

export async function crearWebhook(webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<Webhook> {
  const response = await fetch(`${API_BASE_URL}/webhooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(webhook),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el webhook');
  }

  return response.json();
}

export async function actualizarWebhook(id: string, webhook: Partial<Webhook>): Promise<Webhook> {
  const response = await fetch(`${API_BASE_URL}/webhooks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(webhook),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el webhook');
  }

  return response.json();
}

export async function eliminarWebhook(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/webhooks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el webhook');
  }
}

export async function probarWebhook(id: string): Promise<{ exito: boolean; mensaje: string; respuesta?: any }> {
  const response = await fetch(`${API_BASE_URL}/webhooks/${id}/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al probar el webhook');
  }

  return response.json();
}

export async function obtenerLogsWebhook(
  id: string,
  page: number = 1,
  limit: number = 20
): Promise<{ logs: WebhookLog[]; total: number; page: number; limit: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/webhooks/${id}/logs?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los logs del webhook');
  }

  return response.json();
}

// Funciones para APIs públicas
export async function obtenerApisPublicas(): Promise<ApiPublica[]> {
  const response = await fetch(`${API_BASE_URL}/apis-publicas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las APIs públicas');
  }

  return response.json();
}

export async function obtenerDocumentacionApi(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/apis-publicas/documentacion`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la documentación de la API');
  }

  return response.json();
}

// Funciones para gestión de claves de API
export async function generarApiKey(data: {
  nombre: string;
  permisos: string[];
  expiracion?: string;
}): Promise<ApiKey> {
  const response = await fetch(`${API_BASE_URL}/apis-publicas/keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al generar la clave de API');
  }

  return response.json();
}

export async function obtenerApiKeys(): Promise<ApiKey[]> {
  const response = await fetch(`${API_BASE_URL}/apis-publicas/keys`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las claves de API');
  }

  return response.json();
}

export async function revocarApiKey(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/apis-publicas/keys/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al revocar la clave de API');
  }
}

// Interfaces para Monitor de Integraciones
export interface LogIntegracion {
  id: string;
  tipoIntegracion: string;
  nombreIntegracion: string;
  evento: string;
  estado: 'exitoso' | 'error' | 'pendiente';
  fecha: string;
  detalles?: any;
  duracion?: number;
  statusCode?: number;
}

export interface ErrorIntegracion {
  id: string;
  tipoIntegracion: string;
  nombreIntegracion: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  resuelto: boolean;
  intentos?: number;
  detalles?: any;
  stackTrace?: string;
}

export interface EstadisticasIntegraciones {
  totalIntegraciones: number;
  integracionesActivas: number;
  errores24h: number;
  tasaExito: number;
  porTipo: Array<{
    tipo: string;
    nombre: string;
    total: number;
    exitosos: number;
    errores: number;
    tasaExito: number;
  }>;
}

export interface FiltrosLogsIntegraciones {
  tipoIntegracion?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  nombreIntegracion?: string;
}

// Funciones para Monitor de Integraciones
export async function obtenerLogsIntegraciones(
  filtros: FiltrosLogsIntegraciones = {}
): Promise<LogIntegracion[]> {
  const params = new URLSearchParams();
  if (filtros.tipoIntegracion) params.append('tipoIntegracion', filtros.tipoIntegracion);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
  if (filtros.nombreIntegracion) params.append('nombreIntegracion', filtros.nombreIntegracion);

  const response = await fetch(`${API_BASE_URL}/monitor/logs?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los logs de integraciones');
  }

  return response.json();
}

export async function obtenerErroresIntegraciones(
  filtros: FiltrosLogsIntegraciones = {}
): Promise<ErrorIntegracion[]> {
  const params = new URLSearchParams();
  if (filtros.tipoIntegracion) params.append('tipoIntegracion', filtros.tipoIntegracion);
  if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
  if (filtros.nombreIntegracion) params.append('nombreIntegracion', filtros.nombreIntegracion);

  const response = await fetch(`${API_BASE_URL}/monitor/errores?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los errores de integraciones');
  }

  return response.json();
}

export async function obtenerEstadisticasIntegraciones(): Promise<EstadisticasIntegraciones> {
  const response = await fetch(`${API_BASE_URL}/monitor/estadisticas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las estadísticas de integraciones');
  }

  return response.json();
}

