// API para gestión de recordatorios de citas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface RecordatorioPlantilla {
  _id?: string;
  nombre: string;
  tipo: 'SMS' | 'Email' | 'WhatsApp';
  asunto?: string;
  cuerpo: string;
  variables: string[];
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordatorioHistorial {
  _id?: string;
  cita: {
    _id: string;
    fecha_hora_inicio: string;
    paciente: {
      _id: string;
      nombre: string;
      apellidos: string;
      telefono?: string;
      email?: string;
    };
  };
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  plantilla: {
    _id: string;
    nombre: string;
    tipo: string;
  };
  canal: string;
  fecha_envio: string;
  estado: 'Pendiente' | 'Enviado' | 'Entregado' | 'Fallido' | 'Confirmado' | 'Cancelado';
  respuesta_paciente?: string;
  id_mensaje_proveedor?: string;
}

export interface ConfiguracionRecordatorio {
  activado: boolean;
  reglas_envio: Array<{
    tiempo_antes: number;
    unidad: 'horas' | 'dias';
    plantillaId: string;
  }>;
  canales_activos: string[];
  plantilla_defecto_id?: string;
  webhooks?: {
    twilio_sid?: string;
  };
}

export interface FiltrosHistorial {
  fechaInicio?: string;
  fechaFin?: string;
  pacienteId?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

export interface HistorialResponse {
  historial: RecordatorioHistorial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Obtener historial de recordatorios
export async function obtenerHistorialRecordatorios(
  filtros: FiltrosHistorial = {}
): Promise<HistorialResponse> {
  const params = new URLSearchParams();
  
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.pacienteId) params.append('pacienteId', filtros.pacienteId);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());

  const response = await fetch(`${API_BASE_URL}/recordatorios/historial?${params.toString()}`, {
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

// Obtener configuración actual
export async function obtenerConfiguracionRecordatorios(): Promise<ConfiguracionRecordatorio> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/configuracion`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la configuración de recordatorios');
  }

  return response.json();
}

// Actualizar configuración
export async function actualizarConfiguracionRecordatorios(
  configuracion: Partial<ConfiguracionRecordatorio>
): Promise<ConfiguracionRecordatorio> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/configuracion`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(configuracion),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la configuración de recordatorios');
  }

  return response.json();
}

// Obtener todas las plantillas
export async function obtenerPlantillasRecordatorios(): Promise<RecordatorioPlantilla[]> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/plantillas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las plantillas de recordatorios');
  }

  return response.json();
}

// Crear nueva plantilla
export async function crearPlantillaRecordatorio(
  plantilla: Omit<RecordatorioPlantilla, '_id' | 'createdAt' | 'updatedAt'>
): Promise<RecordatorioPlantilla> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/plantillas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plantilla),
  });

  if (!response.ok) {
    throw new Error('Error al crear la plantilla de recordatorio');
  }

  return response.json();
}

// Actualizar plantilla
export async function actualizarPlantillaRecordatorio(
  id: string,
  plantilla: Partial<RecordatorioPlantilla>
): Promise<RecordatorioPlantilla> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/plantillas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plantilla),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la plantilla de recordatorio');
  }

  return response.json();
}

// Eliminar plantilla
export async function eliminarPlantillaRecordatorio(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recordatorios/plantillas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la plantilla de recordatorio');
  }
}

// Enviar recordatorio manual para una cita
export async function enviarRecordatorioManual(
  citaId: string,
  plantillaId: string
): Promise<{ estado: string; mensaje: string }> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/enviar-recordatorio-manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ plantillaId }),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el recordatorio manual');
  }

  return response.json();
}



