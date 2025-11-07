// Tipos para ABM (Account-Based Marketing)

export type EstadoEmpresa = 'Identificada' | 'Contactada' | 'Negociando' | 'Cliente' | 'Descartada';
export type TipoCampana = 'Email' | 'Llamada' | 'Evento' | 'Publicidad Digital';
export type EstadoCampana = 'Planificada' | 'Activa' | 'Finalizada';
export type TipoInteraccion = 'Llamada' | 'Email' | 'Reunion' | 'Evento' | 'Otra';

export interface ContactoEmpresa {
  _id?: string;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
  esDecisionMaker: boolean;
  empresa?: string;
}

export interface Interaccion {
  _id?: string;
  tipo: TipoInteraccion;
  fecha: string;
  notas: string;
  contactoId?: string;
  contacto?: ContactoEmpresa;
  empresaId?: string;
  createdAt?: string;
}

export interface MetricasCampana {
  aperturas?: number;
  clics?: number;
  respuestas?: number;
  conversiones?: number;
}

export interface CampanaABM {
  _id?: string;
  nombre: string;
  tipo: TipoCampana;
  estado: EstadoCampana;
  empresaObjetivo: string;
  fechaInicio: string;
  fechaFin?: string;
  contenido?: string;
  metricas?: MetricasCampana;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmpresaObjetivo {
  _id?: string;
  nombre: string;
  sector: string;
  tamano: string;
  sitioWeb?: string;
  direccion?: string;
  estado: EstadoEmpresa;
  contactos: ContactoEmpresa[];
  campañasAsociadas: CampanaABM[];
  historialInteracciones: Interaccion[];
  clinicaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearEmpresaRequest {
  nombre: string;
  sector: string;
  tamano: string;
  sitioWeb?: string;
  direccion?: string;
}

export interface ActualizarEmpresaRequest {
  nombre?: string;
  sector?: string;
  tamano?: string;
  sitioWeb?: string;
  direccion?: string;
  estado?: EstadoEmpresa;
}

export interface CrearContactoRequest {
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
  esDecisionMaker: boolean;
}

export interface CrearCampanaRequest {
  nombre: string;
  tipo: TipoCampana;
  fechaInicio: string;
  fechaFin?: string;
  contenido?: string;
}

export interface CrearInteraccionRequest {
  tipo: TipoInteraccion;
  fecha: string;
  notas: string;
  contactoId?: string;
}

export interface PaginacionParams {
  page?: number;
  limit?: number;
  status?: EstadoEmpresa;
  query?: string;
}

export interface PaginacionResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_BASE_URL = '/api/abm';

/**
 * Obtiene una lista paginada de empresas objetivo
 */
export async function obtenerEmpresas(
  params?: PaginacionParams
): Promise<PaginacionResponse<EmpresaObjetivo>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.query) queryParams.append('query', params.query);

  const url = `${API_BASE_URL}/empresas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las empresas objetivo');
  }

  return response.json();
}

/**
 * Crea una nueva empresa objetivo
 */
export async function crearEmpresa(
  datos: CrearEmpresaRequest
): Promise<EmpresaObjetivo> {
  const response = await fetch(`${API_BASE_URL}/empresas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al crear la empresa objetivo');
  }

  return response.json();
}

/**
 * Obtiene los detalles completos de una empresa objetivo
 */
export async function obtenerEmpresaPorId(empresaId: string): Promise<EmpresaObjetivo> {
  const response = await fetch(`${API_BASE_URL}/empresas/${empresaId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la empresa objetivo');
  }

  return response.json();
}

/**
 * Actualiza una empresa objetivo
 */
export async function actualizarEmpresa(
  empresaId: string,
  datos: ActualizarEmpresaRequest
): Promise<EmpresaObjetivo> {
  const response = await fetch(`${API_BASE_URL}/empresas/${empresaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la empresa objetivo');
  }

  return response.json();
}

/**
 * Elimina una empresa objetivo
 */
export async function eliminarEmpresa(empresaId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/empresas/${empresaId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la empresa objetivo');
  }
}

/**
 * Añade un nuevo contacto a una empresa objetivo
 */
export async function añadirContactoAEmpresa(
  empresaId: string,
  datos: CrearContactoRequest
): Promise<ContactoEmpresa> {
  const response = await fetch(`${API_BASE_URL}/empresas/${empresaId}/contactos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al añadir el contacto');
  }

  return response.json();
}

/**
 * Crea y asocia una nueva campaña a una empresa objetivo
 */
export async function crearCampanaParaEmpresa(
  empresaId: string,
  datos: CrearCampanaRequest
): Promise<CampanaABM> {
  const response = await fetch(`${API_BASE_URL}/empresas/${empresaId}/campanas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al crear la campaña');
  }

  return response.json();
}

/**
 * Registra una nueva interacción con una empresa objetivo
 */
export async function registrarInteraccion(
  empresaId: string,
  datos: CrearInteraccionRequest
): Promise<Interaccion> {
  const response = await fetch(`${API_BASE_URL}/empresas/${empresaId}/interacciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al registrar la interacción');
  }

  return response.json();
}

/**
 * Obtiene las analíticas de ABM
 */
export async function obtenerAnaliticasABM(): Promise<{
  totalEmpresas: number;
  empresasPorEstado: Record<EstadoEmpresa, number>;
  totalContactos: number;
  totalCampanas: number;
  campanasPorEstado: Record<EstadoCampana, number>;
  interaccionesRecientes: Interaccion[];
}> {
  const response = await fetch(`${API_BASE_URL}/analiticas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las analíticas');
  }

  return response.json();
}



