// API para gestión de alertas de reabastecimiento
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AlertaReabastecimiento {
  _id: string;
  producto: {
    _id: string;
    nombre: string;
    sku: string;
    stock_minimo: number;
    proveedor_preferido?: {
      _id: string;
      nombre: string;
    };
  };
  sede: {
    _id: string;
    nombre: string;
  };
  stock_actual: number;
  stock_minimo_al_generar: number;
  cantidad_sugerida_pedido: number;
  estado: 'nueva' | 'revisada' | 'en_proceso_compra' | 'resuelta';
  fecha_creacion: string;
  usuario_revisor?: {
    _id: string;
    nombre: string;
  };
  fecha_resolucion?: string;
}

export interface FiltrosAlertas {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  sedeId?: string;
  estado?: 'nueva' | 'revisada' | 'en_proceso_compra' | 'resuelta';
}

export interface RespuestaAlertas {
  data: AlertaReabastecimiento[];
  total: number;
  page: number;
  limit: number;
}

export interface OrdenCompraCreada {
  _id: string;
  numero_orden: string;
  estado: 'borrador';
  [key: string]: any;
}

// Obtener lista paginada y filtrada de alertas de reabastecimiento
export async function obtenerAlertas(filtros: FiltrosAlertas = {}): Promise<RespuestaAlertas> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
  if (filtros.sortOrder) params.append('sortOrder', filtros.sortOrder);
  if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
  if (filtros.estado) params.append('estado', filtros.estado);

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/inventario/alertas?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener alertas' }));
    throw new Error(error.message || 'Error al obtener alertas');
  }

  return response.json();
}

// Actualizar el estado de una alerta
export async function actualizarEstadoAlerta(
  alertaId: string,
  estado: 'nueva' | 'revisada' | 'en_proceso_compra' | 'resuelta'
): Promise<AlertaReabastecimiento> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/inventario/alertas/${alertaId}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ estado }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar alerta' }));
    throw new Error(error.message || 'Error al actualizar alerta');
  }

  return response.json();
}

// Crear orden de compra desde una alerta
export async function crearOrdenCompraDesdeAlerta(
  alertaId: string,
  cantidad?: number
): Promise<OrdenCompraCreada> {
  const token = localStorage.getItem('token');
  const body: { cantidad?: number } = {};
  if (cantidad !== undefined) {
    body.cantidad = cantidad;
  }

  const response = await fetch(`${API_BASE_URL}/inventario/alertas/${alertaId}/crear-orden-compra`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear orden de compra' }));
    throw new Error(error.message || 'Error al crear orden de compra');
  }

  return response.json();
}


