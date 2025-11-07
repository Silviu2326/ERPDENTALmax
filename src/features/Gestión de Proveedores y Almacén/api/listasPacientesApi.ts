// API para gestión de listas de pacientes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface FiltrosPacientes {
  demograficos?: {
    nombre?: string;
    apellidos?: string;
    dni?: string;
    email?: string;
    telefono?: string;
    genero?: string;
    edadMin?: number;
    edadMax?: number;
  };
  historialClinico?: {
    tratamientoId?: string;
    tratamientoRealizado?: boolean;
    fechaTratamientoDesde?: string;
    fechaTratamientoHasta?: string;
  };
  comprasProducto?: {
    productoId?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    cantidadMin?: number;
  };
  fechasVisita?: {
    primeraVisitaDesde?: string;
    primeraVisitaHasta?: string;
    ultimaVisitaDesde?: string;
    ultimaVisitaHasta?: string;
  };
  saldo?: {
    saldoMin?: number;
    saldoMax?: number;
    tieneSaldo?: boolean;
  };
  sedeId?: string;
}

export interface PaginacionFiltros {
  pagina: number;
  limite: number;
}

export interface OrdenFiltros {
  campo: string;
  direccion: 'asc' | 'desc';
}

export interface SolicitudFiltrarPacientes {
  filtros: FiltrosPacientes;
  paginacion: PaginacionFiltros;
  orden?: OrdenFiltros;
}

export interface PacienteLista {
  _id: string;
  nombre: string;
  apellidos: string;
  dni?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  ultimaVisita?: string;
  saldo?: number;
  sedeId?: string;
}

export interface RespuestaFiltrarPacientes {
  data: PacienteLista[];
  total: number;
  paginaActual: number;
  totalPaginas: number;
}

export interface ListaGuardada {
  _id: string;
  nombre: string;
  filtros: FiltrosPacientes;
  creadoPor: {
    _id: string;
    name: string;
  };
  fechaCreacion: string;
  idSede?: string;
}

// POST /api/pacientes/listas/filtrar
export async function filtrarPacientes(
  solicitud: SolicitudFiltrarPacientes
): Promise<RespuestaFiltrarPacientes> {
  const response = await fetch(`${API_BASE_URL}/pacientes/listas/filtrar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(solicitud),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al filtrar pacientes' }));
    throw new Error(error.message || 'Error al filtrar pacientes');
  }

  return response.json();
}

// GET /api/pacientes/listas/guardadas
export async function obtenerListasGuardadas(): Promise<ListaGuardada[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/listas/guardadas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener listas guardadas' }));
    throw new Error(error.message || 'Error al obtener listas guardadas');
  }

  return response.json();
}

// POST /api/pacientes/listas/guardadas
export async function crearListaGuardada(
  nombre: string,
  filtros: FiltrosPacientes
): Promise<ListaGuardada> {
  const response = await fetch(`${API_BASE_URL}/pacientes/listas/guardadas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nombre, filtros }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al guardar lista' }));
    throw new Error(error.message || 'Error al guardar lista');
  }

  return response.json();
}

// DELETE /api/pacientes/listas/guardadas/:id
export async function eliminarListaGuardada(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pacientes/listas/guardadas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar lista' }));
    throw new Error(error.message || 'Error al eliminar lista');
  }
}



