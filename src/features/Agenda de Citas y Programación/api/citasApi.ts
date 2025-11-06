// API para gestión de citas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Cita {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
  };
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  duracion_minutos: number;
  estado: 'programada' | 'confirmada' | 'cancelada' | 'realizada' | 'no-asistio';
  tratamiento?: {
    _id: string;
    nombre: string;
  };
  notas?: string;
  box_asignado?: string;
  creadoPor: {
    _id: string;
    nombre: string;
  };
  historial_cambios?: Array<{
    fecha: string;
    usuario: string;
    cambio: string;
  }>;
}

export interface FiltrosCalendario {
  fecha_inicio: string;
  fecha_fin: string;
  profesional_id?: string;
  sede_id?: string;
  estado?: string;
}

export interface NuevaCita {
  paciente: string;
  profesional: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  tratamiento?: string;
  notas?: string;
  box_asignado?: string;
  estado?: 'programada' | 'confirmada' | 'cancelada' | 'realizada' | 'no-asistio';
}

// Obtener citas del calendario con filtros
export async function obtenerCitasCalendario(filtros: FiltrosCalendario): Promise<Cita[]> {
  const params = new URLSearchParams({
    fecha_inicio: filtros.fecha_inicio,
    fecha_fin: filtros.fecha_fin,
  });

  if (filtros.profesional_id) {
    params.append('profesional_id', filtros.profesional_id);
  }
  if (filtros.sede_id) {
    params.append('sede_id', filtros.sede_id);
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }

  const response = await fetch(`${API_BASE_URL}/citas/calendario?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las citas del calendario');
  }

  return response.json();
}

// Obtener detalle de una cita
export async function obtenerDetalleCita(id: string): Promise<Cita> {
  const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el detalle de la cita');
  }

  return response.json();
}

// Crear una nueva cita
export async function crearCita(cita: NuevaCita): Promise<Cita> {
  const response = await fetch(`${API_BASE_URL}/citas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(cita),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la cita');
  }

  return response.json();
}

// Actualizar una cita existente
export async function actualizarCita(id: string, cita: Partial<NuevaCita>): Promise<Cita> {
  const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(cita),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la cita');
  }

  return response.json();
}

// Cancelar o eliminar una cita
export async function cancelarCita(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al cancelar la cita');
  }
}

// Interfaces adicionales
export interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  documentoIdentidad?: string;
  telefono?: string;
  email?: string;
}

export interface Profesional {
  _id: string;
  nombre: string;
  apellidos: string;
  rol: string;
  horarioLaboral?: Array<{
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
  }>;
  activo: boolean;
}

export interface Tratamiento {
  _id: string;
  nombre: string;
  descripcion?: string;
  duracionEstimadaMinutos: number;
  precio?: number;
}

export interface SlotDisponibilidad {
  start: string; // ISO Date
  end: string; // ISO Date
}

// Buscar pacientes por query (nombre, apellidos, DNI, teléfono)
export async function buscarPacientes(query: string): Promise<Paciente[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({ query: query.trim() });
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

// Obtener lista de profesionales (Odontólogo, Higienista)
export async function obtenerProfesionales(): Promise<Profesional[]> {
  const response = await fetch(`${API_BASE_URL}/usuarios/profesionales`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los profesionales');
  }

  return response.json();
}

// Obtener catálogo de tratamientos
export async function obtenerTratamientos(filter?: string): Promise<Tratamiento[]> {
  const params = new URLSearchParams();
  if (filter) {
    params.append('filter', filter);
  }

  const url = filter
    ? `${API_BASE_URL}/tratamientos?${params.toString()}`
    : `${API_BASE_URL}/tratamientos`;

  const response = await fetch(url, {
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

// Obtener disponibilidad de un profesional
export async function obtenerDisponibilidad(
  profesionalId: string,
  fechaInicio: string,
  fechaFin: string,
  duracionMinutos: number
): Promise<SlotDisponibilidad[]> {
  const params = new URLSearchParams({
    profesionalId,
    fechaInicio,
    fechaFin,
    duracionMinutos: duracionMinutos.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/agenda/disponibilidad?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la disponibilidad');
  }

  return response.json();
}

// Obtener citas semanales (según especificación del documento)
export async function obtenerCitasSemanales(
  fecha_inicio: string,
  fecha_fin: string,
  id_profesional?: string,
  id_sede?: string,
  id_box?: string
): Promise<Cita[]> {
  const params = new URLSearchParams({
    fecha_inicio,
    fecha_fin,
  });

  if (id_profesional) {
    params.append('id_profesional', id_profesional);
  }
  if (id_sede) {
    params.append('id_sede', id_sede);
  }
  if (id_box) {
    params.append('id_box', id_box);
  }

  const response = await fetch(`${API_BASE_URL}/citas/semanal?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las citas semanales');
  }

  return response.json();
}

// Mover una cita (drag and drop) - según especificación del documento
export async function moverCita(
  id: string,
  nueva_fecha_hora_inicio: string,
  id_profesional_nuevo?: string,
  id_box_nuevo?: string
): Promise<Cita> {
  const body: any = {
    nueva_fecha_hora_inicio,
  };

  if (id_profesional_nuevo) {
    body.id_profesional_nuevo = id_profesional_nuevo;
  }
  if (id_box_nuevo) {
    body.id_box_nuevo = id_box_nuevo;
  }

  const response = await fetch(`${API_BASE_URL}/citas/${id}/mover`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al mover la cita');
  }

  return response.json();
}

// Interfaces para el resumen mensual
export interface ResumenDiaCitas {
  total: number;
  estados: {
    [key: string]: number; // ej: { confirmada: 5, pendiente: 2, cancelada: 1 }
  };
}

export interface ResumenMensualCitas {
  [dia: string]: ResumenDiaCitas; // ej: { '1': { total: 8, estados: {...} }, '2': { total: 5, ... } }
}

export interface FiltrosResumenMensual {
  mes: number; // 1-12
  anio: number; // YYYY
  sedeId?: string;
  profesionalId?: string;
  estado?: string; // ej: 'confirmada,pendiente'
}

// Obtener resumen mensual de citas (agregado por día)
export async function obtenerResumenMensualCitas(
  filtros: FiltrosResumenMensual
): Promise<ResumenMensualCitas> {
  const params = new URLSearchParams({
    mes: filtros.mes.toString(),
    anio: filtros.anio.toString(),
  });

  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }
  if (filtros.profesionalId) {
    params.append('profesionalId', filtros.profesionalId);
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }

  const response = await fetch(`${API_BASE_URL}/citas/resumen-mensual?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el resumen mensual de citas');
  }

  return response.json();
}

// Interfaces para reprogramación masiva
export interface FiltrosReprogramacion {
  profesionalId?: string;
  sedeId?: string;
  fechaInicio: string; // Requerido
  fechaFin: string; // Requerido
  estado?: string;
  tratamientoId?: string;
}

export interface ResultadoReprogramacion {
  success: boolean;
  actualizadas: number;
  errores: number;
  detallesErrores: Array<{
    citaId: string;
    motivo: string;
  }>;
}

export interface DatosReprogramacion {
  citasIds: string[];
  modoReprogramacion: 'mover_dias' | 'fecha_fija';
  valor: number | string; // número de días para mover_dias, fecha ISO para fecha_fija
  notificarPacientes: boolean;
  motivo: string;
}

// Filtrar citas para reprogramación masiva
export async function filtrarCitas(filtros: FiltrosReprogramacion): Promise<Cita[]> {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.profesionalId) {
    params.append('profesionalId', filtros.profesionalId);
  }
  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }
  if (filtros.tratamientoId) {
    params.append('tratamientoId', filtros.tratamientoId);
  }

  const response = await fetch(`${API_BASE_URL}/citas/filtrar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al filtrar las citas');
  }

  return response.json();
}

// Reprogramar citas masivamente
export async function reprogramarCitasMasivo(datos: DatosReprogramacion): Promise<ResultadoReprogramacion> {
  const response = await fetch(`${API_BASE_URL}/citas/reprogramar-masivo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al reprogramar las citas');
  }

  return response.json();
}

