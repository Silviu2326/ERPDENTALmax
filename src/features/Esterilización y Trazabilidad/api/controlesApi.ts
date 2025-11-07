// API para gestión de controles biológicos y químicos de esterilización
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type TipoControl = 'biologico' | 'quimico';
export type ResultadoControl = 'pendiente' | 'positivo' | 'negativo' | 'fallido';

export interface ControlEsterilizacion {
  _id?: string;
  tipoControl: TipoControl;
  fechaRegistro: Date | string;
  resultado: ResultadoControl;
  loteIndicador: string;
  fechaVencimientoIndicador: Date | string;
  fechaResultado?: Date | string;
  idCicloEsterilizacion?: {
    _id: string;
    loteId?: string;
  };
  idEsterilizador: {
    _id: string;
    nombre: string;
    modelo?: string;
  };
  idUsuarioRegistro: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  idUsuarioResultado?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  observaciones?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface NuevoControlEsterilizacion {
  tipoControl: TipoControl;
  fechaRegistro: Date | string;
  resultado: ResultadoControl;
  loteIndicador: string;
  fechaVencimientoIndicador: Date | string;
  idEsterilizador: string;
  idCicloEsterilizacion?: string;
  observaciones?: string;
}

export interface ActualizarControlEsterilizacion {
  resultado?: ResultadoControl;
  fechaResultado?: Date | string;
  observaciones?: string;
}

export interface FiltrosControles {
  fechaInicio?: string;
  fechaFin?: string;
  tipoControl?: TipoControl;
  resultado?: ResultadoControl;
  idEsterilizador?: string;
  page?: number;
  limit?: number;
}

export interface RespuestaControles {
  controles: ControlEsterilizacion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Registra un nuevo control biológico o químico
 */
export async function registrarControl(
  control: NuevoControlEsterilizacion
): Promise<ControlEsterilizacion> {
  const response = await fetch(`${API_BASE_URL}/controles-esterilizacion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(control),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al registrar el control' }));
    throw new Error(error.message || 'Error al registrar el control');
  }

  return response.json();
}

/**
 * Obtiene la lista de controles con opciones de filtrado
 */
export async function obtenerControles(
  filtros?: FiltrosControles
): Promise<RespuestaControles> {
  const params = new URLSearchParams();

  if (filtros?.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros?.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros?.tipoControl) {
    params.append('tipoControl', filtros.tipoControl);
  }
  if (filtros?.resultado) {
    params.append('resultado', filtros.resultado);
  }
  if (filtros?.idEsterilizador) {
    params.append('idEsterilizador', filtros.idEsterilizador);
  }
  if (filtros?.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros?.limit) {
    params.append('limit', filtros.limit.toString());
  }

  const response = await fetch(
    `${API_BASE_URL}/controles-esterilizacion?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener los controles');
  }

  return response.json();
}

/**
 * Obtiene los detalles de un control específico por su ID
 */
export async function obtenerControlPorId(id: string): Promise<ControlEsterilizacion> {
  const response = await fetch(`${API_BASE_URL}/controles-esterilizacion/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el control');
  }

  return response.json();
}

/**
 * Actualiza un registro de control existente
 */
export async function actualizarControl(
  id: string,
  datos: ActualizarControlEsterilizacion
): Promise<ControlEsterilizacion> {
  const response = await fetch(`${API_BASE_URL}/controles-esterilizacion/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el control' }));
    throw new Error(error.message || 'Error al actualizar el control');
  }

  return response.json();
}



