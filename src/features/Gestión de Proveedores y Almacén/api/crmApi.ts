// API para Panel de CRM de Proveedores
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ProveedorKPIs {
  totalProveedores: number;
  contratosActivos: number;
  gastoUltimoMes: number;
  calificacionMedia: number;
  proveedoresPorCategoria: Array<{ categoria: string; cantidad: number }>;
}

export interface Comunicacion {
  _id?: string;
  proveedorId: string;
  proveedor?: {
    _id: string;
    nombreComercial: string;
  };
  usuarioId: string;
  usuario?: {
    _id: string;
    nombre: string;
  };
  fecha: string;
  tipo: 'Email' | 'Llamada' | 'Reunión';
  resumen: string;
  adjuntos?: string[];
  createdAt?: string;
}

export interface Contrato {
  _id?: string;
  proveedorId: string;
  proveedor?: {
    _id: string;
    nombreComercial: string;
  };
  fechaInicio: string;
  fechaFin: string;
  terminos: string;
  documentoUrl?: string;
  estado: 'Activo' | 'Vencido' | 'Cancelado';
  diasRestantes?: number;
}

export interface RendimientoAnual {
  mes: number;
  gasto: number;
  calificacion: number;
  pedidos: number;
}

export interface FiltrosComunicaciones {
  proveedorId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipo?: 'Email' | 'Llamada' | 'Reunión';
  page?: number;
  limit?: number;
}

export interface RespuestaComunicaciones {
  comunicaciones: Comunicacion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Obtiene los KPIs del dashboard principal
 */
export async function obtenerKPIs(sedeId?: string): Promise<ProveedorKPIs> {
  const url = new URL(`${API_BASE_URL}/proveedores/crm/kpis`);
  if (sedeId) {
    url.searchParams.append('sedeId', sedeId);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener KPIs del CRM');
  }

  return response.json();
}

/**
 * Obtiene una lista paginada de comunicaciones con proveedores
 */
export async function obtenerComunicaciones(
  filtros?: FiltrosComunicaciones
): Promise<RespuestaComunicaciones> {
  const url = new URL(`${API_BASE_URL}/proveedores/crm/comunicaciones`);

  if (filtros) {
    if (filtros.proveedorId) url.searchParams.append('proveedorId', filtros.proveedorId);
    if (filtros.fechaInicio) url.searchParams.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) url.searchParams.append('fechaFin', filtros.fechaFin);
    if (filtros.tipo) url.searchParams.append('tipo', filtros.tipo);
    if (filtros.page) url.searchParams.append('page', filtros.page.toString());
    if (filtros.limit) url.searchParams.append('limit', filtros.limit.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener comunicaciones');
  }

  return response.json();
}

/**
 * Registra una nueva comunicación con un proveedor
 */
export async function crearComunicacion(
  comunicacion: Omit<Comunicacion, '_id' | 'createdAt'>
): Promise<Comunicacion> {
  const response = await fetch(`${API_BASE_URL}/proveedores/crm/comunicaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(comunicacion),
  });

  if (!response.ok) {
    throw new Error('Error al crear comunicación');
  }

  return response.json();
}

/**
 * Obtiene contratos que están próximos a vencer
 */
export async function obtenerContratosPorVencer(diasLimite: number = 60): Promise<Contrato[]> {
  const url = new URL(`${API_BASE_URL}/proveedores/crm/contratos/por-vencer`);
  url.searchParams.append('diasLimite', diasLimite.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener contratos por vencer');
  }

  return response.json();
}

/**
 * Obtiene datos de rendimiento anual para un proveedor específico
 */
export async function obtenerRendimientoAnual(
  proveedorId: string,
  anio: number
): Promise<RendimientoAnual[]> {
  const url = new URL(`${API_BASE_URL}/proveedores/crm/rendimiento-anual`);
  url.searchParams.append('proveedorId', proveedorId);
  url.searchParams.append('anio', anio.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener rendimiento anual');
  }

  return response.json();
}



