// API para gestión de facturas de laboratorio
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ItemFacturaLaboratorio {
  descripcion: string;
  trabajo: {
    _id: string;
    paciente?: {
      _id: string;
      nombre: string;
      apellidos: string;
    };
    tratamiento?: {
      _id: string;
      nombre: string;
    };
    fechaCreacion?: string;
    estado?: string;
  };
  precioUnitario: number;
  cantidad: number;
}

export interface FacturaLaboratorio {
  _id?: string;
  numeroFactura: string;
  laboratorio: {
    _id: string;
    nombre: string;
    cif?: string;
    direccion?: string;
    contacto?: {
      nombre: string;
      email: string;
      telefono: string;
    };
  };
  clinica: {
    _id: string;
    nombre: string;
  };
  fechaEmision: string;
  fechaVencimiento: string;
  items: ItemFacturaLaboratorio[];
  subtotal: number;
  impuestos: number;
  total: number;
  estado: 'Pendiente' | 'Pagada' | 'Vencida' | 'Cancelada';
  fechaPago?: string;
  metodoPago?: string;
  notas?: string;
  archivoUrl?: string;
}

export interface TrabajoLaboratorio {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  tratamiento: {
    _id: string;
    nombre: string;
  };
  laboratorio: {
    _id: string;
    nombre: string;
  };
  coste: number;
  fechaCreacion: string;
  estado: string;
}

export interface FiltrosFacturasLaboratorio {
  page?: number;
  limit?: number;
  laboratorioId?: string;
  estado?: 'Pendiente' | 'Pagada' | 'Vencida' | 'Cancelada';
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface RespuestaFacturasLaboratorio {
  facturas: FacturaLaboratorio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NuevaFacturaLaboratorio {
  numeroFactura: string;
  laboratorioId: string;
  fechaEmision: string;
  fechaVencimiento: string;
  items: Array<{
    descripcion: string;
    trabajoId: string;
    precioUnitario: number;
    cantidad: number;
  }>;
  subtotal: number;
  impuestos: number;
  total: number;
  notas?: string;
  archivoUrl?: string;
}

// Obtener listado paginado de facturas de laboratorio
export async function obtenerFacturasLaboratorio(
  filtros: FiltrosFacturasLaboratorio = {}
): Promise<RespuestaFacturasLaboratorio> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.laboratorioId) params.append('laboratorioId', filtros.laboratorioId);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

  const response = await fetch(`${API_BASE_URL}/lab-invoices?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las facturas de laboratorio');
  }

  return response.json();
}

// Obtener detalle de una factura de laboratorio
export async function obtenerFacturaLaboratorioPorId(id: string): Promise<FacturaLaboratorio> {
  const response = await fetch(`${API_BASE_URL}/lab-invoices/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la factura de laboratorio');
  }

  return response.json();
}

// Crear una nueva factura de laboratorio
export async function crearFacturaLaboratorio(
  factura: NuevaFacturaLaboratorio
): Promise<FacturaLaboratorio> {
  const response = await fetch(`${API_BASE_URL}/lab-invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(factura),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la factura' }));
    throw new Error(error.message || 'Error al crear la factura de laboratorio');
  }

  return response.json();
}

// Actualizar una factura de laboratorio
export async function actualizarFacturaLaboratorio(
  id: string,
  datos: Partial<FacturaLaboratorio>
): Promise<FacturaLaboratorio> {
  const response = await fetch(`${API_BASE_URL}/lab-invoices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la factura' }));
    throw new Error(error.message || 'Error al actualizar la factura de laboratorio');
  }

  return response.json();
}

// Eliminar una factura de laboratorio (soft delete)
export async function eliminarFacturaLaboratorio(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/lab-invoices/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la factura de laboratorio');
  }
}

// Obtener trabajos de laboratorio no facturados
export async function obtenerTrabajosNoFacturados(
  laboratorioId?: string
): Promise<TrabajoLaboratorio[]> {
  const params = new URLSearchParams();
  if (laboratorioId) {
    params.append('laboratorioId', laboratorioId);
  }

  const response = await fetch(`${API_BASE_URL}/lab-jobs/unbilled?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los trabajos no facturados');
  }

  return response.json();
}


