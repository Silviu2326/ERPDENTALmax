// API para gestión de esterilización y trazabilidad
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PaqueteInstrumental {
  paqueteId: string;
  contenido: string;
  utilizado: boolean;
  paciente?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
}

export interface ParametrosCiclo {
  temperatura: number;
  presion: number;
  tiempo: number;
}

export interface IndicadorQuimico {
  tipo: string;
  resultado: 'correcto' | 'incorrecto';
}

export interface IndicadorBiologico {
  tipo: string;
  resultado: 'positivo' | 'negativo';
  fechaLectura: Date;
}

export interface LoteEsterilizacion {
  _id?: string;
  loteId: string;
  autoclave: {
    _id: string;
    nombre: string;
    modelo?: string;
  };
  operador: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  fechaInicio: Date;
  fechaFin?: Date;
  estado: 'en_proceso' | 'validado' | 'fallido';
  parametrosCiclo?: ParametrosCiclo;
  indicadorQuimico?: IndicadorQuimico;
  indicadorBiologico?: IndicadorBiologico;
  paquetes: PaqueteInstrumental[];
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NuevoLoteEsterilizacion {
  autoclaveId: string;
  operadorId: string;
  sedeId: string;
  paquetes: Array<{
    contenido: string;
  }>;
  notas?: string;
}

export interface ActualizarLoteEsterilizacion {
  fechaFin?: Date;
  parametrosCiclo?: ParametrosCiclo;
  resultadoIndicadorQuimico?: 'correcto' | 'incorrecto';
  tipoIndicadorQuimico?: string;
  resultadoIndicadorBiologico?: 'positivo' | 'negativo';
  tipoIndicadorBiologico?: string;
  fechaLecturaIndicadorBiologico?: Date;
  estado: 'en_proceso' | 'validado' | 'fallido';
  notas?: string;
}

export interface FiltrosLotes {
  fechaDesde?: string;
  fechaHasta?: string;
  autoclaveId?: string;
  estado?: 'en_proceso' | 'validado' | 'fallido';
  page?: number;
  limit?: number;
}

export interface RespuestaLotes {
  lotes: LoteEsterilizacion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Crear un nuevo lote de esterilización
export async function crearLoteEsterilizacion(lote: NuevoLoteEsterilizacion): Promise<LoteEsterilizacion> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/lotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(lote),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el lote de esterilización' }));
    throw new Error(error.message || 'Error al crear el lote de esterilización');
  }

  return response.json();
}

// Obtener lista de lotes con filtros
export async function obtenerLotesEsterilizacion(filtros: FiltrosLotes = {}): Promise<RespuestaLotes> {
  const params = new URLSearchParams();

  if (filtros.fechaDesde) {
    params.append('fechaDesde', filtros.fechaDesde);
  }
  if (filtros.fechaHasta) {
    params.append('fechaHasta', filtros.fechaHasta);
  }
  if (filtros.autoclaveId) {
    params.append('autoclaveId', filtros.autoclaveId);
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }
  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }

  const response = await fetch(`${API_BASE_URL}/esterilizacion/lotes?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los lotes de esterilización');
  }

  return response.json();
}

// Obtener detalle de un lote específico
export async function obtenerLotePorId(id: string): Promise<LoteEsterilizacion> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/lotes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el lote de esterilización');
  }

  return response.json();
}

// Actualizar un lote existente
export async function actualizarLoteEsterilizacion(
  id: string,
  datos: ActualizarLoteEsterilizacion
): Promise<LoteEsterilizacion> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/lotes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el lote de esterilización' }));
    throw new Error(error.message || 'Error al actualizar el lote de esterilización');
  }

  return response.json();
}

// Eliminar un lote (opcional, solo para administradores)
export async function eliminarLoteEsterilizacion(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/lotes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el lote de esterilización');
  }
}

// Obtener lista de autoclaves disponibles
export interface Autoclave {
  _id: string;
  nombre: string;
  modelo?: string;
  numeroSerie?: string;
  sede?: {
    _id: string;
    nombre: string;
  };
}

export async function obtenerAutoclaves(): Promise<Autoclave[]> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/autoclaves`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los autoclaves');
  }

  return response.json();
}


