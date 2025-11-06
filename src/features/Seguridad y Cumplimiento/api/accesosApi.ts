// API para gestión de registros de acceso y auditoría
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AccesoLog {
  _id: string;
  usuarioId: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  nombreUsuario: string;
  rolUsuario: string;
  tipoAccion: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  recursoAfectado?: string;
  recursoId?: string;
  detalles?: Record<string, any>;
  sedeId?: {
    _id: string;
    nombre: string;
  };
}

export interface FiltrosRegistroAccesos {
  page?: number;
  limit?: number;
  usuarioId?: string;
  tipoAccion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  sedeId?: string;
}

export interface PaginacionLogs {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface RespuestaRegistrosAccesos {
  logs: AccesoLog[];
  pagination: PaginacionLogs;
}

/**
 * Obtiene una lista paginada y filtrada de todos los registros de acceso al sistema
 */
export async function obtenerRegistrosDeAcceso(
  filtros: FiltrosRegistroAccesos = {}
): Promise<RespuestaRegistrosAccesos> {
  try {
    const params = new URLSearchParams();
    
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
    if (filtros.tipoAccion) params.append('tipoAccion', filtros.tipoAccion);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
    if (filtros.sortOrder) params.append('sortOrder', filtros.sortOrder);
    if (filtros.sedeId) params.append('sedeId', filtros.sedeId);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/seguridad/accesos?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener los registros de acceso');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener registros de acceso:', error);
    throw error;
  }
}

/**
 * Obtiene los tipos de acción disponibles para filtrar
 */
export function obtenerTiposAccion(): Array<{ value: string; label: string }> {
  return [
    { value: 'LOGIN_SUCCESS', label: 'Inicio de sesión exitoso' },
    { value: 'LOGIN_FAILED', label: 'Intento de inicio de sesión fallido' },
    { value: 'LOGOUT', label: 'Cierre de sesión' },
    { value: 'VIEW_PATIENT', label: 'Visualización de paciente' },
    { value: 'CREATE_PATIENT', label: 'Creación de paciente' },
    { value: 'UPDATE_PATIENT', label: 'Modificación de paciente' },
    { value: 'DELETE_PATIENT', label: 'Eliminación de paciente' },
    { value: 'VIEW_CITA', label: 'Visualización de cita' },
    { value: 'CREATE_CITA', label: 'Creación de cita' },
    { value: 'UPDATE_CITA', label: 'Modificación de cita' },
    { value: 'DELETE_CITA', label: 'Eliminación de cita' },
    { value: 'VIEW_FACTURA', label: 'Visualización de factura' },
    { value: 'CREATE_FACTURA', label: 'Creación de factura' },
    { value: 'UPDATE_FACTURA', label: 'Modificación de factura' },
    { value: 'DELETE_FACTURA', label: 'Eliminación de factura' },
    { value: 'VIEW_PRESUPUESTO', label: 'Visualización de presupuesto' },
    { value: 'CREATE_PRESUPUESTO', label: 'Creación de presupuesto' },
    { value: 'UPDATE_PRESUPUESTO', label: 'Modificación de presupuesto' },
    { value: 'DELETE_PRESUPUESTO', label: 'Eliminación de presupuesto' },
    { value: 'VIEW_HISTORIA_CLINICA', label: 'Visualización de historia clínica' },
    { value: 'UPDATE_HISTORIA_CLINICA', label: 'Modificación de historia clínica' },
    { value: 'EXPORT_DATA', label: 'Exportación de datos' },
    { value: 'ACCESS_DENIED', label: 'Acceso denegado' },
  ];
}


