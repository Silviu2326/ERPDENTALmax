// API para gestión de pagos y pasarela de pagos
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
  tratamientos: Array<{
    _id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    saldoPendiente?: number;
  }>;
  monto: number;
  moneda: string;
  metodoPago: 'Tarjeta' | 'Efectivo' | 'Transferencia' | 'Financiacion';
  fecha: string; // ISO Date
  estado: 'Completado' | 'Pendiente' | 'Fallido';
  transaccionIdExterno?: string;
  notas?: string;
  creadoPor?: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Tratamiento {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  saldoPendiente: number;
  planTratamiento?: {
    _id: string;
    nombre: string;
  };
}

export interface DeudaPaciente {
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  };
  tratamientos: Tratamiento[];
  totalDeuda: number;
  totalPagado: number;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ProcesarPagoRequest {
  pacienteId: string;
  monto: number;
  metodoPago: 'Tarjeta' | 'Efectivo' | 'Transferencia' | 'Financiacion';
  tratamientosIds: string[];
  paymentMethodId?: string; // Token de la pasarela, solo para pagos con tarjeta
  notas?: string;
}

export interface CreatePaymentIntentRequest {
  monto: number;
  moneda?: string; // Por defecto 'EUR'
}

// POST /api/pagos/procesar
export async function procesarPago(
  datosPago: ProcesarPagoRequest
): Promise<Pago> {
  const response = await fetch(`${API_BASE_URL}/pagos/procesar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datosPago),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al procesar el pago' }));
    throw new Error(error.message || 'Error al procesar el pago');
  }

  return response.json();
}

// GET /api/pagos/paciente/:pacienteId
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

// GET /api/pagos/:pagoId
export async function obtenerDetallePago(
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

// POST /api/pagos/gateway/create-intent
export async function createPaymentIntent(
  datos: CreatePaymentIntentRequest
): Promise<PaymentIntent> {
  const response = await fetch(`${API_BASE_URL}/pagos/gateway/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      monto: datos.monto,
      moneda: datos.moneda || 'EUR',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear intent de pago' }));
    throw new Error(error.message || 'Error al crear intent de pago');
  }

  return response.json();
}

// GET /api/pacientes/:pacienteId/deuda
export async function obtenerDeudaPaciente(
  pacienteId: string
): Promise<DeudaPaciente> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/deuda`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener deuda del paciente' }));
    throw new Error(error.message || 'Error al obtener deuda del paciente');
  }

  return response.json();
}


