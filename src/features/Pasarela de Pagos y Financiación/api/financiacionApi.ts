// API para gestión de planes de financiación y financiaciones de pacientes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces para Planes de Financiación (Plantillas)
export interface PlanFinanciacion {
  _id?: string;
  nombre: string;
  descripcion?: string;
  tasaInteresAnual: number;
  numeroCuotasMin: number;
  numeroCuotasMax: number;
  montoMinimo: number;
  montoMaximo: number;
  requiereEntrada: boolean;
  porcentajeEntrada?: number;
  estado: 'activo' | 'inactivo';
  clinicaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevoPlanFinanciacion {
  nombre: string;
  descripcion?: string;
  tasaInteresAnual: number;
  numeroCuotasMin: number;
  numeroCuotasMax: number;
  montoMinimo: number;
  montoMaximo: number;
  requiereEntrada: boolean;
  porcentajeEntrada?: number;
  estado?: 'activo' | 'inactivo';
}

export interface PlanFinanciacionActualizado {
  nombre?: string;
  descripcion?: string;
  tasaInteresAnual?: number;
  numeroCuotasMin?: number;
  numeroCuotasMax?: number;
  montoMinimo?: number;
  montoMaximo?: number;
  requiereEntrada?: boolean;
  porcentajeEntrada?: number;
  estado?: 'activo' | 'inactivo';
}

// Interfaces para Financiaciones de Pacientes
export interface CuotaAmortizacion {
  numeroCuota: number;
  fechaVencimiento: string; // ISO Date
  capital: number;
  interes: number;
  totalCuota: number;
  capitalPendiente: number;
  estadoPago: 'pendiente' | 'pagada' | 'vencida' | 'mora';
  pagoId?: string;
  fechaPago?: string; // ISO Date
}

export interface FinanciacionPaciente {
  _id?: string;
  pacienteId: {
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  };
  planFinanciacionId: {
    _id: string;
    nombre: string;
    tasaInteresAnual: number;
  };
  presupuestoId: {
    _id: string;
    numero?: string;
    total?: number;
  };
  montoTotalFinanciado: number;
  montoEntrada: number;
  numeroCuotas: number;
  montoCuota: number;
  tasaInteresAplicada: number;
  fechaInicio: string; // ISO Date
  estado: 'activo' | 'pagado' | 'mora';
  tablaAmortizacion: CuotaAmortizacion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AsignarPlanRequest {
  plantillaId: string;
  pacienteId: string;
  presupuestoId: string;
  montoAFinanciar: number;
  numeroCuotas: number;
  montoEntrada?: number;
}

// Filtros para búsqueda de planes
export interface FiltrosPlanesFinanciacion {
  estado?: 'activo' | 'inactivo';
  clinicaId?: string;
}

// POST /api/financiacion/plantillas
export async function crearPlanFinanciacion(plan: NuevoPlanFinanciacion): Promise<PlanFinanciacion> {
  const response = await fetch(`${API_BASE_URL}/financiacion/plantillas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el plan de financiación' }));
    throw new Error(error.message || 'Error al crear el plan de financiación');
  }

  return response.json();
}

// GET /api/financiacion/plantillas
export async function obtenerPlanesFinanciacion(filtros: FiltrosPlanesFinanciacion = {}): Promise<PlanFinanciacion[]> {
  const params = new URLSearchParams();
  
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }
  if (filtros.clinicaId) {
    params.append('clinicaId', filtros.clinicaId);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/financiacion/plantillas${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los planes de financiación' }));
    throw new Error(error.message || 'Error al obtener los planes de financiación');
  }

  return response.json();
}

// GET /api/financiacion/plantillas/:id
export async function obtenerPlanFinanciacionPorId(id: string): Promise<PlanFinanciacion> {
  const response = await fetch(`${API_BASE_URL}/financiacion/plantillas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el plan de financiación' }));
    throw new Error(error.message || 'Error al obtener el plan de financiación');
  }

  return response.json();
}

// PUT /api/financiacion/plantillas/:id
export async function actualizarPlanFinanciacion(
  id: string,
  plan: PlanFinanciacionActualizado
): Promise<PlanFinanciacion> {
  const response = await fetch(`${API_BASE_URL}/financiacion/plantillas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el plan de financiación' }));
    throw new Error(error.message || 'Error al actualizar el plan de financiación');
  }

  return response.json();
}

// POST /api/financiacion/asignar
export async function asignarPlanAPaciente(request: AsignarPlanRequest): Promise<FinanciacionPaciente> {
  const response = await fetch(`${API_BASE_URL}/financiacion/asignar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al asignar el plan de financiación' }));
    throw new Error(error.message || 'Error al asignar el plan de financiación');
  }

  return response.json();
}

// GET /api/financiacion/paciente/:pacienteId
export async function obtenerFinanciacionesPorPaciente(pacienteId: string): Promise<FinanciacionPaciente[]> {
  const response = await fetch(`${API_BASE_URL}/financiacion/paciente/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las financiaciones del paciente' }));
    throw new Error(error.message || 'Error al obtener las financiaciones del paciente');
  }

  return response.json();
}

// GET /api/financiacion/:financiacionId
export async function obtenerDetalleFinanciacion(financiacionId: string): Promise<FinanciacionPaciente> {
  const response = await fetch(`${API_BASE_URL}/financiacion/${financiacionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el detalle de la financiación' }));
    throw new Error(error.message || 'Error al obtener el detalle de la financiación');
  }

  return response.json();
}



