// API para gestión de servicios del catálogo web
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface CategoriaServicioWeb {
  _id?: string;
  nombre: string;
  slug?: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicioWeb {
  _id?: string;
  nombre: string;
  slug?: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  precio: number;
  precioPromocional?: number;
  categoria?: string | CategoriaServicioWeb;
  imagenes?: string[];
  videoURL?: string;
  publicado: boolean;
  destacado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevoServicioWeb {
  nombre: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  precio: number;
  precioPromocional?: number;
  categoria?: string;
  imagenes?: string[];
  videoURL?: string;
  publicado?: boolean;
  destacado?: boolean;
}

export interface FiltrosServiciosWeb {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  publicado?: boolean;
  destacado?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Obtener listado paginado de servicios web
export async function obtenerServiciosWeb(
  filtros: FiltrosServiciosWeb = {}
): Promise<PaginatedResponse<ServicioWeb>> {
  const params = new URLSearchParams();

  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.search) params.append('search', filtros.search);
  if (filtros.categoria) params.append('categoria', filtros.categoria);
  if (filtros.publicado !== undefined) params.append('publicado', filtros.publicado.toString());
  if (filtros.destacado !== undefined) params.append('destacado', filtros.destacado.toString());

  const response = await fetch(`${API_BASE_URL}/marketing/servicios-web?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el listado de servicios web');
  }

  return response.json();
}

// Obtener un servicio web por ID
export async function obtenerServicioWebPorId(id: string): Promise<ServicioWeb> {
  const response = await fetch(`${API_BASE_URL}/marketing/servicios-web/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el servicio web');
  }

  return response.json();
}

// Crear un nuevo servicio web
export async function crearServicioWeb(servicio: NuevoServicioWeb): Promise<ServicioWeb> {
  const response = await fetch(`${API_BASE_URL}/marketing/servicios-web`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(servicio),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el servicio web' }));
    throw new Error(error.message || 'Error al crear el servicio web');
  }

  return response.json();
}

// Actualizar un servicio web
export async function actualizarServicioWeb(
  id: string,
  servicio: Partial<NuevoServicioWeb>
): Promise<ServicioWeb> {
  const response = await fetch(`${API_BASE_URL}/marketing/servicios-web/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(servicio),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el servicio web' }));
    throw new Error(error.message || 'Error al actualizar el servicio web');
  }

  return response.json();
}

// Eliminar un servicio web
export async function eliminarServicioWeb(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/marketing/servicios-web/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el servicio web');
  }
}

// Obtener todas las categorías de servicios web
export async function obtenerCategoriasServiciosWeb(): Promise<CategoriaServicioWeb[]> {
  const response = await fetch(`${API_BASE_URL}/marketing/categorias-servicios-web`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las categorías de servicios web');
  }

  return response.json();
}

// Crear una nueva categoría
export async function crearCategoriaServicioWeb(
  categoria: { nombre: string; descripcion?: string }
): Promise<CategoriaServicioWeb> {
  const response = await fetch(`${API_BASE_URL}/marketing/categorias-servicios-web`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la categoría' }));
    throw new Error(error.message || 'Error al crear la categoría');
  }

  return response.json();
}

// Actualizar una categoría
export async function actualizarCategoriaServicioWeb(
  id: string,
  categoria: { nombre?: string; descripcion?: string }
): Promise<CategoriaServicioWeb> {
  const response = await fetch(`${API_BASE_URL}/marketing/categorias-servicios-web/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la categoría' }));
    throw new Error(error.message || 'Error al actualizar la categoría');
  }

  return response.json();
}

// Eliminar una categoría
export async function eliminarCategoriaServicioWeb(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/marketing/categorias-servicios-web/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar la categoría' }));
    throw new Error(error.message || 'Error al eliminar la categoría');
  }
}


