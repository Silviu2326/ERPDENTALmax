// API para el Simulador de Costos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Tratamiento {
  _id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  precio_base: number;
  categoria?: string;
}

export interface AseguradoraPlan {
  _id: string;
  nombre_aseguradora: string;
  nombre_plan: string;
  coberturas: Array<{
    tratamientoId: string;
    porcentaje_cobertura: number;
    monto_maximo?: number;
  }>;
  deducible: number;
}

export interface OpcionFinanciera {
  _id: string;
  nombre: string;
  entidad: string;
  plazos_meses: number[];
  tasa_interes: number;
  comision_apertura: number;
}

export interface TratamientoSimulado {
  tratamientoId: string;
  cantidad: number;
}

export interface SimulacionRequest {
  tratamientos: TratamientoSimulado[];
  aseguradoraPlanId?: string;
  descuentoPorcentaje?: number;
  descuentoFijo?: number;
  sedeId?: string;
}

export interface CoberturaDetalle {
  tratamientoId: string;
  tratamientoNombre: string;
  precioBase: number;
  porcentajeCobertura: number;
  montoCubierto: number;
  montoPaciente: number;
}

export interface ResultadoSimulacion {
  subtotal: number;
  totalDescuentos: number;
  montoCubiertoAseguradora: number;
  totalPaciente: number;
  detalleCoberturas: CoberturaDetalle[];
}

// Obtener lista completa de tratamientos disponibles
export async function obtenerTratamientos(sedeId?: string): Promise<Tratamiento[]> {
  const params = new URLSearchParams();
  if (sedeId) {
    params.append('sedeId', sedeId);
  }

  const url = sedeId
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

// Obtener planes de aseguradoras
export async function obtenerPlanesAseguradoras(sedeId?: string): Promise<AseguradoraPlan[]> {
  const params = new URLSearchParams();
  if (sedeId) {
    params.append('sedeId', sedeId);
  }

  const url = sedeId
    ? `${API_BASE_URL}/aseguradoras/planes?${params.toString()}`
    : `${API_BASE_URL}/aseguradoras/planes`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los planes de aseguradoras');
  }

  return response.json();
}

// Obtener opciones de financiación
export async function obtenerOpcionesFinancieras(sedeId?: string): Promise<OpcionFinanciera[]> {
  const params = new URLSearchParams();
  if (sedeId) {
    params.append('sedeId', sedeId);
  }

  const url = sedeId
    ? `${API_BASE_URL}/opciones-financieras?${params.toString()}`
    : `${API_BASE_URL}/opciones-financieras`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las opciones financieras');
  }

  return response.json();
}

// Simular costos de tratamiento
export async function simularCostos(request: SimulacionRequest): Promise<ResultadoSimulacion> {
  const response = await fetch(`${API_BASE_URL}/presupuestos/simular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al simular los costos');
  }

  return response.json();
}



