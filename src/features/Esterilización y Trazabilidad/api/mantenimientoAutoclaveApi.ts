// API para gestión de mantenimiento de autoclaves
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Autoclave {
  _id?: string;
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaInstalacion: Date;
  ubicacion: string;
  proximoMantenimiento: Date;
  estado: 'activo' | 'inactivo' | 'en_reparacion';
  clinicaId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MantenimientoAutoclave {
  _id?: string;
  autoclaveId: string;
  fecha: Date;
  tipoMantenimiento: 'preventivo' | 'correctivo';
  descripcion: string;
  tecnicoResponsable: string;
  costo: number;
  documentosAdjuntos?: Array<{
    nombre: string;
    url: string;
  }>;
  realizadoPorUsuarioId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NuevoAutoclave {
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaInstalacion: string;
  ubicacion: string;
  proximoMantenimiento: string;
  estado?: 'activo' | 'inactivo' | 'en_reparacion';
}

export interface ActualizarAutoclave {
  nombre?: string;
  marca?: string;
  modelo?: string;
  ubicacion?: string;
  proximoMantenimiento?: string;
  estado?: 'activo' | 'inactivo' | 'en_reparacion';
}

export interface NuevoMantenimiento {
  fecha: string;
  tipoMantenimiento: 'preventivo' | 'correctivo';
  descripcion: string;
  tecnicoResponsable: string;
  costo: number;
  documentosAdjuntos?: File[];
}

export interface FiltrosAutoclaves {
  estado?: 'activo' | 'inactivo' | 'en_reparacion';
}

// Obtener todos los autoclaves
export async function obtenerAutoclaves(filtros?: FiltrosAutoclaves): Promise<Autoclave[]> {
  const params = new URLSearchParams();
  
  if (filtros?.estado) {
    params.append('estado', filtros.estado);
  }

  const url = params.toString() 
    ? `${API_BASE_URL}/esterilizacion/autoclaves?${params.toString()}`
    : `${API_BASE_URL}/esterilizacion/autoclaves`;

  const response = await fetch(url, {
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

// Crear un nuevo autoclave
export async function crearAutoclave(autoclave: NuevoAutoclave): Promise<Autoclave> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/autoclaves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(autoclave),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el autoclave' }));
    throw new Error(error.message || 'Error al crear el autoclave');
  }

  return response.json();
}

// Actualizar un autoclave
export async function actualizarAutoclave(
  id: string,
  datos: ActualizarAutoclave
): Promise<Autoclave> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/autoclaves/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el autoclave' }));
    throw new Error(error.message || 'Error al actualizar el autoclave');
  }

  return response.json();
}

// Obtener historial de mantenimientos de un autoclave
export async function obtenerMantenimientosAutoclave(
  autoclaveId: string
): Promise<MantenimientoAutoclave[]> {
  const response = await fetch(
    `${API_BASE_URL}/esterilizacion/autoclaves/${autoclaveId}/mantenimientos`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener el historial de mantenimientos');
  }

  return response.json();
}

// Registrar un nuevo mantenimiento
export async function registrarMantenimiento(
  autoclaveId: string,
  mantenimiento: NuevoMantenimiento
): Promise<MantenimientoAutoclave> {
  const formData = new FormData();
  
  formData.append('fecha', mantenimiento.fecha);
  formData.append('tipoMantenimiento', mantenimiento.tipoMantenimiento);
  formData.append('descripcion', mantenimiento.descripcion);
  formData.append('tecnicoResponsable', mantenimiento.tecnicoResponsable);
  formData.append('costo', mantenimiento.costo.toString());

  if (mantenimiento.documentosAdjuntos && mantenimiento.documentosAdjuntos.length > 0) {
    mantenimiento.documentosAdjuntos.forEach((archivo, index) => {
      formData.append(`documento${index}`, archivo);
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/esterilizacion/autoclaves/${autoclaveId}/mantenimientos`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al registrar el mantenimiento' }));
    throw new Error(error.message || 'Error al registrar el mantenimiento');
  }

  return response.json();
}

// Obtener un autoclave por ID
export async function obtenerAutoclavePorId(id: string): Promise<Autoclave> {
  const response = await fetch(`${API_BASE_URL}/esterilizacion/autoclaves/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el autoclave');
  }

  return response.json();
}



