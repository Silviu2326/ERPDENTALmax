// API para mensajería segura con la clínica
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces
export interface Participante {
  id: string;
  rol: 'paciente' | 'recepcion' | 'secretaria' | 'profesional';
  nombre?: string;
  email?: string;
}

export interface Adjunto {
  url: string;
  nombre: string;
  tipo: string;
  tamaño?: number;
}

export interface Lector {
  lectorId: string;
  fechaLectura: string;
}

export interface Mensaje {
  _id: string;
  conversacionId: string;
  emisor: Participante;
  cuerpo: string;
  fechaEnvio: string;
  leidoPor: Lector[];
  adjuntos?: Adjunto[];
}

export interface Conversacion {
  _id: string;
  participantes: Participante[];
  asunto: string;
  fechaCreacion: string;
  ultimoMensaje: string;
  estado: 'abierta' | 'cerrada';
  ultimoMensajePreview?: string;
  mensajesNoLeidos?: number;
}

export interface RespuestaConversaciones {
  conversaciones: Conversacion[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RespuestaMensajes {
  mensajes: Mensaje[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NuevoMensaje {
  cuerpo: string;
  adjuntos?: string[]; // URLs de los archivos adjuntos
}

export interface NuevaConversacion {
  destinatarioId: string;
  asunto: string;
  cuerpo: string;
}

// Obtener lista de conversaciones del usuario autenticado
export async function obtenerConversaciones(page: number = 1, limit: number = 20): Promise<RespuestaConversaciones> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(`${API_BASE_URL}/mensajeria/conversaciones?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las conversaciones' }));
    throw new Error(error.message || 'Error al obtener las conversaciones');
  }

  return response.json();
}

// Obtener mensajes de una conversación específica
export async function obtenerMensajesDeConversacion(
  conversacionId: string,
  page: number = 1,
  limit: number = 50
): Promise<RespuestaMensajes> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/mensajeria/conversaciones/${conversacionId}/mensajes?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los mensajes' }));
    throw new Error(error.message || 'Error al obtener los mensajes');
  }

  return response.json();
}

// Enviar un nuevo mensaje a una conversación existente
export async function enviarMensaje(
  conversacionId: string,
  mensaje: NuevoMensaje
): Promise<Mensaje> {
  const response = await fetch(`${API_BASE_URL}/mensajeria/conversaciones/${conversacionId}/mensajes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(mensaje),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al enviar el mensaje' }));
    throw new Error(error.message || 'Error al enviar el mensaje');
  }

  return response.json();
}

// Iniciar una nueva conversación
export async function iniciarNuevaConversacion(
  datos: NuevaConversacion
): Promise<Conversacion> {
  const response = await fetch(`${API_BASE_URL}/mensajeria/conversaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al iniciar la conversación' }));
    throw new Error(error.message || 'Error al iniciar la conversación');
  }

  return response.json();
}

// Marcar una conversación como leída
export async function marcarConversacionComoLeida(conversacionId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/mensajeria/conversaciones/${conversacionId}/marcar-leido`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al marcar como leída' }));
    throw new Error(error.message || 'Error al marcar como leída');
  }

  return response.json();
}


