// API para gestión de lotes y caducidades
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface LoteProducto {
  _id?: string;
  producto: {
    _id: string;
    nombre: string;
    sku?: string;
  };
  numeroLote: string;
  fechaCaducidad: string;
  fechaRecepcion: string;
  cantidadInicial: number;
  cantidadActual: number;
  estado: 'Activo' | 'PorCaducar' | 'Caducado';
  historialConsumo?: Array<{
    tratamientoId?: string;
    cantidad: number;
    fecha: string;
  }>;
}

export interface FiltrosLotes {
  page?: number;
  limit?: number;
  productoId?: string;
  fechaCaducidadAntes?: string;
  fechaCaducidadDespues?: string;
  estado?: 'Activo' | 'PorCaducar' | 'Caducado';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface NuevaLote {
  producto: string;
  numeroLote: string;
  fechaCaducidad: string;
  cantidadInicial: number;
}

export interface ConsumoLote {
  cantidadConsumida: number;
  tratamientoId?: string;
}

export interface RespuestaListaLotes {
  lotes: LoteProducto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AlertasCaducidad {
  caducados: LoteProducto[];
  porCaducar: LoteProducto[];
}

// Obtener lista de lotes con filtros y paginación
export async function obtenerLotes(filtros: FiltrosLotes): Promise<RespuestaListaLotes> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.productoId) params.append('productoId', filtros.productoId);
  if (filtros.fechaCaducidadAntes) params.append('fechaCaducidadAntes', filtros.fechaCaducidadAntes);
  if (filtros.fechaCaducidadDespues) params.append('fechaCaducidadDespues', filtros.fechaCaducidadDespues);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
  if (filtros.sortOrder) params.append('sortOrder', filtros.sortOrder);

  const response = await fetch(`${API_BASE_URL}/inventario/lotes?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los lotes');
  }

  return response.json();
}

// Crear un nuevo lote
export async function crearLote(nuevoLote: NuevaLote): Promise<LoteProducto> {
  const response = await fetch(`${API_BASE_URL}/inventario/lotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(nuevoLote),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el lote' }));
    throw new Error(error.message || 'Error al crear el lote');
  }

  return response.json();
}

// Obtener detalle de un lote por ID
export async function obtenerLotePorId(id: string): Promise<LoteProducto> {
  const response = await fetch(`${API_BASE_URL}/inventario/lotes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el detalle del lote');
  }

  return response.json();
}

// Registrar consumo de un lote
export async function registrarConsumoLote(id: string, consumo: ConsumoLote): Promise<LoteProducto> {
  const response = await fetch(`${API_BASE_URL}/inventario/lotes/${id}/consumir`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(consumo),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al registrar el consumo' }));
    throw new Error(error.message || 'Error al registrar el consumo');
  }

  return response.json();
}

// Obtener alertas de caducidad
export async function obtenerAlertasCaducidad(diasAnticipacion: number = 30): Promise<AlertasCaducidad> {
  const params = new URLSearchParams();
  params.append('diasAnticipacion', diasAnticipacion.toString());

  const response = await fetch(`${API_BASE_URL}/inventario/lotes/alertas?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las alertas de caducidad');
  }

  return response.json();
}



