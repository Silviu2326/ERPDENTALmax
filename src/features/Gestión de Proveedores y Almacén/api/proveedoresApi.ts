// API para gestión de proveedores
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Contacto {
  nombre: string;
  email?: string;
  telefono?: string;
}

export interface Direccion {
  calle?: string;
  ciudad?: string;
  codigoPostal?: string;
  pais?: string;
  estado?: string; // Mantener para compatibilidad
}

export interface InformacionBancaria {
  banco?: string;
  iban?: string;
}

export interface Proveedor {
  _id?: string;
  nombreComercial: string;
  razonSocial?: string;
  cifnif?: string; // Campo principal según documento
  rfc?: string; // Mantener para compatibilidad
  direccion?: Direccion;
  contactoPrincipal: Contacto;
  contactosAdicionales?: Contacto[];
  informacionBancaria?: InformacionBancaria;
  categorias?: string[];
  notas?: string;
  activo?: boolean; // Campo principal según documento
  estado?: 'activo' | 'inactivo'; // Mantener para compatibilidad
  clinicaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosBusquedaProveedores {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'activo' | 'inactivo';
  categoria?: string;
}

export interface RespuestaProveedores {
  proveedores: Proveedor[];
  total: number;
  totalPages: number;
  page: number;
}

export interface NuevoProveedor {
  nombreComercial: string;
  razonSocial?: string;
  cifnif?: string; // Campo principal según documento
  rfc?: string; // Mantener para compatibilidad
  direccion?: Direccion;
  contactoPrincipal: Contacto;
  contactosAdicionales?: Contacto[];
  informacionBancaria?: InformacionBancaria;
  categorias?: string[];
  notas?: string;
  activo?: boolean; // Campo principal según documento
  estado?: 'activo' | 'inactivo'; // Mantener para compatibilidad
}

// Obtener lista de proveedores con paginación y filtros
export async function obtenerProveedores(filtros: FiltrosBusquedaProveedores = {}): Promise<RespuestaProveedores> {
  const params = new URLSearchParams();
  
  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }
  if (filtros.search) {
    params.append('search', filtros.search);
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }
  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }

  const response = await fetch(`${API_BASE_URL}/proveedores?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los proveedores');
  }

  return response.json();
}

// Obtener detalle de un proveedor por ID
export async function obtenerProveedorPorId(id: string): Promise<Proveedor> {
  const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el proveedor');
  }

  return response.json();
}

// Crear un nuevo proveedor
export async function crearProveedor(proveedor: NuevoProveedor): Promise<Proveedor> {
  const response = await fetch(`${API_BASE_URL}/proveedores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(proveedor),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el proveedor' }));
    throw new Error(error.message || 'Error al crear el proveedor');
  }

  return response.json();
}

// Actualizar un proveedor existente
export async function actualizarProveedor(id: string, proveedor: Partial<NuevoProveedor>): Promise<Proveedor> {
  const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(proveedor),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el proveedor' }));
    throw new Error(error.message || 'Error al actualizar el proveedor');
  }

  return response.json();
}

// Desactivar un proveedor (soft delete)
export async function desactivarProveedor(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al desactivar el proveedor');
  }

  return response.json();
}

// Verificar si un CIF/NIF ya existe en la base de datos
export async function verificarCifExistente(cif: string): Promise<boolean> {
  if (!cif || cif.trim().length < 8) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/proveedores/verificar-cif?cif=${encodeURIComponent(cif)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // Si el endpoint no existe aún, retornar false para no bloquear
      return false;
    }

    const data = await response.json();
    return data.existe === true;
  } catch (error) {
    // En caso de error, no bloquear el formulario
    console.error('Error al verificar CIF:', error);
    return false;
  }
}

