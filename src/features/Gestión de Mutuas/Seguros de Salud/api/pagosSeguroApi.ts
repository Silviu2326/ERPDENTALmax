// API para gestión de pagos de seguros
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ReclamacionCubierta {
  idReclamacion: string;
  montoAplicado: number;
  reclamacion?: {
    _id: string;
    idPaciente: string;
    paciente?: {
      _id: string;
      nombre: string;
      apellidos: string;
    };
    idTratamiento: string;
    tratamiento?: {
      _id: string;
      nombre: string;
    };
    montoReclamado: number;
    montoPagado: number;
    estado: 'enviada' | 'pagada' | 'rechazada' | 'pagada_parcialmente';
  };
}

export interface PagoSeguro {
  _id?: string;
  idAseguradora: string;
  aseguradora?: {
    _id: string;
    nombreComercial: string;
    razonSocial?: string;
    cif?: string;
  };
  montoTotal: number;
  fechaPago: string | Date;
  metodoPago: 'transferencia' | 'cheque' | 'otro';
  referencia: string;
  estado: 'conciliado' | 'pendiente' | 'parcial';
  reclamacionesCubiertas: ReclamacionCubierta[];
  clinica?: string;
  creadoPor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevoPagoSeguro {
  idAseguradora: string;
  montoTotal: number;
  fechaPago: string | Date;
  metodoPago: 'transferencia' | 'cheque' | 'otro';
  referencia: string;
  reclamacionesCubiertas: {
    idReclamacion: string;
    montoAplicado: number;
  }[];
}

export interface FiltrosPagosSeguro {
  page?: number;
  limit?: number;
  fechaInicio?: string; // formato YYYY-MM-DD
  fechaFin?: string; // formato YYYY-MM-DD
  idAseguradora?: string;
  estado?: 'conciliado' | 'parcial' | 'pendiente';
  sortBy?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

// Datos falsos para pagos de seguros
const PAGOS_FALSOS: PagoSeguro[] = [
  {
    _id: 'pg1',
    idAseguradora: '1',
    aseguradora: { _id: '1', nombreComercial: 'Sanitas', razonSocial: 'Sanitas Seguros de Salud S.A.', cif: 'A28012345' },
    montoTotal: 2450.50,
    fechaPago: '2024-01-15T10:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-001234',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r1',
        montoAplicado: 1200.00,
        reclamacion: {
          _id: 'r1',
          idPaciente: 'p1',
          paciente: { _id: 'p1', nombre: 'Juan', apellidos: 'García López' },
          idTratamiento: 't4',
          tratamiento: { _id: 't4', nombre: 'Endodoncia' },
          montoReclamado: 1200.00,
          montoPagado: 1200.00,
          estado: 'pagada',
        },
      },
      {
        idReclamacion: 'r2',
        montoAplicado: 1250.50,
        reclamacion: {
          _id: 'r2',
          idPaciente: 'p8',
          paciente: { _id: 'p8', nombre: 'Sofía', apellidos: 'Martínez Ruiz' },
          idTratamiento: 't4',
          tratamiento: { _id: 't4', nombre: 'Endodoncia' },
          montoReclamado: 1250.50,
          montoPagado: 1250.50,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: 'pg2',
    idAseguradora: '2',
    aseguradora: { _id: '2', nombreComercial: 'Adeslas', razonSocial: 'Adeslas Segurcaixa S.A.', cif: 'A28023456' },
    montoTotal: 3825.75,
    fechaPago: '2024-01-20T14:30:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-001567',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r3',
        montoAplicado: 3825.75,
        reclamacion: {
          _id: 'r3',
          idPaciente: 'p2',
          paciente: { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
          idTratamiento: 't7',
          tratamiento: { _id: 't7', nombre: 'Corona cerámica' },
          montoReclamado: 3825.75,
          montoPagado: 3825.75,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    _id: 'pg3',
    idAseguradora: '4',
    aseguradora: { _id: '4', nombreComercial: 'Asisa', razonSocial: 'Asisa Seguros de Salud S.A.', cif: 'A28045678' },
    montoTotal: 15000.00,
    fechaPago: '2024-01-12T09:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-000890',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r4',
        montoAplicado: 15000.00,
        reclamacion: {
          _id: 'r4',
          idPaciente: 'p4',
          paciente: { _id: 'p4', nombre: 'Ana', apellidos: 'López Martín' },
          idTratamiento: 't9',
          tratamiento: { _id: 't9', nombre: 'Ortodoncia' },
          montoReclamado: 15000.00,
          montoPagado: 15000.00,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
  },
  {
    _id: 'pg4',
    idAseguradora: '6',
    aseguradora: { _id: '6', nombreComercial: 'Fiatc Salud', razonSocial: 'Fiatc Mutua de Seguros y Reaseguros a Prima Fija', cif: 'A28067890' },
    montoTotal: 125.00,
    fechaPago: '2024-01-24T16:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-001789',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r5',
        montoAplicado: 125.00,
        reclamacion: {
          _id: 'r5',
          idPaciente: 'p6',
          paciente: { _id: 'p6', nombre: 'Laura', apellidos: 'Gómez Pérez' },
          idTratamiento: 't10',
          tratamiento: { _id: 't10', nombre: 'Blanqueamiento' },
          montoReclamado: 250.00,
          montoPagado: 125.00,
          estado: 'pagada_parcialmente',
        },
      },
    ],
    createdAt: '2024-01-24T16:00:00Z',
    updatedAt: '2024-01-24T16:00:00Z',
  },
  {
    _id: 'pg5',
    idAseguradora: '3',
    aseguradora: { _id: '3', nombreComercial: 'DKV Seguros', razonSocial: 'DKV Seguros de Salud S.A.U.', cif: 'A28034567' },
    montoTotal: 2100.00,
    fechaPago: '2024-01-22T11:00:00Z',
    metodoPago: 'cheque',
    referencia: 'CHQ-2024-000123',
    estado: 'pendiente',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r6',
        montoAplicado: 2100.00,
        reclamacion: {
          _id: 'r6',
          idPaciente: 'p3',
          paciente: { _id: 'p3', nombre: 'Carlos', apellidos: 'Fernández Torres' },
          idTratamiento: 't8',
          tratamiento: { _id: 't8', nombre: 'Implante dental' },
          montoReclamado: 2400.00,
          montoPagado: 2100.00,
          estado: 'pagada_parcialmente',
        },
      },
    ],
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
  {
    _id: 'pg6',
    idAseguradora: '1',
    aseguradora: { _id: '1', nombreComercial: 'Sanitas', razonSocial: 'Sanitas Seguros de Salud S.A.', cif: 'A28012345' },
    montoTotal: 875.25,
    fechaPago: '2024-01-14T13:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-000456',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r7',
        montoAplicado: 875.25,
        reclamacion: {
          _id: 'r7',
          idPaciente: 'p8',
          paciente: { _id: 'p8', nombre: 'Sofía', apellidos: 'Martínez Ruiz' },
          idTratamiento: 't4',
          tratamiento: { _id: 't4', nombre: 'Endodoncia' },
          montoReclamado: 875.25,
          montoPagado: 875.25,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-01-14T13:00:00Z',
    updatedAt: '2024-01-14T13:00:00Z',
  },
  {
    _id: 'pg7',
    idAseguradora: '7',
    aseguradora: { _id: '7', nombreComercial: 'Allianz Care', razonSocial: 'Allianz Care España S.A.', cif: 'A28078901' },
    montoTotal: 595.50,
    fechaPago: '2024-01-28T10:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-001901',
    estado: 'pendiente',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r8',
        montoAplicado: 595.50,
        reclamacion: {
          _id: 'r8',
          idPaciente: 'p7',
          paciente: { _id: 'p7', nombre: 'Miguel', apellidos: 'Torres Jiménez' },
          idTratamiento: 't3',
          tratamiento: { _id: 't3', nombre: 'Empaste complejo' },
          montoReclamado: 595.50,
          montoPagado: 0,
          estado: 'enviada',
        },
      },
    ],
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
  {
    _id: 'pg8',
    idAseguradora: '9',
    aseguradora: { _id: '9', nombreComercial: 'Cigna Salud', razonSocial: 'Cigna Healthcare España S.A.', cif: 'A28090123' },
    montoTotal: 1530.00,
    fechaPago: '2024-01-25T12:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002012',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r9',
        montoAplicado: 1530.00,
        reclamacion: {
          _id: 'r9',
          idPaciente: 'p1',
          paciente: { _id: 'p1', nombre: 'Juan', apellidos: 'García López' },
          idTratamiento: 't2',
          tratamiento: { _id: 't2', nombre: 'Empaste simple' },
          montoReclamado: 1530.00,
          montoPagado: 1530.00,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-01-25T12:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
  },
  {
    _id: 'pg9',
    idAseguradora: '2',
    aseguradora: { _id: '2', nombreComercial: 'Adeslas', razonSocial: 'Adeslas Segurcaixa S.A.', cif: 'A28023456' },
    montoTotal: 54.00,
    fechaPago: '2024-01-08T11:30:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-000234',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r10',
        montoAplicado: 54.00,
        reclamacion: {
          _id: 'r10',
          idPaciente: 'p2',
          paciente: { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
          idTratamiento: 't1',
          tratamiento: { _id: 't1', nombre: 'Limpieza dental' },
          montoReclamado: 60.00,
          montoPagado: 54.00,
          estado: 'pagada_parcialmente',
        },
      },
    ],
    createdAt: '2024-01-08T11:30:00Z',
    updatedAt: '2024-01-08T11:30:00Z',
  },
  {
    _id: 'pg10',
    idAseguradora: '4',
    aseguradora: { _id: '4', nombreComercial: 'Asisa', razonSocial: 'Asisa Seguros de Salud S.A.', cif: 'A28045678' },
    montoTotal: 33.75,
    fechaPago: '2024-01-17T10:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-000567',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r11',
        montoAplicado: 33.75,
        reclamacion: {
          _id: 'r11',
          idPaciente: 'p4',
          paciente: { _id: 'p4', nombre: 'Ana', apellidos: 'López Martín' },
          idTratamiento: 't2',
          tratamiento: { _id: 't2', nombre: 'Empaste simple' },
          montoReclamado: 45.00,
          montoPagado: 33.75,
          estado: 'pagada_parcialmente',
        },
      },
    ],
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    _id: 'pg11',
    idAseguradora: '11',
    aseguradora: { _id: '11', nombreComercial: 'Mutua Madrileña', razonSocial: 'Mutua Madrileña Automovilista', cif: 'A28112345' },
    montoTotal: 2800.00,
    fechaPago: '2024-01-19T15:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-000789',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r12',
        montoAplicado: 2800.00,
        reclamacion: {
          _id: 'r12',
          idPaciente: 'p5',
          paciente: { _id: 'p5', nombre: 'Pedro', apellidos: 'Sánchez Díaz' },
          idTratamiento: 't6',
          tratamiento: { _id: 't6', nombre: 'Extracción quirúrgica' },
          montoReclamado: 2800.00,
          montoPagado: 2800.00,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-01-19T15:00:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
  },
  {
    _id: 'pg12',
    idAseguradora: '5',
    aseguradora: { _id: '5', nombreComercial: 'Mapfre Salud', razonSocial: 'Mapfre Salud S.A.', cif: 'A28056789' },
    montoTotal: 1680.00,
    fechaPago: '2024-01-26T09:00:00Z',
    metodoPago: 'cheque',
    referencia: 'CHQ-2024-000234',
    estado: 'pendiente',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r13',
        montoAplicado: 1680.00,
        reclamacion: {
          _id: 'r13',
          idPaciente: 'p6',
          paciente: { _id: 'p6', nombre: 'Laura', apellidos: 'Gómez Pérez' },
          idTratamiento: 't3',
          tratamiento: { _id: 't3', nombre: 'Empaste complejo' },
          montoReclamado: 1680.00,
          montoPagado: 0,
          estado: 'enviada',
        },
      },
    ],
    createdAt: '2024-01-26T09:00:00Z',
    updatedAt: '2024-01-26T09:00:00Z',
  },
  {
    _id: 'pg13',
    idAseguradora: '9',
    aseguradora: { _id: '9', nombreComercial: 'Cigna Salud', razonSocial: 'Cigna Healthcare España S.A.', cif: 'A28090123' },
    montoTotal: 3200.00,
    fechaPago: '2024-02-01T11:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002345',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r14',
        montoAplicado: 3200.00,
        reclamacion: {
          _id: 'r14',
          idPaciente: 'p3',
          paciente: { _id: 'p3', nombre: 'Carlos', apellidos: 'Fernández Torres' },
          idTratamiento: 't4',
          tratamiento: { _id: 't4', nombre: 'Endodoncia' },
          montoReclamado: 3200.00,
          montoPagado: 3200.00,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    _id: 'pg14',
    idAseguradora: '1',
    aseguradora: { _id: '1', nombreComercial: 'Sanitas', razonSocial: 'Sanitas Seguros de Salud S.A.', cif: 'A28012345' },
    montoTotal: 180.00,
    fechaPago: '2024-02-05T10:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002456',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r15',
        montoAplicado: 180.00,
        reclamacion: {
          _id: 'r15',
          idPaciente: 'p8',
          paciente: { _id: 'p8', nombre: 'Sofía', apellidos: 'Martínez Ruiz' },
          idTratamiento: 't2',
          tratamiento: { _id: 't2', nombre: 'Empaste simple' },
          montoReclamado: 180.00,
          montoPagado: 180.00,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
  },
  {
    _id: 'pg15',
    idAseguradora: '6',
    aseguradora: { _id: '6', nombreComercial: 'Fiatc Salud', razonSocial: 'Fiatc Mutua de Seguros y Reaseguros a Prima Fija', cif: 'A28067890' },
    montoTotal: 637.50,
    fechaPago: '2024-02-12T14:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002567',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r16',
        montoAplicado: 637.50,
        reclamacion: {
          _id: 'r16',
          idPaciente: 'p6',
          paciente: { _id: 'p6', nombre: 'Laura', apellidos: 'Gómez Pérez' },
          idTratamiento: 't3',
          tratamiento: { _id: 't3', nombre: 'Empaste complejo' },
          montoReclamado: 850.00,
          montoPagado: 637.50,
          estado: 'pagada_parcialmente',
        },
      },
    ],
    createdAt: '2024-02-12T14:00:00Z',
    updatedAt: '2024-02-12T14:00:00Z',
  },
  {
    _id: 'pg16',
    idAseguradora: '4',
    aseguradora: { _id: '4', nombreComercial: 'Asisa', razonSocial: 'Asisa Seguros de Salud S.A.', cif: 'A28045678' },
    montoTotal: 2700.00,
    fechaPago: '2024-02-15T09:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002678',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r17',
        montoAplicado: 2700.00,
        reclamacion: {
          _id: 'r17',
          idPaciente: 'p4',
          paciente: { _id: 'p4', nombre: 'Ana', apellidos: 'López Martín' },
          idTratamiento: 't4',
          tratamiento: { _id: 't4', nombre: 'Endodoncia' },
          montoReclamado: 2700.00,
          montoPagado: 2700.00,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-02-15T09:00:00Z',
  },
  {
    _id: 'pg17',
    idAseguradora: '2',
    aseguradora: { _id: '2', nombreComercial: 'Adeslas', razonSocial: 'Adeslas Segurcaixa S.A.', cif: 'A28023456' },
    montoTotal: 4500.00,
    fechaPago: '2024-02-20T12:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002789',
    estado: 'conciliado',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r18',
        montoAplicado: 4500.00,
        reclamacion: {
          _id: 'r18',
          idPaciente: 'p2',
          paciente: { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
          idTratamiento: 't4',
          tratamiento: { _id: 't4', nombre: 'Endodoncia' },
          montoReclamado: 4500.00,
          montoPagado: 4500.00,
          estado: 'pagada',
        },
      },
    ],
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-02-20T12:00:00Z',
  },
  {
    _id: 'pg18',
    idAseguradora: '11',
    aseguradora: { _id: '11', nombreComercial: 'Mutua Madrileña', razonSocial: 'Mutua Madrileña Automovilista', cif: 'A28112345' },
    montoTotal: 960.00,
    fechaPago: '2024-02-25T15:00:00Z',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002890',
    estado: 'pendiente',
    reclamacionesCubiertas: [
      {
        idReclamacion: 'r19',
        montoAplicado: 960.00,
        reclamacion: {
          _id: 'r19',
          idPaciente: 'p5',
          paciente: { _id: 'p5', nombre: 'Pedro', apellidos: 'Sánchez Díaz' },
          idTratamiento: 't1',
          tratamiento: { _id: 't1', nombre: 'Limpieza dental' },
          montoReclamado: 960.00,
          montoPagado: 0,
          estado: 'enviada',
        },
      },
    ],
    createdAt: '2024-02-25T15:00:00Z',
    updatedAt: '2024-02-25T15:00:00Z',
  },
];

// Obtener listado paginado de pagos de seguros
export async function obtenerPagosSeguro(filtros: FiltrosPagosSeguro = {}): Promise<PaginatedResponse<PagoSeguro>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let pagosFiltrados = [...PAGOS_FALSOS];

  // Aplicar filtro de aseguradora
  if (filtros.idAseguradora) {
    pagosFiltrados = pagosFiltrados.filter(p => p.idAseguradora === filtros.idAseguradora);
  }

  // Aplicar filtro de estado
  if (filtros.estado) {
    pagosFiltrados = pagosFiltrados.filter(p => p.estado === filtros.estado);
  }

  // Aplicar filtro de fechas
  if (filtros.fechaInicio) {
    const fechaInicio = new Date(filtros.fechaInicio);
    pagosFiltrados = pagosFiltrados.filter(p => new Date(p.fechaPago) >= fechaInicio);
  }

  if (filtros.fechaFin) {
    const fechaFin = new Date(filtros.fechaFin);
    pagosFiltrados = pagosFiltrados.filter(p => new Date(p.fechaPago) <= fechaFin);
  }

  // Ordenar
  if (filtros.sortBy) {
    const sortField = filtros.sortBy.startsWith('-') ? filtros.sortBy.slice(1) : filtros.sortBy;
    const ascending = !filtros.sortBy.startsWith('-');
    pagosFiltrados.sort((a, b) => {
      const aVal = (a as any)[sortField];
      const bVal = (b as any)[sortField];
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }

  // Paginación
  const page = filtros.page || 1;
  const limit = filtros.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = pagosFiltrados.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: pagosFiltrados.slice(startIndex, endIndex),
    total,
    page,
    limit,
    totalPages,
    currentPage: page,
    totalCount: total,
  };
}

// Obtener detalle de un pago por ID
export async function obtenerPagoSeguroPorId(id: string): Promise<PagoSeguro> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const pago = PAGOS_FALSOS.find(p => p._id === id);
  if (!pago) {
    throw new Error('Pago no encontrado');
  }

  return pago;
}

// Registrar un nuevo pago de seguro
export async function crearPagoSeguro(pago: NuevoPagoSeguro): Promise<PagoSeguro> {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener datos de aseguradora
  const mutuasData = await import('./mutuasApi').then(m => m.obtenerMutuas({ limit: 1000 }));
  const aseguradora = mutuasData.data.find(m => m._id === pago.idAseguradora);

  const nuevoPago: PagoSeguro = {
    ...pago,
    _id: `pg${PAGOS_FALSOS.length + 1}`,
    aseguradora: aseguradora
      ? {
          _id: aseguradora._id!,
          nombreComercial: aseguradora.nombreComercial,
          razonSocial: aseguradora.razonSocial,
          cif: aseguradora.cif,
        }
      : undefined,
    estado: 'pendiente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  PAGOS_FALSOS.push(nuevoPago);
  return nuevoPago;
}

// Actualizar un pago existente
export async function actualizarPagoSeguro(id: string, pago: Partial<NuevoPagoSeguro>): Promise<PagoSeguro> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = PAGOS_FALSOS.findIndex(p => p._id === id);
  if (index === -1) {
    throw new Error('Pago no encontrado');
  }

  PAGOS_FALSOS[index] = {
    ...PAGOS_FALSOS[index],
    ...pago,
    updatedAt: new Date().toISOString(),
  };

  return PAGOS_FALSOS[index];
}

// Obtener lista de aseguradoras disponibles
export async function obtenerAseguradoras(): Promise<Array<{ _id: string; nombreComercial: string; razonSocial?: string }>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const mutuasData = await import('./mutuasApi').then(m => m.obtenerMutuas({ limit: 1000 }));
  return mutuasData.data
    .filter(m => m.activo)
    .map(m => ({
      _id: m._id!,
      nombreComercial: m.nombreComercial,
      razonSocial: m.razonSocial,
    }));
}


