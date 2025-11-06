// API para gestión de pagos y pasarela de pagos según especificación del documento
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces para Pagos
export interface Pago {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  };
  facturas?: Array<{
    _id: string;
    numero: string;
    montoTotal: number;
    montoPagado: number;
  }>;
  tratamientos?: Array<{
    _id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    saldoPendiente?: number;
  }>;
  monto: number;
  moneda: string;
  metodo: 'tarjeta_credito' | 'tarjeta_debito' | 'efectivo' | 'transferencia' | 'financiacion';
  estado: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
  gateway?: 'stripe' | 'adyen';
  gatewayTransactionId?: string;
  fecha: string; // ISO Date
  notas?: string;
  creadoPor?: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentIntentRequest {
  monto: number;
  moneda: string;
  pacienteId: string;
  facturaIds?: string[];
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  pagoId: string;
}

export interface ConfirmPaymentRequest {
  pagoId: string;
  gatewayTransactionId: string;
}

export interface ConfirmPaymentResponse {
  status: 'success' | 'error';
  pago: Pago;
  message?: string;
}

/**
 * POST /api/pagos/crear-intento-pago
 * Crea una intención de pago en la pasarela (ej. Stripe). 
 * No procesa el pago, solo lo prepara y devuelve un 'client secret' 
 * para que el frontend pueda completarlo de forma segura.
 */
export async function crearIntentoPago(
  datos: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> {
  const response = await fetch(`${API_BASE_URL}/pagos/crear-intento-pago`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      monto: datos.monto,
      moneda: datos.moneda,
      pacienteId: datos.pacienteId,
      facturaIds: datos.facturaIds || [],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear intento de pago' }));
    throw new Error(error.message || 'Error al crear intento de pago');
  }

  return response.json();
}

/**
 * POST /api/pagos/confirmar
 * Endpoint que el frontend llama después de que la pasarela confirma el pago.
 * El backend verifica el estado del pago con la pasarela usando el ID y,
 * si es exitoso, actualiza el estado del pago, las facturas y el saldo del paciente.
 */
export async function confirmarPago(
  datos: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/pagos/confirmar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      pagoId: datos.pagoId,
      gatewayTransactionId: datos.gatewayTransactionId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al confirmar el pago' }));
    throw new Error(error.message || 'Error al confirmar el pago');
  }

  return response.json();
}

/**
 * GET /api/pagos/paciente/:pacienteId
 * Obtiene el historial de todos los pagos realizados por un paciente específico.
 */
export async function obtenerPagosPorPaciente(
  pacienteId: string
): Promise<Pago[]> {
  const response = await fetch(`${API_BASE_URL}/pagos/paciente/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener pagos del paciente' }));
    throw new Error(error.message || 'Error al obtener pagos del paciente');
  }

  return response.json();
}

/**
 * GET /api/pagos/:pagoId
 * Obtiene los detalles de un pago específico.
 */
export async function obtenerPagoPorId(
  pagoId: string
): Promise<Pago> {
  const response = await fetch(`${API_BASE_URL}/pagos/${pagoId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener detalle del pago' }));
    throw new Error(error.message || 'Error al obtener detalle del pago');
  }

  return response.json();
}

/**
 * GET /api/pagos
 * Obtiene una lista global de todos los pagos de la clínica (para roles administrativos).
 * Con capacidades avanzadas de filtrado y paginación.
 */
export interface FiltrosPagos {
  page?: number;
  limit?: number;
  fechaInicio?: string;
  fechaFin?: string;
  metodoPago?: string;
  estado?: string;
  profesionalId?: string;
  pacienteId?: string;
}

export interface PagosPaginados {
  data: Pago[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function obtenerTodosLosPagos(
  filtros: FiltrosPagos = {}
): Promise<PagosPaginados> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.metodoPago) params.append('metodoPago', filtros.metodoPago);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.profesionalId) params.append('profesionalId', filtros.profesionalId);
  if (filtros.pacienteId) params.append('pacienteId', filtros.pacienteId);

  const response = await fetch(`${API_BASE_URL}/pagos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener pagos' }));
    throw new Error(error.message || 'Error al obtener pagos');
  }

  const data = await response.json();
  
  // Calcular totalPages si no viene en la respuesta
  const totalPages = data.totalPages || Math.ceil(data.total / (data.limit || 20));
  
  return {
    ...data,
    totalPages,
  };
}

/**
 * GET /api/pagos/paciente/:pacienteId (con paginación y filtros)
 * Obtiene la lista paginada y filtrada de todos los pagos realizados por un paciente específico.
 */
export async function obtenerPagosPorPacientePaginados(
  pacienteId: string,
  filtros: Omit<FiltrosPagos, 'pacienteId'> = {}
): Promise<PagosPaginados> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.metodoPago) params.append('metodoPago', filtros.metodoPago);
  if (filtros.estado) params.append('estado', filtros.estado);

  const response = await fetch(`${API_BASE_URL}/pagos/paciente/${pacienteId}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener pagos del paciente' }));
    throw new Error(error.message || 'Error al obtener pagos del paciente');
  }

  const data = await response.json();
  
  // Si la respuesta es un array, convertir a formato paginado
  if (Array.isArray(data)) {
    return {
      data,
      total: data.length,
      page: filtros.page || 1,
      limit: filtros.limit || 20,
      totalPages: 1,
    };
  }
  
  // Calcular totalPages si no viene en la respuesta
  const totalPages = data.totalPages || Math.ceil(data.total / (data.limit || 20));
  
  return {
    ...data,
    totalPages,
  };
}

/**
 * POST /api/pagos/:pagoId/recibo
 * Genera y devuelve un recibo en formato PDF para un pago específico.
 */
export async function generarReciboPago(
  pagoId: string
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/pagos/${pagoId}/recibo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al generar recibo' }));
    throw new Error(error.message || 'Error al generar recibo');
  }

  return response.blob();
}

