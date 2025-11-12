// Servicio WebSocket para eventos de citas en tiempo real
const WS_BASE_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:3000';

export interface EventoCitaActualizada {
  citaId: string;
  estado: 'programada' | 'confirmada' | 'cancelada' | 'realizada' | 'no-asistio';
  canalConfirmacion?: 'email' | 'sms' | 'whatsapp';
  timestamp: string;
  cita?: any; // Datos completos de la cita actualizada
}

export interface EventoNotificacionCita {
  tipo: 'asignada' | 'reprogramada' | 'cancelada';
  citaId: string;
  profesionalId?: string;
  mensaje: string;
  timestamp: string;
  cita?: any; // Datos completos de la cita
}

export type WebSocketEventoCita =
  | { tipo: 'cita-actualizada'; data: EventoCitaActualizada }
  | { tipo: 'notificacion-cita'; data: EventoNotificacionCita }
  | { tipo: 'error'; data: { mensaje: string } };

/**
 * Clase para gestionar la conexión WebSocket de eventos de citas
 */
export class CitasWebSocket {
  private ws: WebSocket | null = null;
  private token: string;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.token = localStorage.getItem('token') || '';
  }

  /**
   * Conecta al WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${WS_BASE_URL}/ws/citas`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket de citas conectado');
          this.reconnectAttempts = 0;
          
          // Enviar token de autenticación como primer mensaje
          if (this.token) {
            this.ws?.send(JSON.stringify({ tipo: 'autenticacion', token: this.token }));
          }
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const mensaje: WebSocketEventoCita = JSON.parse(event.data);
            this.emitirEvento(mensaje.tipo, mensaje.data);
          } catch (error) {
            console.error('Error al parsear mensaje WebSocket:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('Error en WebSocket de citas:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket de citas desconectado');
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
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Intentando reconectar WebSocket de citas (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect().catch((error) => {
          console.error('Error al reconectar:', error);
        });
      }, delay);
    } else {
      console.error('Máximo de intentos de reconexión alcanzado');
      this.emitirEvento('error', { mensaje: 'No se pudo reconectar al servicio de citas' });
    }
  }

  /**
   * Desconecta el WebSocket
   */
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
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
   * Verifica si está conectado
   */
  get estaConectado(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

