// API para gestión de presupuestos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Presupuesto {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
  };
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
    rol?: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  numeroPresupuesto: string;
  estado: 'Borrador' | 'Presentado' | 'Pendiente' | 'Aprobado' | 'Aceptado' | 'Rechazado' | 'Completado' | 'Anulado' | 'Finalizado';
  fechaCreacion: string;
  fechaValidez?: string;
  tratamientos: Array<{
    tratamientoId: string;
    descripcion: string;
    precio: number;
    descuento?: number;
  }>;
  subtotal: number;
  descuentoTotal: number;
  total: number;
  notas?: string;
  isDeleted?: boolean;
}

export interface FiltrosPresupuestos {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  estado?: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Completado' | 'Anulado';
  pacienteId?: string;
  profesionalId?: string;
  sedeId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  q?: string; // Término de búsqueda
}

export interface RespuestaPresupuestos {
  presupuestos: Presupuesto[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Obtener lista de presupuestos con filtros, paginación y búsqueda
export async function obtenerPresupuestos(filtros: FiltrosPresupuestos = {}): Promise<RespuestaPresupuestos> {
  const params = new URLSearchParams();

  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
  if (filtros.order) params.append('order', filtros.order);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.pacienteId) params.append('pacienteId', filtros.pacienteId);
  if (filtros.profesionalId) params.append('profesionalId', filtros.profesionalId);
  if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
  if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
  if (filtros.q) params.append('q', filtros.q);

  const response = await fetch(`${API_BASE_URL}/presupuestos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los presupuestos');
  }

  return response.json();
}

// Obtener detalle de un presupuesto por ID
export async function obtenerPresupuestoPorId(id: string): Promise<Presupuesto> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el presupuesto');
  }

  return response.json();
}

// Actualizar estado de un presupuesto
export async function actualizarEstadoPresupuesto(
  id: string,
  nuevoEstado: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Completado' | 'Anulado'
): Promise<Presupuesto> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/${id}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el estado del presupuesto');
  }

  return response.json();
}

// Eliminar un presupuesto (soft delete)
export async function eliminarPresupuesto(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el presupuesto');
  }
}

// Interfaces para crear presupuesto
export interface ItemPresupuesto {
  tratamientoId: string;
  descripcion: string;
  piezaDental?: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  total: number;
}

export interface NuevoPresupuesto {
  pacienteId: string;
  odontologoId: string;
  items: Array<{
    tratamientoId: string;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    piezaDental?: string;
  }>;
  notas?: string;
  fechaVencimiento?: string;
}

// Crear un nuevo presupuesto
export async function crearPresupuesto(presupuesto: NuevoPresupuesto): Promise<Presupuesto> {
  const response = await fetch(`${API_BASE_URL}/presupuestos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(presupuesto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el presupuesto');
  }

  return response.json();
}

// Interfaces para pacientes y tratamientos
export interface PacienteSimplificado {
  _id: string;
  nombreCompleto: string;
  dni?: string;
}

export interface PacienteCompleto {
  _id: string;
  nombre: string;
  apellidos: string;
  dni?: string;
  fechaNacimiento?: string;
  telefono?: string;
  email?: string;
}

export interface Tratamiento {
  _id: string;
  codigo: string;
  nombre: string;
  precioBase: number;
  area?: string;
  especialidad?: string;
  descripcion?: string;
}

// Buscar pacientes para presupuesto
export async function buscarPacientesPresupuesto(query: string): Promise<PacienteSimplificado[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`${API_BASE_URL}/pacientes/buscar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al buscar pacientes');
  }

  return response.json();
}

// Obtener detalle completo de un paciente
export async function obtenerPacientePorId(id: string): Promise<PacienteCompleto> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el paciente');
  }

  return response.json();
}

// Obtener lista de tratamientos
export async function obtenerTratamientos(query?: string): Promise<Tratamiento[]> {
  const params = new URLSearchParams();
  if (query) {
    params.append('query', query);
  }

  const response = await fetch(`${API_BASE_URL}/tratamientos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los tratamientos');
  }

  return response.json();
}

// Actualizar un presupuesto existente
export interface PresupuestoActualizado {
  estado?: 'Borrador' | 'Presentado' | 'Aceptado' | 'Rechazado' | 'Vencido';
  fechaVencimiento?: string;
  items: Array<{
    tratamientoId: string;
    descripcion?: string;
    piezaDental?: string;
    caraDental?: string;
    cantidad: number;
    precioUnitario: number;
    descuentoItem: number;
    totalItem: number;
  }>;
  subtotal: number;
  descuentoTotal: number;
  total: number;
  notas?: string;
}

export async function actualizarPresupuesto(
  id: string,
  presupuesto: PresupuestoActualizado
): Promise<Presupuesto> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(presupuesto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el presupuesto');
  }

  return response.json();
}

// Interfaces para aprobación de presupuestos
export interface PlanPago {
  _id: string;
  nombre: string;
  descripcion: string;
  numeroCuotas: number;
  interes: number;
  activo: boolean;
}

export interface DatosAprobacionPresupuesto {
  firmaPaciente: string; // Base64
  planPagoId: string;
  notas?: string;
}

export interface PresupuestoCompleto extends Presupuesto {
  fechaAprobacion?: string;
  firmaPaciente?: string;
  planPago?: PlanPago;
  notasAprobacion?: string;
  tratamientos: Array<{
    tratamiento: {
      _id: string;
      nombre: string;
      codigo?: string;
    };
    pieza?: string;
    cara?: string;
    precio: number;
    descuento: number;
  }>;
  totalFinal: number;
}

// Obtener planes de pago activos
export async function obtenerPlanesPago(): Promise<PlanPago[]> {
  const response = await fetch(`${API_BASE_URL}/planes-pago`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los planes de pago');
  }

  return response.json();
}

// Aprobar un presupuesto
export async function aprobarPresupuesto(
  id: string,
  datosAprobacion: DatosAprobacionPresupuesto
): Promise<PresupuestoCompleto> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/${id}/aprobar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datosAprobacion),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al aprobar el presupuesto');
  }

  return response.json();
}

