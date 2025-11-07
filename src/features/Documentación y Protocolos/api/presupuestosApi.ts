// API para firma de presupuestos dentro del módulo Documentación y Protocolos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PresupuestoParaFirma {
  _id: string;
  numeroPresupuesto: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
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
    direccion?: string;
  };
  tratamientos: Array<{
    tratamientoId: string;
    descripcion: string;
    precio: number;
    descuento?: number;
    cantidad?: number;
  }>;
  subtotal: number;
  descuentoTotal: number;
  total: number;
  fechaCreacion: string;
  fechaValidez?: string;
  notas?: string;
  estado: 'Borrador' | 'Presentado' | 'Aceptado' | 'Rechazado' | 'Expirado';
  terminosYCondiciones?: string;
}

export interface PresupuestoPendiente {
  _id: string;
  numeroPresupuesto: string;
  fechaCreacion: string;
  total: number;
  estado: 'Presentado';
}

export interface FirmaPresupuestoRequest {
  firmaData: string; // Base64 de la imagen de la firma
  metadatos: {
    ipAddress: string;
    userAgent: string;
    fechaFirma: string;
  };
}

export interface FirmaPresupuestoResponse {
  presupuesto: {
    _id: string;
    estado: 'Aceptado';
    documentoFirmadoURL: string;
    firma: {
      fecha: string;
      ipAddress: string;
      userAgent: string;
    };
  };
}

/**
 * Obtiene los datos de un presupuesto específico, formateado para ser presentado al paciente para su firma
 */
export async function obtenerDocumentoParaFirma(id: string): Promise<PresupuestoParaFirma> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/${id}/documento-para-firma`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el presupuesto' }));
    throw new Error(error.message || 'Error al obtener el presupuesto para firma');
  }

  return response.json();
}

/**
 * Recibe la firma digital, la asocia al presupuesto, genera el PDF final firmado, lo almacena y actualiza el estado del presupuesto a 'Aceptado'
 */
export async function firmarPresupuesto(
  id: string,
  datosFirma: FirmaPresupuestoRequest
): Promise<FirmaPresupuestoResponse> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/${id}/firmar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datosFirma),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al firmar el presupuesto' }));
    throw new Error(error.message || 'Error al firmar el presupuesto');
  }

  return response.json();
}

/**
 * Obtiene una lista de presupuestos pendientes de firma para un paciente específico
 */
export async function obtenerPresupuestosPendientesPorPaciente(
  pacienteId: string
): Promise<PresupuestoPendiente[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/presupuestos-pendientes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los presupuestos pendientes' }));
    throw new Error(error.message || 'Error al obtener los presupuestos pendientes');
  }

  return response.json();
}



