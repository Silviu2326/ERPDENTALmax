// API para gestión de facturación, cobros y contabilidad
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces para Facturas
export interface Factura {
  _id?: string;
  numeroFactura: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  fechaEmision: string; // ISO Date
  fechaVencimiento: string; // ISO Date
  items: Array<{
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
  }>;
  total: number;
  estado: 'Pagada' | 'Pendiente' | 'Vencida' | 'Anulada';
  pagos: string[]; // Array de ObjectIds de Pago
  totalPagado: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pago {
  _id?: string;
  factura: string; // ObjectId de Factura
  fechaPago: string; // ISO Date
  monto: number;
  metodoPago: string;
  sede: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
}

// Interfaces para Dashboard
export interface DashboardKpis {
  totalFacturado: number;
  totalCobrado: number;
  saldoPendiente: number;
  facturasPendientes: number;
}

export interface IngresosPorPeriodo {
  periodo: string;
  ingresos: number;
  cobros: number;
}

export interface EstadoFacturasSummary {
  pagada: number;
  pendiente: number;
  vencida: number;
  anulada: number;
}

export interface FacturasRecientesResponse {
  data: Factura[];
  total: number;
  page: number;
  limit: number;
}

export interface FiltrosDashboard {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  sedeId?: string;
}

// GET /api/facturacion/dashboard/kpis
export async function obtenerDashboardKpis(
  filtros: FiltrosDashboard
): Promise<DashboardKpis> {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }

  const response = await fetch(`${API_BASE_URL}/facturacion/dashboard/kpis?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los KPIs del dashboard');
  }

  return response.json();
}

// GET /api/facturacion/dashboard/ingresos-periodo
export async function obtenerIngresosPorPeriodo(
  filtros: FiltrosDashboard,
  agrupacion: 'dia' | 'semana' | 'mes' = 'dia'
): Promise<IngresosPorPeriodo[]> {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    agrupacion,
  });

  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }

  const response = await fetch(`${API_BASE_URL}/facturacion/dashboard/ingresos-periodo?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los ingresos por período');
  }

  return response.json();
}

// GET /api/facturacion/dashboard/estado-facturas
export async function obtenerEstadoFacturasSummary(
  filtros: FiltrosDashboard
): Promise<EstadoFacturasSummary> {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }

  const response = await fetch(`${API_BASE_URL}/facturacion/dashboard/estado-facturas?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el resumen de estado de facturas');
  }

  return response.json();
}

// GET /api/facturacion/recientes
export async function obtenerFacturasRecientes(
  limit: number = 10,
  page: number = 1,
  sedeId?: string
): Promise<FacturasRecientesResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  });

  if (sedeId) {
    params.append('sedeId', sedeId);
  }

  const response = await fetch(`${API_BASE_URL}/facturacion/recientes?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las facturas recientes');
  }

  return response.json();
}

// Interfaces para Nueva Factura
export interface PacienteSimplificado {
  _id: string;
  nombreCompleto: string;
  dni?: string;
}

export interface TratamientoPendiente {
  _id: string;
  descripcion: string;
  precio: number;
  fechaRealizacion: string;
}

export interface ConfiguracionFiscal {
  tiposIva: Array<{
    tipo: string;
    porcentaje: number;
    descripcion: string;
  }>;
  datosClinica: {
    nombre: string;
    cif?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
  };
}

export interface ConceptoFactura {
  id: string; // ID temporal para el frontend
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  tipoImpuesto: string;
  porcentajeImpuesto: number;
  descuento?: number;
  total: number;
  tratamientoId?: string; // Si viene de un tratamiento
}

export interface NuevaFacturaData {
  pacienteId: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  conceptos: ConceptoFactura[];
  subtotal: number;
  impuestos: number;
  total: number;
  notas?: string;
}

// GET /api/pacientes/buscar
export async function buscarPacientes(query: string): Promise<PacienteSimplificado[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
  });

  const response = await fetch(`${API_BASE_URL}/pacientes/buscar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al buscar pacientes' }));
    throw new Error(error.message || 'Error al buscar pacientes');
  }

  return response.json();
}

// GET /api/tratamientos/pendientes/:pacienteId
export async function obtenerTratamientosPendientes(pacienteId: string): Promise<TratamientoPendiente[]> {
  const response = await fetch(`${API_BASE_URL}/tratamientos/pendientes/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener tratamientos pendientes' }));
    throw new Error(error.message || 'Error al obtener tratamientos pendientes');
  }

  return response.json();
}

// GET /api/configuracion/fiscal
export async function obtenerConfiguracionFiscal(): Promise<ConfiguracionFiscal> {
  const response = await fetch(`${API_BASE_URL}/configuracion/fiscal`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener configuración fiscal' }));
    throw new Error(error.message || 'Error al obtener configuración fiscal');
  }

  return response.json();
}

// POST /api/facturas
export async function crearFactura(datos: NuevaFacturaData): Promise<Factura> {
  const response = await fetch(`${API_BASE_URL}/facturas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la factura' }));
    throw new Error(error.message || 'Error al crear la factura');
  }

  return response.json();
}

// Interfaces para Editar Factura
export interface ItemFacturaEditable {
  _id?: string;
  tratamiento?: {
    _id: string;
    nombre: string;
  };
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  impuesto: number;
  totalItem: number;
}

export interface HistorialCambio {
  usuario: {
    _id: string;
    nombre: string;
  };
  fecha: string;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
}

export interface FacturaDetallada {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  };
  numeroFactura: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  items: ItemFacturaEditable[];
  subtotal: number;
  totalImpuestos: number;
  totalDescuentos: number;
  total: number;
  estado: 'borrador' | 'emitida' | 'pagada' | 'anulada';
  historialCambios?: HistorialCambio[];
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FacturaActualizada {
  items: Array<{
    tratamiento?: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    impuesto: number;
  }>;
  fechaEmision?: string;
  fechaVencimiento?: string;
  notas?: string;
}

export interface TratamientoBusqueda {
  _id: string;
  nombre: string;
  codigo?: string;
  precio: number;
  descripcion?: string;
}

// GET /api/facturas/:id
export async function obtenerFacturaPorId(id: string): Promise<FacturaDetallada> {
  const response = await fetch(`${API_BASE_URL}/facturas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener la factura' }));
    throw new Error(error.message || 'Error al obtener la factura');
  }

  return response.json();
}

// PUT /api/facturas/:id
export async function actualizarFactura(
  id: string,
  datos: FacturaActualizada
): Promise<FacturaDetallada> {
  const response = await fetch(`${API_BASE_URL}/facturas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la factura' }));
    throw new Error(error.message || 'Error al actualizar la factura');
  }

  return response.json();
}

// GET /api/tratamientos/buscar
export async function buscarTratamientos(query: string): Promise<TratamientoBusqueda[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    query: query.trim(),
  });

  const response = await fetch(`${API_BASE_URL}/tratamientos/buscar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al buscar tratamientos' }));
    throw new Error(error.message || 'Error al buscar tratamientos');
  }

  return response.json();
}

