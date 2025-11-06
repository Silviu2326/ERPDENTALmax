// API para gestión de comisiones por profesional
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces para Comisiones
export interface ConfiguracionComision {
  tipo: 'porcentaje_cobrado' | 'porcentaje_tratamiento' | 'fijo_por_tratamiento';
  valor: number;
  aplicaSobre?: Array<{
    tratamientoId: string;
    valorEspecifico: number;
  }>;
}

export interface ProfesionalComision {
  _id: string;
  nombre: string;
  apellidos: string;
  especialidad?: string;
  sede?: {
    _id: string;
    nombre: string;
  };
  configuracionComision?: ConfiguracionComision;
}

export interface TratamientoComisionable {
  _id: string;
  tratamientoRealizadoId: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  tratamiento: {
    _id: string;
    nombre: string;
  };
  fechaRealizacion: string; // ISO Date
  precio: number;
  descuento: number;
  montoCobrado: number;
  comisionCalculada: number;
  tipoComision: string;
  estadoLiquidacion: 'pendiente' | 'liquidado';
}

export interface ReporteComisionProfesional {
  profesional: ProfesionalComision;
  totalComisiones: number;
  totalComisionesPendientes: number;
  totalComisionesLiquidadas: number;
  cantidadTratamientos: number;
  detalleTratamientos?: TratamientoComisionable[];
}

export interface FiltrosReporteComisiones {
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  profesionalId?: string;
  sedeId?: string;
  estadoLiquidacion?: 'pendiente' | 'liquidado';
}

export interface DetalleComisionProfesional {
  profesional: ProfesionalComision;
  periodo: {
    fechaInicio: string;
    fechaFin: string;
  };
  tratamientos: TratamientoComisionable[];
  totalComisiones: number;
  resumen: {
    totalTratamientos: number;
    totalMontoCobrado: number;
    totalComisiones: number;
    promedioComisionPorTratamiento: number;
  };
}

export interface DatosLiquidacion {
  profesionalId: string;
  fechaInicio: string;
  fechaFin: string;
  montoLiquidado: number;
  idsComisionables: string[];
  notas?: string;
}

export interface ComisionLiquidada {
  _id: string;
  profesionalId: string;
  profesional: ProfesionalComision;
  periodoInicio: string;
  periodoFin: string;
  montoTotal: number;
  fechaLiquidacion: string;
  detallePagosIds: string[];
  notas?: string;
  creadoPor: {
    _id: string;
    nombre: string;
  };
}

// Obtener reporte de comisiones
export async function obtenerReporteComisiones(
  filtros: FiltrosReporteComisiones
): Promise<ReporteComisionProfesional[]> {
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
  if (filtros.estadoLiquidacion) {
    params.append('estadoLiquidacion', filtros.estadoLiquidacion);
  }

  const response = await fetch(`${API_BASE_URL}/comisiones/reporte?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el reporte de comisiones');
  }

  return response.json();
}

// Obtener detalle de comisión de un profesional
export async function obtenerDetalleComision(
  profesionalId: string,
  fechaInicio: string,
  fechaFin: string
): Promise<DetalleComisionProfesional> {
  const params = new URLSearchParams({
    fechaInicio,
    fechaFin,
  });

  const response = await fetch(
    `${API_BASE_URL}/comisiones/reporte/${profesionalId}/detalle?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el detalle de la comisión');
  }

  return response.json();
}

// Liquidar comisiones
export async function liquidarComisiones(
  datos: DatosLiquidacion
): Promise<ComisionLiquidada> {
  const response = await fetch(`${API_BASE_URL}/comisiones/liquidar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al liquidar las comisiones');
  }

  return response.json();
}

// Obtener lista de profesionales (para filtros)
export async function obtenerProfesionalesComision(): Promise<ProfesionalComision[]> {
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

// Obtener sedes (para filtros)
export async function obtenerSedes(): Promise<Array<{ _id: string; nombre: string }>> {
  const response = await fetch(`${API_BASE_URL}/sedes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las sedes');
  }

  return response.json();
}


