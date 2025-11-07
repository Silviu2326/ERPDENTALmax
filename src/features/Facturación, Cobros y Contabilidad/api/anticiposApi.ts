// API para gestión de anticipos y señales
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Anticipo {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  };
  monto: number;
  fecha: string; // ISO Date
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  estado: 'disponible' | 'aplicado' | 'devuelto';
  facturaAplicada?: {
    _id: string;
    numeroFactura: string;
  };
  planTratamiento?: {
    _id: string;
    nombre: string;
  };
  creadoPor: {
    _id: string;
    nombre: string;
  };
  observacion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevoAnticipo {
  pacienteId: string;
  monto: number;
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  observacion?: string;
  planTratamientoId?: string;
}

export interface AplicarAnticipo {
  facturaId: string;
  montoAplicado: number;
}

export interface FiltrosAnticipos {
  page?: number;
  limit?: number;
  pacienteId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: 'disponible' | 'aplicado' | 'devuelto';
}

export interface ListaAnticiposResponse {
  data: Anticipo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// POST /api/anticipos
export async function crearAnticipo(datos: NuevoAnticipo): Promise<Anticipo> {
  const response = await fetch(`${API_BASE_URL}/anticipos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el anticipo' }));
    throw new Error(error.message || 'Error al crear el anticipo');
  }

  return response.json();
}

// GET /api/anticipos
export async function listarAnticipos(filtros: FiltrosAnticipos = {}): Promise<ListaAnticiposResponse> {
  const params = new URLSearchParams();

  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }
  if (filtros.pacienteId) {
    params.append('pacienteId', filtros.pacienteId);
  }
  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }

  const response = await fetch(`${API_BASE_URL}/anticipos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los anticipos');
  }

  return response.json();
}

// GET /api/anticipos/:id
export async function obtenerAnticipoPorId(id: string): Promise<Anticipo> {
  const response = await fetch(`${API_BASE_URL}/anticipos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el anticipo');
  }

  return response.json();
}

// PUT /api/anticipos/:id/aplicar
export async function aplicarAnticipoAFactura(id: string, datos: AplicarAnticipo): Promise<Anticipo> {
  const response = await fetch(`${API_BASE_URL}/anticipos/${id}/aplicar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al aplicar el anticipo' }));
    throw new Error(error.message || 'Error al aplicar el anticipo');
  }

  return response.json();
}

// DELETE /api/anticipos/:id
export async function anularAnticipo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/anticipos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al anular el anticipo' }));
    throw new Error(error.message || 'Error al anular el anticipo');
  }
}



