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
  canalConfirmacion?: 'email' | 'sms' | 'whatsapp'; // Canal utilizado para confirmación/cancelación
  fechaConfirmacion?: string; // Fecha de confirmación/cancelación
  documentos?: Array<{
    _id: string;
    nombre: string;
    tipo: string; // MIME type
    tamaño: number; // en bytes
    url: string; // URL para descarga
    version: number;
    subidoPor: {
      _id: string;
      nombre: string;
    };
    fechaSubida: string; // ISO string
    descripcion?: string;
  }>;
  tags?: string[]; // Tags del paciente (VIP, ansioso, movilidad reducida, etc.)
}

export interface FiltrosCalendario {
  fecha_inicio: string;
  fecha_fin: string;
  profesional_id?: string;
  sede_id?: string;
  estado?: string;
  box_id?: string;
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

// Interfaces para citas pendientes (sin hora asignada)
export interface CitaPendiente {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
  };
  profesional?: {
    _id: string;
    nombre: string;
    apellidos: string;
    especialidad?: string;
  };
  tratamiento?: {
    _id: string;
    nombre: string;
    duracionEstimadaMinutos?: number;
  };
  especialidad?: string;
  notas?: string;
  fechaCreacion: string;
  descartada?: boolean;
  fechaDescarte?: string;
}

// Obtener citas pendientes (sin hora asignada)
export async function obtenerCitasPendientes(filtroEspecialidad?: string): Promise<CitaPendiente[]> {
  const params = new URLSearchParams();
  if (filtroEspecialidad) {
    params.append('especialidad', filtroEspecialidad);
  }

  const url = filtroEspecialidad
    ? `${API_BASE_URL}/citas/pendientes?${params.toString()}`
    : `${API_BASE_URL}/citas/pendientes`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las citas pendientes');
  }

  return response.json();
}

// Programar una cita pendiente (asignarle fecha y hora)
export async function programarCitaPendiente(
  citaPendienteId: string,
  fechaHoraInicio: string,
  profesionalId?: string,
  boxId?: string
): Promise<Cita> {
  const body: any = {
    fecha_hora_inicio: fechaHoraInicio,
  };

  if (profesionalId) {
    body.profesional_id = profesionalId;
  }
  if (boxId) {
    body.box_id = boxId;
  }

  const response = await fetch(`${API_BASE_URL}/citas/pendientes/${citaPendienteId}/programar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al programar la cita pendiente');
  }

  return response.json();
}

// Marcar una cita pendiente como descartada
export async function descartarCitaPendiente(citaPendienteId: string, motivo?: string): Promise<void> {
  const body: any = {};
  if (motivo) {
    body.motivo = motivo;
  }

  const response = await fetch(`${API_BASE_URL}/citas/pendientes/${citaPendienteId}/descartar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al descartar la cita pendiente');
  }
}

// Interfaces para lista de espera
export interface ItemListaEspera {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
  };
  profesional?: {
    _id: string;
    nombre: string;
    apellidos: string;
    especialidad?: string;
  };
  tratamiento?: {
    _id: string;
    nombre: string;
    duracionEstimadaMinutos?: number;
  };
  especialidad?: string;
  fechaPreferida?: string; // ISO Date
  horaPreferida?: string; // HH:mm
  notas?: string;
  fechaCreacion: string;
  prioridad?: 'alta' | 'media' | 'baja';
  intentosReasignacion?: Array<{
    fecha: string;
    slotSugerido: {
      fecha: string;
      hora: string;
      profesionalId?: string;
    };
    resultado: 'aceptado' | 'rechazado' | 'no_disponible';
    motivo?: string;
    usuario: string;
  }>;
}

export interface SlotSugerido {
  fecha: string; // ISO Date
  hora: string; // HH:mm
  profesionalId?: string;
  boxId?: string;
  duracionMinutos: number;
  puntuacion: number; // 0-100, mayor es mejor
  razon: string; // Por qué se sugiere este slot
}

// Obtener lista de espera
export async function obtenerListaEspera(filtroEspecialidad?: string): Promise<ItemListaEspera[]> {
  const params = new URLSearchParams();
  if (filtroEspecialidad) {
    params.append('especialidad', filtroEspecialidad);
  }

  const url = filtroEspecialidad
    ? `${API_BASE_URL}/lista-espera?${params.toString()}`
    : `${API_BASE_URL}/lista-espera`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la lista de espera');
  }

  return response.json();
}

// Agregar paciente a lista de espera
export async function agregarAListaEspera(datos: {
  pacienteId: string;
  profesionalId?: string;
  tratamientoId?: string;
  especialidad?: string;
  fechaPreferida?: string;
  horaPreferida?: string;
  notas?: string;
  prioridad?: 'alta' | 'media' | 'baja';
}): Promise<ItemListaEspera> {
  const response = await fetch(`${API_BASE_URL}/lista-espera`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al agregar a la lista de espera');
  }

  return response.json();
}

// Obtener slots sugeridos para un item de lista de espera
export async function obtenerSlotsSugeridos(
  itemId: string,
  fechaInicio?: string,
  fechaFin?: string
): Promise<SlotSugerido[]> {
  const params = new URLSearchParams();
  if (fechaInicio) {
    params.append('fechaInicio', fechaInicio);
  }
  if (fechaFin) {
    params.append('fechaFin', fechaFin);
  }

  const url = params.toString()
    ? `${API_BASE_URL}/lista-espera/${itemId}/slots-sugeridos?${params.toString()}`
    : `${API_BASE_URL}/lista-espera/${itemId}/slots-sugeridos`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener slots sugeridos');
  }

  return response.json();
}

// Asignar slot a item de lista de espera
export async function asignarSlotListaEspera(
  itemId: string,
  slot: {
    fecha: string;
    hora: string;
    profesionalId?: string;
    boxId?: string;
  }
): Promise<Cita> {
  const response = await fetch(`${API_BASE_URL}/lista-espera/${itemId}/asignar-slot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(slot),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al asignar el slot');
  }

  return response.json();
}

// Registrar intento de reasignación
export async function registrarIntentoReasignacion(
  itemId: string,
  intento: {
    slotSugerido: {
      fecha: string;
      hora: string;
      profesionalId?: string;
    };
    resultado: 'aceptado' | 'rechazado' | 'no_disponible';
    motivo?: string;
  }
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/lista-espera/${itemId}/intento-reasignacion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(intento),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar el intento de reasignación');
  }
}

// Eliminar item de lista de espera
export async function eliminarDeListaEspera(itemId: string, motivo?: string): Promise<void> {
  const body: any = {};
  if (motivo) {
    body.motivo = motivo;
  }

  const response = await fetch(`${API_BASE_URL}/lista-espera/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar de la lista de espera');
  }
}

// Interfaces para solicitudes online
export interface SolicitudOnline {
  _id: string;
  paciente: {
    _id?: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email: string;
    documentoIdentidad?: string;
  };
  profesional?: {
    _id: string;
    nombre: string;
    apellidos: string;
    especialidad?: string;
  };
  tratamiento: {
    _id: string;
    nombre: string;
    duracionEstimadaMinutos: number;
  };
  fechaHoraSolicitada?: string; // ISO Date - horario preferido del paciente
  fechaHoraAlternativa?: string; // ISO Date - horario propuesto por recepcionista
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'alternativa_propuesta';
  notas?: string;
  fechaCreacion: string;
  origen: 'portal_web' | 'app_movil';
  citaConfirmadaId?: string; // ID de la cita creada si fue aprobada
}

// Obtener solicitudes online pendientes
export async function obtenerSolicitudesOnlinePendientes(): Promise<SolicitudOnline[]> {
  const response = await fetch(`${API_BASE_URL}/solicitudes-online/pendientes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las solicitudes online pendientes');
  }

  return response.json();
}

// Aprobar una solicitud online y crear la cita
export async function aprobarSolicitudOnline(
  solicitudId: string,
  fechaHoraInicio: string,
  profesionalId?: string,
  boxId?: string,
  enviarEmail: boolean = true
): Promise<Cita> {
  const body: any = {
    fecha_hora_inicio: fechaHoraInicio,
    enviar_email: enviarEmail,
  };

  if (profesionalId) {
    body.profesional_id = profesionalId;
  }
  if (boxId) {
    body.box_id = boxId;
  }

  const response = await fetch(`${API_BASE_URL}/solicitudes-online/${solicitudId}/aprobar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al aprobar la solicitud online');
  }

  return response.json();
}

// Proponer horario alternativo para una solicitud online
export async function proponerHorarioAlternativo(
  solicitudId: string,
  fechaHoraAlternativa: string,
  profesionalId?: string,
  boxId?: string,
  mensaje?: string,
  enviarEmail: boolean = true
): Promise<SolicitudOnline> {
  const body: any = {
    fecha_hora_alternativa: fechaHoraAlternativa,
    enviar_email: enviarEmail,
  };

  if (profesionalId) {
    body.profesional_id = profesionalId;
  }
  if (boxId) {
    body.box_id = boxId;
  }
  if (mensaje) {
    body.mensaje = mensaje;
  }

  const response = await fetch(`${API_BASE_URL}/solicitudes-online/${solicitudId}/proponer-alternativa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al proponer horario alternativo');
  }

  return response.json();
}

// Rechazar una solicitud online
export async function rechazarSolicitudOnline(
  solicitudId: string,
  motivo?: string,
  enviarEmail: boolean = true
): Promise<void> {
  const body: any = {
    enviar_email: enviarEmail,
  };

  if (motivo) {
    body.motivo = motivo;
  }

  const response = await fetch(`${API_BASE_URL}/solicitudes-online/${solicitudId}/rechazar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al rechazar la solicitud online');
  }
}

// Interfaces para recordatorios
export interface RecordatorioCita {
  _id?: string;
  citaId: string;
  tipo: 'email' | 'sms' | 'whatsapp';
  diasAntes: number; // Días antes de la cita para enviar el recordatorio
  horaEnvio?: string; // HH:mm - hora del día para enviar
  activo: boolean;
  plantillaId?: string; // ID de la plantilla de mensaje
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface HistorialRecordatorio {
  _id: string;
  recordatorioId: string;
  citaId: string;
  tipo: 'email' | 'sms' | 'whatsapp';
  fechaEnvio: string;
  estado: 'enviado' | 'fallido' | 'pendiente';
  destinatario: string; // email o teléfono
  mensaje?: string;
  error?: string;
  fechaProgramada: string; // Fecha programada original
}

// Obtener recordatorios de una cita
export async function obtenerRecordatoriosCita(citaId: string): Promise<RecordatorioCita[]> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/recordatorios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los recordatorios de la cita');
  }

  return response.json();
}

// Crear o actualizar recordatorio de cita
export async function guardarRecordatorioCita(
  citaId: string,
  recordatorio: Omit<RecordatorioCita, '_id' | 'citaId' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<RecordatorioCita> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/recordatorios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(recordatorio),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al guardar el recordatorio');
  }

  return response.json();
}

// Actualizar recordatorio existente
export async function actualizarRecordatorioCita(
  recordatorioId: string,
  recordatorio: Partial<Omit<RecordatorioCita, '_id' | 'citaId' | 'fechaCreacion'>>,
): Promise<RecordatorioCita> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/${recordatorioId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(recordatorio),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el recordatorio');
  }

  return response.json();
}

// Eliminar recordatorio
export async function eliminarRecordatorioCita(recordatorioId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/${recordatorioId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el recordatorio');
  }
}

// Obtener historial de recordatorios de una cita
export async function obtenerHistorialRecordatoriosCita(citaId: string): Promise<HistorialRecordatorio[]> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/recordatorios/historial`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de recordatorios');
  }

  return response.json();
}

// Obtener próximos envíos programados de recordatorios para una cita
export async function obtenerProximosEnvíosRecordatorios(citaId: string): Promise<HistorialRecordatorio[]> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/recordatorios/proximos-envios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los próximos envíos de recordatorios');
  }

  return response.json();
}

// Interfaces para gestión de documentos
export interface DocumentoCita {
  _id?: string;
  nombre: string;
  tipo: string; // MIME type
  tamaño: number; // en bytes
  url: string; // URL para descarga
  version: number;
  subidoPor: {
    _id: string;
    nombre: string;
  };
  fechaSubida: string; // ISO string
  descripcion?: string;
}

// Subir documento a una cita
export async function subirDocumentoCita(
  citaId: string,
  file: File,
  descripcion?: string
): Promise<DocumentoCita> {
  const formData = new FormData();
  formData.append('archivo', file);
  if (descripcion) {
    formData.append('descripcion', descripcion);
  }

  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/documentos`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir el documento');
  }

  return response.json();
}

// Eliminar documento de una cita
export async function eliminarDocumentoCita(citaId: string, documentoId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/documentos/${documentoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el documento');
  }
}

// Descargar documento de una cita
export async function descargarDocumentoCita(citaId: string, documentoId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/documentos/${documentoId}/descargar`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al descargar el documento');
  }

  return response.blob();
}

// Obtener documentos de una cita
export async function obtenerDocumentosCita(citaId: string): Promise<DocumentoCita[]> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/documentos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los documentos de la cita');
  }

  return response.json();
}

// Interfaces para historial de cambios
export interface HistorialCambio {
  _id: string;
  fecha: string;
  usuario: string;
  cambio: string;
  tipoEvento: 'creacion' | 'actualizacion' | 'cancelacion' | 'confirmacion' | 'reprogramacion' | 'drag_drop' | 'api' | 'resize' | 'otro';
  detalles?: {
    campo?: string;
    valorAnterior?: any;
    valorNuevo?: any;
    origen?: 'drag_drop' | 'api' | 'formulario';
    ipAddress?: string;
    userAgent?: string;
  };
}

// Obtener historial de cambios de una cita
export async function obtenerHistorialCita(citaId: string): Promise<HistorialCambio[]> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/historial`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de la cita');
  }

  return response.json();
}

// Exportar historial de una cita
export async function exportarHistorialCita(
  citaId: string,
  formato: 'csv' | 'excel',
  filtros?: { tipoEvento?: string }
): Promise<Blob> {
  const params = new URLSearchParams({ formato });
  if (filtros?.tipoEvento) {
    params.append('tipoEvento', filtros.tipoEvento);
  }

  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/historial/exportar?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al exportar el historial');
  }

  return response.blob();
}

// Interfaces para heatmap
export interface DatosHeatmap {
  hora: number;
  dia: number;
  cantidad: number;
  porcentaje: number;
}

export interface HoraPico {
  hora: number;
  cantidad: number;
  rango: 'dia' | 'semana' | 'mes';
  fechaInicio: string;
  fechaFin: string;
}

// Obtener datos para heatmap
export async function obtenerDatosHeatmap(
  filtros: FiltrosCalendario,
  rango: 'dia' | 'semana' | 'mes'
): Promise<DatosHeatmap[]> {
  const params = new URLSearchParams({
    fecha_inicio: filtros.fecha_inicio,
    fecha_fin: filtros.fecha_fin,
    rango,
  });

  if (filtros.profesional_id) {
    params.append('profesional_id', filtros.profesional_id);
  }
  if (filtros.sede_id) {
    params.append('sede_id', filtros.sede_id);
  }

  const response = await fetch(`${API_BASE_URL}/citas/heatmap?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los datos del heatmap');
  }

  return response.json();
}

// Registrar hora pico seleccionada
export async function registrarHoraPico(datos: HoraPico): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/citas/heatmap/hora-pico`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al registrar la hora pico');
  }
}

