// API para gestión de liquidaciones de mutuas/seguros
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Tratamiento {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
  };
  fecha: string;
  prestacion: {
    _id: string;
    nombre: string;
    codigo?: string;
  };
  mutua: {
    _id: string;
    nombre: string;
  };
  importeTotal: number;
  importePaciente: number;
  importeMutua: number;
  estadoLiquidacion: 'pendiente' | 'liquidado';
  liquidacionId?: string;
}

export interface Liquidacion {
  _id: string;
  mutua: {
    _id: string;
    nombre: string;
    cif?: string;
  };
  codigo: string;
  fechaCreacion: string;
  fechaDesde: string;
  fechaHasta: string;
  tratamientos: Tratamiento[];
  importeTotal: number;
  importePagado: number;
  fechaPago?: string;
  estado: 'pendiente' | 'enviada' | 'conciliada' | 'parcial';
  notas?: string;
}

export interface FiltrosTratamientosPendientes {
  mutuaId: string;
  fechaDesde: string;
  fechaHasta: string;
}

export interface NuevaLiquidacion {
  mutuaId: string;
  fechaDesde: string;
  fechaHasta: string;
  tratamientoIds: string[];
}

export interface FiltrosHistorialLiquidaciones {
  page?: number;
  limit?: number;
  mutuaId?: string;
  estado?: 'pendiente' | 'enviada' | 'conciliada' | 'parcial';
}

export interface HistorialLiquidacionesResponse {
  data: Liquidacion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ConciliarPagoData {
  fechaPago: string;
  importePagado: number;
  referencia?: string;
  notas?: string;
}

// Obtener tratamientos pendientes de liquidación
export async function obtenerTratamientosPendientes(
  filtros: FiltrosTratamientosPendientes
): Promise<Tratamiento[]> {
  const params = new URLSearchParams({
    mutuaId: filtros.mutuaId,
    fechaDesde: filtros.fechaDesde,
    fechaHasta: filtros.fechaHasta,
  });

  const response = await fetch(`${API_BASE_URL}/liquidaciones/tratamientos-pendientes?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los tratamientos pendientes');
  }

  return response.json();
}

// Crear una nueva liquidación
export async function crearLiquidacion(datos: NuevaLiquidacion): Promise<Liquidacion> {
  const response = await fetch(`${API_BASE_URL}/liquidaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la liquidación' }));
    throw new Error(error.message || 'Error al crear la liquidación');
  }

  return response.json();
}

// Obtener historial de liquidaciones
export async function obtenerHistorialLiquidaciones(
  filtros: FiltrosHistorialLiquidaciones = {}
): Promise<HistorialLiquidacionesResponse> {
  const params = new URLSearchParams();
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.mutuaId) params.append('mutuaId', filtros.mutuaId);
  if (filtros.estado) params.append('estado', filtros.estado);

  const response = await fetch(`${API_BASE_URL}/liquidaciones?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de liquidaciones');
  }

  return response.json();
}

// Obtener detalle de una liquidación
export async function obtenerDetalleLiquidacion(id: string): Promise<Liquidacion> {
  const response = await fetch(`${API_BASE_URL}/liquidaciones/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el detalle de la liquidación');
  }

  return response.json();
}

// Conciliar pago de una liquidación
export async function conciliarPagoLiquidacion(
  id: string,
  datos: ConciliarPagoData
): Promise<Liquidacion> {
  const response = await fetch(`${API_BASE_URL}/liquidaciones/${id}/conciliar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al conciliar el pago' }));
    throw new Error(error.message || 'Error al conciliar el pago');
  }

  return response.json();
}

// Generar PDF de liquidación
export async function generarPDFLiquidacion(id: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/liquidaciones/${id}/pdf`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al generar el PDF de la liquidación');
  }

  return response.blob();
}

// Generar Excel de liquidación
export async function generarExcelLiquidacion(id: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/liquidaciones/${id}/excel`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al generar el Excel de la liquidación');
  }

  return response.blob();
}



