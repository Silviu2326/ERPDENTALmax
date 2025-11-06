// API para gestión de cartas enviadas a pacientes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface CartaEnviada {
  _id?: string;
  pacienteId: string;
  plantillaId: string;
  fechaEnvio: string;
  metodo: 'email' | 'impreso';
  asunto: string;
  cuerpoEnviado: string;
  estado: 'enviado' | 'fallido';
}

export interface PrevisualizacionCarta {
  asunto: string;
  cuerpoHTML: string;
}

export interface DatosPrevisualizacion {
  plantillaId: string;
  pacienteId: string;
}

export interface DatosEnvioCarta {
  plantillaId: string;
  pacienteId: string;
  metodo: 'email' | 'impreso';
}

// Generar una previsualización de carta para un paciente específico
export async function generarPrevisualizacion(
  datos: DatosPrevisualizacion
): Promise<PrevisualizacionCarta> {
  try {
    const response = await fetch(`${API_BASE_URL}/cartas/previsualizar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error('Error al generar previsualización');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al generar previsualización:', error);
    throw error;
  }
}

// Enviar una carta a un paciente y registrar el envío
export async function enviarCarta(datos: DatosEnvioCarta): Promise<CartaEnviada> {
  try {
    const response = await fetch(`${API_BASE_URL}/cartas/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error('Error al enviar carta');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al enviar carta:', error);
    throw error;
  }
}

// Obtener el historial de cartas enviadas a un paciente
export async function obtenerCartasPorPaciente(pacienteId: string): Promise<CartaEnviada[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/cartas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener cartas del paciente');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener cartas del paciente:', error);
    throw error;
  }
}


