// API para gestión de sesiones de teleconsulta y compartición de documentos en vivo
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
const WS_BASE_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:3000';

export interface DocumentoPaciente {
  id: string;
  nombreArchivo: string;
  urlMiniatura?: string;
  url: string;
  tipo: 'radiografia' | 'foto' | 'pdf' | 'cbct';
  fechaCarga?: string;
}

export interface EstadoSesion {
  exito: boolean;
  documentoActivo?: string;
  estadoComparticion?: string;
}

export interface EventoAnotacion {
  tipo: 'dibujo' | 'borrar' | 'limpiar';
  datos: {
    x: number;
    y: number;
    x2?: number;
    y2?: number;
    color?: string;
    grosor?: number;
    puntos?: Array<{ x: number; y: number }>;
  };
  timestamp: number;
  usuarioId: string;
}

export interface EventoViewport {
  zoom: number;
  panX: number;
  panY: number;
  timestamp: number;
  usuarioId: string;
}

export interface EventoCambioDocumento {
  documentoId: string;
  documento: DocumentoPaciente;
  timestamp: number;
  usuarioId: string;
}

export type WebSocketEvento = 
  | { tipo: 'evento-anotacion'; data: EventoAnotacion }
  | { tipo: 'evento-viewport'; data: EventoViewport }
  | { tipo: 'cambio-documento'; data: EventoCambioDocumento }
  | { tipo: 'usuario-conectado'; data: { usuarioId: string; nombre: string } }
  | { tipo: 'usuario-desconectado'; data: { usuarioId: string } }
  | { tipo: 'error'; data: { mensaje: string } };

/**
 * Obtiene la lista de documentos clínicos del paciente para una sesión
 */
export async function obtenerDocumentosPaciente(sesionId: string): Promise<DocumentoPaciente[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleodontologia/sesiones/${sesionId}/documentos-paciente`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener documentos: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener documentos del paciente:', error);
    throw error;
  }
}

/**
 * Selecciona un documento para compartir en la sesión
 */
export async function seleccionarDocumento(sesionId: string, documentoId: string): Promise<EstadoSesion> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleodontologia/sesiones/${sesionId}/seleccionar-documento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ documentoId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al seleccionar documento: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al seleccionar documento:', error);
    throw error;
  }
}

/**
 * Sube un nuevo documento durante la sesión
 */
export async function subirDocumento(sesionId: string, archivo: File): Promise<DocumentoPaciente> {
  try {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const response = await fetch(`${API_BASE_URL}/teleodontologia/sesiones/${sesionId}/subir-documento`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al subir documento: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al subir documento:', error);
    throw error;
  }
}

/**
 * Clase para gestionar la conexión WebSocket de la sesión
 */
export class SesionWebSocket {
  private ws: WebSocket | null = null;
  private sesionId: string;
  private token: string;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(sesionId: string) {
    this.sesionId = sesionId;
    this.token = localStorage.getItem('token') || '';
  }

  /**
   * Conecta al WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${WS_BASE_URL}/ws/teleconsulta/${this.sesionId}`;
        this.ws = new WebSocket(wsUrl);

        // Agregar token de autenticación en headers (si el servidor lo soporta)
        // Nota: WebSocket nativo no soporta headers directamente, 
        // se puede enviar el token como query parameter o en el primer mensaje
        this.ws.onopen = () => {
          console.log('WebSocket conectado');
          this.reconnectAttempts = 0;
          
          // Enviar token de autenticación como primer mensaje
          if (this.token) {
            this.ws?.send(JSON.stringify({ tipo: 'autenticacion', token: this.token }));
          }
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const mensaje: WebSocketEvento = JSON.parse(event.data);
            this.emitirEvento(mensaje.tipo, mensaje.data);
          } catch (error) {
            console.error('Error al parsear mensaje WebSocket:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('Error en WebSocket:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket desconectado');
          this.intentarReconectar();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Intenta reconectar si se perdió la conexión
   */
  private intentarReconectar() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Intentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect().catch((error) => {
          console.error('Error al reconectar:', error);
        });
      }, delay);
    } else {
      console.error('Máximo de intentos de reconexión alcanzado');
      this.emitirEvento('error', { mensaje: 'No se pudo reconectar a la sesión' });
    }
  }

  /**
   * Desconecta el WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  /**
   * Suscribe a un tipo de evento
   */
  on(evento: string, callback: (data: any) => void) {
    if (!this.listeners.has(evento)) {
      this.listeners.set(evento, new Set());
    }
    this.listeners.get(evento)?.add(callback);
  }

  /**
   * Desuscribe de un evento
   */
  off(evento: string, callback: (data: any) => void) {
    this.listeners.get(evento)?.delete(callback);
  }

  /**
   * Emite un evento a los listeners
   */
  private emitirEvento(evento: string, data: any) {
    const callbacks = this.listeners.get(evento);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en callback de evento ${evento}:`, error);
        }
      });
    }
  }

  /**
   * Envía un evento de anotación
   */
  enviarAnotacion(anotacion: EventoAnotacion) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        tipo: 'evento-anotacion',
        data: anotacion,
      }));
    }
  }

  /**
   * Envía un evento de viewport (zoom/pan)
   */
  enviarViewport(viewport: EventoViewport) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        tipo: 'evento-viewport',
        data: viewport,
      }));
    }
  }

  /**
   * Verifica si está conectado
   */
  get estaConectado(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}


