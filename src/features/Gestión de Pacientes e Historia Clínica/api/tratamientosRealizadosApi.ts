// API para gestión de tratamientos realizados
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface TratamientoRealizado {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  tratamientoBase: {
    _id: string;
    nombre: string;
    codigo?: string;
    precio?: number;
  };
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaRealizacion: string;
  piezaDental?: string;
  superficie?: string;
  notasClinicas?: string;
  costo: number;
  estadoPago: 'Pendiente' | 'Pagado Parcial' | 'Pagado';
  cobrosAsociados?: Array<{
    _id: string;
    monto: number;
    fecha: string;
  }>;
  createdBy: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FiltrosTratamientosRealizados {
  page?: number;
  limit?: number;
  fechaInicio?: string;
  fechaFin?: string;
  odontologoId?: string;
  piezaDental?: string;
  estadoPago?: string;
}

export interface RespuestaTratamientosRealizados {
  data: TratamientoRealizado[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NuevaNotaClinica {
  notasClinicas: string;
}

// Obtener lista paginada y filtrada de tratamientos realizados de un paciente
export async function obtenerTratamientosRealizados(
  pacienteId: string,
  filtros: FiltrosTratamientosRealizados = {}
): Promise<RespuestaTratamientosRealizados> {
  const params = new URLSearchParams();
  
  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }
  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros.odontologoId) {
    params.append('odontologoId', filtros.odontologoId);
  }
  if (filtros.piezaDental) {
    params.append('piezaDental', filtros.piezaDental);
  }
  if (filtros.estadoPago) {
    params.append('estadoPago', filtros.estadoPago);
  }

  const url = `${API_BASE_URL}/pacientes/${pacienteId}/tratamientos-realizados?${params.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los tratamientos realizados' }));
    throw new Error(error.message || 'Error al obtener los tratamientos realizados');
  }

  return response.json();
}

// Obtener detalles completos de un tratamiento realizado
export async function obtenerTratamientoRealizadoPorId(
  tratamientoId: string
): Promise<TratamientoRealizado> {
  const response = await fetch(`${API_BASE_URL}/tratamientos-realizados/${tratamientoId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el tratamiento realizado' }));
    throw new Error(error.message || 'Error al obtener el tratamiento realizado');
  }

  return response.json();
}

// Actualizar notas clínicas de un tratamiento realizado
export async function actualizarTratamientoRealizado(
  tratamientoId: string,
  datos: NuevaNotaClinica
): Promise<TratamientoRealizado> {
  const response = await fetch(`${API_BASE_URL}/tratamientos-realizados/${tratamientoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el tratamiento realizado' }));
    throw new Error(error.message || 'Error al actualizar el tratamiento realizado');
  }

  return response.json();
}

// Crear un nuevo tratamiento realizado
export interface CrearTratamientoRealizado {
  tratamientoBaseId: string;
  odontologoId: string;
  fechaRealizacion: string;
  piezaDental?: string;
  superficie?: string;
  costo: number;
  notasClinicas?: string;
}

export async function crearTratamientoRealizado(
  pacienteId: string,
  datos: CrearTratamientoRealizado
): Promise<TratamientoRealizado> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/tratamientos-realizados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el tratamiento realizado' }));
    throw new Error(error.message || 'Error al crear el tratamiento realizado');
  }

  return response.json();
}


