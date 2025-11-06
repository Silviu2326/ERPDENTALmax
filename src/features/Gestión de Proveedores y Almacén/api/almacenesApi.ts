// API para gestión de almacenes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Direccion {
  calle: string;
  ciudad: string;
  codigoPostal: string;
}

export interface Almacen {
  _id?: string;
  nombre: string;
  direccion: Direccion;
  esPrincipal: boolean;
  clinicaAsociada?: {
    _id: string;
    nombre: string;
  };
  responsable?: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlmacenDetalle extends Almacen {
  inventario?: Array<{
    producto: {
      _id: string;
      nombre: string;
      sku?: string;
      categoria?: string;
    };
    cantidad: number;
  }>;
}

export interface NuevoAlmacen {
  nombre: string;
  direccion: Direccion;
  esPrincipal: boolean;
  responsableId?: string;
  clinicaAsociadaId?: string;
}

export interface ActualizarAlmacen {
  nombre?: string;
  direccion?: Direccion;
  esPrincipal?: boolean;
  responsableId?: string;
  clinicaAsociadaId?: string;
  activo?: boolean;
}

export interface TransferenciaStock {
  almacenOrigenId: string;
  almacenDestinoId: string;
  productos: Array<{
    productoId: string;
    cantidad: number;
  }>;
}

export interface Transferencia {
  _id?: string;
  almacenOrigen: Almacen;
  almacenDestino: Almacen;
  productos: Array<{
    producto: {
      _id: string;
      nombre: string;
    };
    cantidad: number;
  }>;
  estado: 'pendiente' | 'en_transito' | 'completada' | 'cancelada';
  fechaEnvio?: string;
  fechaRecepcion?: string;
  usuarioResponsable?: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
}

export interface FiltrosAlmacenes {
  clinicaId?: string;
  activo?: boolean;
}

/**
 * Obtiene una lista de todos los almacenes registrados
 */
export async function obtenerAlmacenes(filtros?: FiltrosAlmacenes): Promise<Almacen[]> {
  try {
    const params = new URLSearchParams();
    if (filtros?.clinicaId) {
      params.append('clinicaId', filtros.clinicaId);
    }
    if (filtros?.activo !== undefined) {
      params.append('activo', filtros.activo.toString());
    }

    const url = `${API_BASE_URL}/almacenes${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener almacenes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener almacenes:', error);
    throw error;
  }
}

/**
 * Crea un nuevo almacén
 */
export async function crearAlmacen(almacen: NuevoAlmacen): Promise<Almacen> {
  try {
    const response = await fetch(`${API_BASE_URL}/almacenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(almacen),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear almacén');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear almacén:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles completos de un almacén específico
 */
export async function obtenerDetalleAlmacen(id: string): Promise<AlmacenDetalle> {
  try {
    const response = await fetch(`${API_BASE_URL}/almacenes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener detalle del almacén');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener detalle del almacén:', error);
    throw error;
  }
}

/**
 * Actualiza la información de un almacén existente
 */
export async function actualizarAlmacen(id: string, datos: ActualizarAlmacen): Promise<Almacen> {
  try {
    const response = await fetch(`${API_BASE_URL}/almacenes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar almacén');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar almacén:', error);
    throw error;
  }
}

/**
 * Elimina un almacén (solo si no tiene stock)
 */
export async function eliminarAlmacen(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/almacenes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar almacén');
    }
  } catch (error) {
    console.error('Error al eliminar almacén:', error);
    throw error;
  }
}

/**
 * Realiza una transferencia de stock entre dos almacenes
 */
export async function realizarTransferenciaStock(transferencia: TransferenciaStock): Promise<Transferencia> {
  try {
    const response = await fetch(`${API_BASE_URL}/almacenes/transferencias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(transferencia),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al realizar transferencia de stock');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al realizar transferencia de stock:', error);
    throw error;
  }
}


