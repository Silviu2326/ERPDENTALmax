// API para gestión de pagos y recibos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces para Pagos
export interface Pago {
  _id?: string;
  numeroRecibo: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  };
  factura: {
    _id: string;
    numeroFactura: string;
    total: number;
    saldoPendiente: number;
  };
  monto: number;
  metodoPago: 'Efectivo' | 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia' | 'Cheque' | 'Otro';
  fechaPago: string; // ISO Date
  responsableRegistro: {
    _id: string;
    nombre: string;
  };
  notas?: string;
  estado: 'Completado' | 'Anulado';
  createdAt?: string;
  updatedAt?: string;
}

export interface FacturaPendiente {
  _id: string;
  numeroFactura: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  total: number;
  saldoPendiente: number;
  fechaEmision: string;
  fechaVencimiento?: string;
  estado: 'Pendiente' | 'Pagada Parcialmente';
}

export interface NuevoPagoData {
  pacienteId: string;
  facturaId: string;
  monto: number;
  metodoPago: 'Efectivo' | 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia' | 'Cheque' | 'Otro';
  fechaPago: string; // ISO Date
  notas?: string;
}

export interface PagosResponse {
  data: Pago[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FiltrosPagos {
  page?: number;
  limit?: number;
  fechaInicio?: string; // YYYY-MM-DD
  fechaFin?: string; // YYYY-MM-DD
  pacienteId?: string;
  metodoPago?: string;
  estado?: string;
}

export interface DatosRecibo {
  numeroRecibo: string;
  fechaEmision: string;
  datosClinica: {
    nombre: string;
    cif?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
  };
  paciente: {
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
    direccion?: string;
  };
  factura: {
    numeroFactura: string;
    fechaEmision: string;
  };
  pago: {
    monto: number;
    metodoPago: string;
    fechaPago: string;
  };
  notas?: string;
}

// GET /api/pagos
export async function obtenerPagos(filtros: FiltrosPagos = {}): Promise<PagosResponse> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.pacienteId) params.append('pacienteId', filtros.pacienteId);
  if (filtros.metodoPago) params.append('metodoPago', filtros.metodoPago);
  if (filtros.estado) params.append('estado', filtros.estado);

  const response = await fetch(`${API_BASE_URL}/pagos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los pagos' }));
    throw new Error(error.message || 'Error al obtener los pagos');
  }

  return response.json();
}

// POST /api/pagos
export async function crearPago(datos: NuevoPagoData): Promise<Pago> {
  const response = await fetch(`${API_BASE_URL}/pagos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al registrar el pago' }));
    throw new Error(error.message || 'Error al registrar el pago');
  }

  return response.json();
}

// GET /api/pagos/:id
export async function obtenerPagoPorId(id: string): Promise<Pago> {
  const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el pago' }));
    throw new Error(error.message || 'Error al obtener el pago');
  }

  return response.json();
}

// GET /api/pagos/:id/recibo
export async function obtenerDatosRecibo(id: string): Promise<DatosRecibo> {
  const response = await fetch(`${API_BASE_URL}/pagos/${id}/recibo`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los datos del recibo' }));
    throw new Error(error.message || 'Error al obtener los datos del recibo');
  }

  return response.json();
}

// DELETE /api/pagos/:id
export async function anularPago(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al anular el pago' }));
    throw new Error(error.message || 'Error al anular el pago');
  }

  return response.json();
}

// GET /api/pacientes/:pacienteId/facturas-pendientes
export async function obtenerFacturasPendientes(pacienteId: string): Promise<FacturaPendiente[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/facturas-pendientes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las facturas pendientes' }));
    throw new Error(error.message || 'Error al obtener las facturas pendientes');
  }

  return response.json();
}

// GET /api/pacientes/buscar (para buscar pacientes al registrar pago)
export async function buscarPacientesParaPago(query: string): Promise<Array<{
  _id: string;
  nombre: string;
  apellidos: string;
  documentoIdentidad?: string;
}>> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
  });

  const response = await fetch(`${API_BASE_URL}/pacientes/buscar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al buscar pacientes' }));
    throw new Error(error.message || 'Error al buscar pacientes');
  }

  return response.json();
}



