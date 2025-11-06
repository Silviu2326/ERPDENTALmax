// API para gestión de empleados
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces para documentos de empleado
export interface DocumentoEmpleado {
  _id: string;
  nombre: string;
  url: string;
  tipo: 'Contrato' | 'DNI' | 'Titulacion' | 'Otro';
  fechaSubida: string;
  tamaño?: number;
  tipoMime?: string;
}

export interface DatosSubirDocumentoEmpleado {
  file: File;
  tipo: 'Contrato' | 'DNI' | 'Titulacion' | 'Otro';
}

export interface Direccion {
  calle?: string;
  numero?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
}

export interface DatosProfesionales {
  rol: 'Odontologo' | 'Asistente' | 'Recepcionista' | 'RR.HH.' | 'Gerente' | 'Higienista';
  especialidad?: string;
  numeroColegiado?: string;
}

export interface DatosContractuales {
  tipoContrato?: 'Indefinido' | 'Temporal' | 'Practicas' | 'Otro';
  salario?: number;
  fechaInicio: string;
  fechaFin?: string;
}

export interface Empleado {
  _id?: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento?: string;
  direccion?: Direccion;
  contacto?: {
    email: string;
    telefono?: string;
  };
  datosProfesionales?: DatosProfesionales;
  datosContractuales?: DatosContractuales;
  clinicasAsignadas?: Array<{
    _id: string;
    nombre: string;
  }>;
  documentos?: DocumentoEmpleado[];
  activo?: boolean;
  userId?: string;
  // Campos legacy para compatibilidad
  email?: string;
  telefono?: string;
  fechaContratacion?: string;
  rol?: 'Odontologo' | 'Asistente' | 'Recepcionista' | 'RR.HH.' | 'Gerente';
  sede?: {
    _id: string;
    nombre: string;
  };
  usuario?: {
    _id: string;
    email: string;
  };
  estado?: 'Activo' | 'Inactivo';
  especialidad?: string;
  numeroColegiado?: string;
}

export interface FiltrosEmpleados {
  page?: number;
  limit?: number;
  search?: string;
  rol?: string;
  sedeId?: string;
  estado?: 'Activo' | 'Inactivo';
}

export interface EmpleadosResponse {
  empleados: Empleado[];
  totalPaginas: number;
  paginaActual: number;
  totalResultados: number;
}

export interface NuevoEmpleado {
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono?: string;
  fechaContratacion: string;
  rol: 'Odontologo' | 'Asistente' | 'Recepcionista' | 'RR.HH.' | 'Gerente';
  sede?: string;
  estado?: 'Activo' | 'Inactivo';
  especialidad?: string;
  numeroColegiado?: string;
}

// Obtener lista paginada y filtrada de empleados
export async function obtenerEmpleados(filtros: FiltrosEmpleados = {}): Promise<EmpleadosResponse> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.search) params.append('search', filtros.search);
  if (filtros.rol) params.append('rol', filtros.rol);
  if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
  if (filtros.estado) params.append('estado', filtros.estado);

  const response = await fetch(`${API_BASE_URL}/empleados?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los empleados');
  }

  return response.json();
}

// Obtener detalle de un empleado por ID
export async function obtenerEmpleadoPorId(id: string): Promise<Empleado> {
  const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el empleado');
  }

  return response.json();
}

// Crear un nuevo empleado
export async function crearEmpleado(empleado: NuevoEmpleado): Promise<Empleado> {
  const response = await fetch(`${API_BASE_URL}/empleados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(empleado),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el empleado' }));
    throw new Error(error.message || 'Error al crear el empleado');
  }

  return response.json();
}

// Actualizar un empleado existente
export async function actualizarEmpleado(id: string, empleado: Partial<NuevoEmpleado>): Promise<Empleado> {
  const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(empleado),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el empleado' }));
    throw new Error(error.message || 'Error al actualizar el empleado');
  }

  return response.json();
}

// Desactivar un empleado (soft delete)
export async function desactivarEmpleado(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al desactivar el empleado');
  }

  return response.json();
}

// Obtener documentos de un empleado
export async function obtenerDocumentosEmpleado(empleadoId: string): Promise<DocumentoEmpleado[]> {
  const response = await fetch(`${API_BASE_URL}/empleados/${empleadoId}/documentos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los documentos del empleado');
  }

  return response.json();
}

// Subir un documento para un empleado
export async function subirDocumentoEmpleado(
  empleadoId: string,
  datos: DatosSubirDocumentoEmpleado
): Promise<DocumentoEmpleado> {
  const formData = new FormData();
  formData.append('file', datos.file);
  formData.append('tipo', datos.tipo);

  const response = await fetch(`${API_BASE_URL}/empleados/${empleadoId}/documentos`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al subir el documento' }));
    throw new Error(error.message || 'Error al subir el documento');
  }

  return response.json();
}

// Eliminar un documento de empleado
export async function eliminarDocumentoEmpleado(
  empleadoId: string,
  documentoId: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/empleados/${empleadoId}/documentos/${documentoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el documento');
  }
}

// Interface para roles
export interface Rol {
  _id: string;
  nombre: string;
  descripcion?: string;
}

// Obtener lista de roles disponibles
export async function obtenerRoles(): Promise<Rol[]> {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los roles');
  }

  return response.json();
}

