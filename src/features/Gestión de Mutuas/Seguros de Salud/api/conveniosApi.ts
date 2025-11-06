// API para gestión de convenios y acuerdos con mutuas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Tratamiento {
  _id: string;
  nombre: string;
  codigo?: string;
  precioBase?: number;
}

export interface Cobertura {
  _id?: string;
  tratamiento: string | Tratamiento;
  tipo: 'porcentaje' | 'copago_fijo' | 'tarifa_especial';
  valor: number;
  notas_cobertura?: string;
}

export interface Convenio {
  _id?: string;
  mutua: {
    _id: string;
    nombreComercial: string;
    razonSocial?: string;
  };
  nombre: string;
  codigo: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  estado: 'activo' | 'inactivo' | 'borrador';
  notas?: string;
  coberturas: Cobertura[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevoConvenio {
  mutua: string;
  nombre: string;
  codigo: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  estado?: 'activo' | 'inactivo' | 'borrador';
  notas?: string;
  coberturas: Omit<Cobertura, '_id'>[];
}

export interface FiltrosConvenios {
  page?: number;
  limit?: number;
  mutuaId?: string;
  estado?: 'activo' | 'inactivo' | 'borrador';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Datos falsos para tratamientos
const TRATAMIENTOS_FALSOS: Tratamiento[] = [
  { _id: 't1', nombre: 'Limpieza dental', codigo: 'LIM001', precioBase: 60 },
  { _id: 't2', nombre: 'Empaste simple', codigo: 'EMP001', precioBase: 45 },
  { _id: 't3', nombre: 'Empaste complejo', codigo: 'EMP002', precioBase: 85 },
  { _id: 't4', nombre: 'Endodoncia', codigo: 'END001', precioBase: 350 },
  { _id: 't5', nombre: 'Extracción simple', codigo: 'EXT001', precioBase: 40 },
  { _id: 't6', nombre: 'Extracción quirúrgica', codigo: 'EXT002', precioBase: 120 },
  { _id: 't7', nombre: 'Corona cerámica', codigo: 'COR001', precioBase: 450 },
  { _id: 't8', nombre: 'Implante dental', codigo: 'IMP001', precioBase: 1200 },
  { _id: 't9', nombre: 'Ortodoncia', codigo: 'ORT001', precioBase: 3000 },
  { _id: 't10', nombre: 'Blanqueamiento', codigo: 'BLA001', precioBase: 250 },
];

// Datos falsos para convenios
const CONVENIOS_FALSOS: Convenio[] = [
  {
    _id: 'c1',
    mutua: { _id: '1', nombreComercial: 'Sanitas', razonSocial: 'Sanitas Seguros de Salud S.A.' },
    nombre: 'Convenio Sanitas 2024',
    codigo: 'SAN-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio renovado para el año 2024 con mejores condiciones de cobertura.',
    coberturas: [
      { _id: 'cov1', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov2', tratamiento: 't2', tipo: 'porcentaje', valor: 80, notas_cobertura: 'Copago 20%' },
      { _id: 'cov3', tratamiento: 't4', tipo: 'porcentaje', valor: 60, notas_cobertura: 'Copago 40%' },
      { _id: 'cov4', tratamiento: 't7', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
    ],
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z',
  },
  {
    _id: 'c2',
    mutua: { _id: '2', nombreComercial: 'Adeslas', razonSocial: 'Adeslas Segurcaixa S.A.' },
    nombre: 'Acuerdo Adeslas Premium',
    codigo: 'ADE-PREM-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Acuerdo premium con cobertura ampliada para pacientes de Adeslas.',
    coberturas: [
      { _id: 'cov5', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov6', tratamiento: 't2', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov7', tratamiento: 't3', tipo: 'porcentaje', valor: 75, notas_cobertura: 'Copago 25%' },
      { _id: 'cov8', tratamiento: 't4', tipo: 'porcentaje', valor: 65, notas_cobertura: 'Copago 35%' },
      { _id: 'cov9', tratamiento: 't8', tipo: 'porcentaje', valor: 40, notas_cobertura: 'Copago 60%' },
    ],
    createdAt: '2023-11-20T14:30:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    _id: 'c3',
    mutua: { _id: '3', nombreComercial: 'DKV Seguros', razonSocial: 'DKV Seguros de Salud S.A.U.' },
    nombre: 'Convenio DKV Estándar',
    codigo: 'DKV-STD-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio estándar con cobertura en prevención y tratamientos básicos.',
    coberturas: [
      { _id: 'cov10', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov11', tratamiento: 't2', tipo: 'porcentaje', valor: 80, notas_cobertura: 'Copago 20%' },
      { _id: 'cov12', tratamiento: 't5', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
    ],
    createdAt: '2023-12-10T11:15:00Z',
    updatedAt: '2024-01-01T07:30:00Z',
  },
  {
    _id: 'c4',
    mutua: { _id: '4', nombreComercial: 'Asisa', razonSocial: 'Asisa Seguros de Salud S.A.' },
    nombre: 'Convenio Asisa Completo',
    codigo: 'ASI-COMP-2024',
    fechaInicio: '2024-02-01',
    fechaFin: '2025-01-31',
    estado: 'activo',
    notas: 'Convenio completo con amplia cobertura en todos los tratamientos.',
    coberturas: [
      { _id: 'cov13', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov14', tratamiento: 't2', tipo: 'porcentaje', valor: 75, notas_cobertura: 'Copago 25%' },
      { _id: 'cov15', tratamiento: 't3', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
      { _id: 'cov16', tratamiento: 't4', tipo: 'porcentaje', valor: 60, notas_cobertura: 'Copago 40%' },
      { _id: 'cov17', tratamiento: 't7', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
    ],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    _id: 'c5',
    mutua: { _id: '5', nombreComercial: 'Mapfre Salud', razonSocial: 'Mapfre Salud S.A.' },
    nombre: 'Acuerdo Mapfre Básico',
    codigo: 'MAP-BAS-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Acuerdo básico con cobertura en tratamientos preventivos y básicos.',
    coberturas: [
      { _id: 'cov18', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov19', tratamiento: 't2', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
      { _id: 'cov20', tratamiento: 't5', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
    ],
    createdAt: '2023-12-05T16:20:00Z',
    updatedAt: '2024-01-01T06:00:00Z',
  },
  {
    _id: 'c6',
    mutua: { _id: '6', nombreComercial: 'Fiatc Salud', razonSocial: 'Fiatc Mutua de Seguros y Reaseguros a Prima Fija' },
    nombre: 'Convenio Fiatc 2024',
    codigo: 'FIA-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio anual con condiciones favorables para pacientes de Fiatc.',
    coberturas: [
      { _id: 'cov21', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov22', tratamiento: 't2', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov23', tratamiento: 't3', tipo: 'porcentaje', valor: 75, notas_cobertura: 'Copago 25%' },
      { _id: 'cov24', tratamiento: 't4', tipo: 'porcentaje', valor: 65, notas_cobertura: 'Copago 35%' },
    ],
    createdAt: '2023-12-20T13:45:00Z',
    updatedAt: '2024-01-01T05:30:00Z',
  },
  {
    _id: 'c7',
    mutua: { _id: '7', nombreComercial: 'Allianz Care', razonSocial: 'Allianz Care España S.A.' },
    nombre: 'Convenio Allianz Premium',
    codigo: 'ALL-PREM-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio premium con máxima cobertura y sin topes en tratamientos preventivos.',
    coberturas: [
      { _id: 'cov25', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov26', tratamiento: 't2', tipo: 'porcentaje', valor: 90, notas_cobertura: 'Copago 10%' },
      { _id: 'cov27', tratamiento: 't3', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov28', tratamiento: 't4', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
      { _id: 'cov29', tratamiento: 't7', tipo: 'porcentaje', valor: 60, notas_cobertura: 'Copago 40%' },
      { _id: 'cov30', tratamiento: 't8', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
    ],
    createdAt: '2023-12-18T10:30:00Z',
    updatedAt: '2024-01-01T04:00:00Z',
  },
  {
    _id: 'c8',
    mutua: { _id: '1', nombreComercial: 'Sanitas', razonSocial: 'Sanitas Seguros de Salud S.A.' },
    nombre: 'Convenio Sanitas Borrador 2025',
    codigo: 'SAN-2025-DRAFT',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-12-31',
    estado: 'borrador',
    notas: 'Borrador del convenio para 2025 pendiente de aprobación.',
    coberturas: [
      { _id: 'cov31', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov32', tratamiento: 't2', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
    ],
    createdAt: '2024-11-15T14:00:00Z',
    updatedAt: '2024-11-20T16:00:00Z',
  },
  {
    _id: 'c9',
    mutua: { _id: '9', nombreComercial: 'Cigna Salud', razonSocial: 'Cigna Healthcare España S.A.' },
    nombre: 'Convenio Cigna 2024',
    codigo: 'CIG-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio completo con cobertura ampliada en todos los tratamientos.',
    coberturas: [
      { _id: 'cov33', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov34', tratamiento: 't2', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov35', tratamiento: 't3', tipo: 'porcentaje', valor: 80, notas_cobertura: 'Copago 20%' },
      { _id: 'cov36', tratamiento: 't4', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
      { _id: 'cov37', tratamiento: 't7', tipo: 'porcentaje', valor: 60, notas_cobertura: 'Copago 40%' },
      { _id: 'cov38', tratamiento: 't8', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
    ],
    createdAt: '2023-12-25T10:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    _id: 'c10',
    mutua: { _id: '10', nombreComercial: 'Axa Salud', razonSocial: 'Axa Seguros Generales S.A.' },
    nombre: 'Convenio Axa Estándar',
    codigo: 'AXA-STD-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio estándar con cobertura en tratamientos básicos y especialidades.',
    coberturas: [
      { _id: 'cov39', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov40', tratamiento: 't2', tipo: 'porcentaje', valor: 75, notas_cobertura: 'Copago 25%' },
      { _id: 'cov41', tratamiento: 't3', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
      { _id: 'cov42', tratamiento: 't4', tipo: 'porcentaje', valor: 55, notas_cobertura: 'Copago 45%' },
    ],
    createdAt: '2023-12-28T11:30:00Z',
    updatedAt: '2024-01-01T07:00:00Z',
  },
  {
    _id: 'c11',
    mutua: { _id: '11', nombreComercial: 'Mutua Madrileña', razonSocial: 'Mutua Madrileña Automovilista' },
    nombre: 'Convenio Mutua Madrileña Premium',
    codigo: 'MUT-PREM-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio premium con máxima cobertura y sin topes para socios.',
    coberturas: [
      { _id: 'cov43', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov44', tratamiento: 't2', tipo: 'porcentaje', valor: 90, notas_cobertura: 'Copago 10%' },
      { _id: 'cov45', tratamiento: 't3', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov46', tratamiento: 't4', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
      { _id: 'cov47', tratamiento: 't7', tipo: 'porcentaje', valor: 60, notas_cobertura: 'Copago 40%' },
      { _id: 'cov48', tratamiento: 't8', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
      { _id: 'cov49', tratamiento: 't9', tipo: 'porcentaje', valor: 40, notas_cobertura: 'Copago 60%' },
    ],
    createdAt: '2023-12-30T09:00:00Z',
    updatedAt: '2024-01-01T06:30:00Z',
  },
  {
    _id: 'c12',
    mutua: { _id: '12', nombreComercial: 'Vitaldent Seguros', razonSocial: 'Vitaldent Seguros Dentales S.L.' },
    nombre: 'Convenio Vitaldent Dental',
    codigo: 'VIT-DENT-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio especializado en tratamientos dentales con cobertura ampliada.',
    coberturas: [
      { _id: 'cov50', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov51', tratamiento: 't2', tipo: 'porcentaje', valor: 80, notas_cobertura: 'Copago 20%' },
      { _id: 'cov52', tratamiento: 't3', tipo: 'porcentaje', valor: 75, notas_cobertura: 'Copago 25%' },
      { _id: 'cov53', tratamiento: 't4', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
      { _id: 'cov54', tratamiento: 't7', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
      { _id: 'cov55', tratamiento: 't10', tipo: 'porcentaje', valor: 30, notas_cobertura: 'Copago 70%' },
    ],
    createdAt: '2023-12-28T10:00:00Z',
    updatedAt: '2024-01-01T07:00:00Z',
  },
  {
    _id: 'c13',
    mutua: { _id: '13', nombreComercial: 'Generali Salud', razonSocial: 'Generali Seguros S.A.' },
    nombre: 'Convenio Generali Estándar',
    codigo: 'GEN-STD-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio estándar con cobertura equilibrada en todos los tratamientos.',
    coberturas: [
      { _id: 'cov56', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov57', tratamiento: 't2', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov58', tratamiento: 't3', tipo: 'porcentaje', valor: 75, notas_cobertura: 'Copago 25%' },
      { _id: 'cov59', tratamiento: 't4', tipo: 'porcentaje', valor: 65, notas_cobertura: 'Copago 35%' },
      { _id: 'cov60', tratamiento: 't7', tipo: 'porcentaje', valor: 55, notas_cobertura: 'Copago 45%' },
    ],
    createdAt: '2023-12-27T11:30:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    _id: 'c14',
    mutua: { _id: '14', nombreComercial: 'Zurich Salud', razonSocial: 'Zurich Seguros S.A.' },
    nombre: 'Convenio Zurich Premium',
    codigo: 'ZUR-PREM-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio premium con descuentos especiales en ortodoncia y tratamientos estéticos.',
    coberturas: [
      { _id: 'cov61', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov62', tratamiento: 't2', tipo: 'porcentaje', valor: 80, notas_cobertura: 'Copago 20%' },
      { _id: 'cov63', tratamiento: 't3', tipo: 'porcentaje', valor: 75, notas_cobertura: 'Copago 25%' },
      { _id: 'cov64', tratamiento: 't4', tipo: 'porcentaje', valor: 60, notas_cobertura: 'Copago 40%' },
      { _id: 'cov65', tratamiento: 't7', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
      { _id: 'cov66', tratamiento: 't9', tipo: 'porcentaje', valor: 35, notas_cobertura: 'Copago 65%' },
      { _id: 'cov67', tratamiento: 't10', tipo: 'porcentaje', valor: 40, notas_cobertura: 'Copago 60%' },
    ],
    createdAt: '2023-12-26T09:15:00Z',
    updatedAt: '2024-01-01T09:00:00Z',
  },
  {
    _id: 'c15',
    mutua: { _id: '15', nombreComercial: 'Medifiatc', razonSocial: 'Medifiatc Seguros de Salud S.A.' },
    nombre: 'Convenio Medifiatc 2024',
    codigo: 'MED-2024',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    notas: 'Convenio anual con cobertura ampliada en prevención y tratamientos básicos.',
    coberturas: [
      { _id: 'cov68', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov69', tratamiento: 't2', tipo: 'porcentaje', valor: 90, notas_cobertura: 'Copago 10%' },
      { _id: 'cov70', tratamiento: 't3', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov71', tratamiento: 't4', tipo: 'porcentaje', valor: 70, notas_cobertura: 'Copago 30%' },
      { _id: 'cov72', tratamiento: 't5', tipo: 'porcentaje', valor: 65, notas_cobertura: 'Copago 35%' },
    ],
    createdAt: '2023-12-24T14:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    _id: 'c16',
    mutua: { _id: '16', nombreComercial: 'Quirónsalud', razonSocial: 'Quirónsalud Seguros de Salud S.A.' },
    nombre: 'Convenio Quirónsalud Red',
    codigo: 'QUI-RED-2024',
    fechaInicio: '2024-02-01',
    fechaFin: '2025-01-31',
    estado: 'activo',
    notas: 'Convenio con red de clínicas propia. Cobertura preferente en centros Quirónsalud.',
    coberturas: [
      { _id: 'cov73', tratamiento: 't1', tipo: 'porcentaje', valor: 100, notas_cobertura: 'Sin copago' },
      { _id: 'cov74', tratamiento: 't2', tipo: 'porcentaje', valor: 85, notas_cobertura: 'Copago 15%' },
      { _id: 'cov75', tratamiento: 't3', tipo: 'porcentaje', valor: 80, notas_cobertura: 'Copago 20%' },
      { _id: 'cov76', tratamiento: 't4', tipo: 'porcentaje', valor: 65, notas_cobertura: 'Copago 35%' },
      { _id: 'cov77', tratamiento: 't7', tipo: 'porcentaje', valor: 60, notas_cobertura: 'Copago 40%' },
      { _id: 'cov78', tratamiento: 't8', tipo: 'porcentaje', valor: 50, notas_cobertura: 'Copago 50%' },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
  },
];

// Obtener listado paginado de convenios
export async function obtenerConvenios(filtros: FiltrosConvenios = {}): Promise<PaginatedResponse<Convenio>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let conveniosFiltrados = [...CONVENIOS_FALSOS];

  // Aplicar filtro de mutua
  if (filtros.mutuaId) {
    conveniosFiltrados = conveniosFiltrados.filter(c => c.mutua._id === filtros.mutuaId);
  }

  // Aplicar filtro de estado
  if (filtros.estado) {
    conveniosFiltrados = conveniosFiltrados.filter(c => c.estado === filtros.estado);
  }

  // Aplicar filtro de búsqueda
  if (filtros.search) {
    const searchLower = filtros.search.toLowerCase();
    conveniosFiltrados = conveniosFiltrados.filter(
      c =>
        c.nombre.toLowerCase().includes(searchLower) ||
        c.codigo.toLowerCase().includes(searchLower) ||
        c.mutua.nombreComercial.toLowerCase().includes(searchLower)
    );
  }

  // Paginación
  const page = filtros.page || 1;
  const limit = filtros.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = conveniosFiltrados.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: conveniosFiltrados.slice(startIndex, endIndex),
    total,
    page,
    limit,
    totalPages,
  };
}

// Obtener detalle de un convenio por ID
export async function obtenerConvenioPorId(id: string): Promise<Convenio> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const convenio = CONVENIOS_FALSOS.find(c => c._id === id);
  if (!convenio) {
    throw new Error('Convenio no encontrado');
  }

  // Expandir tratamientos en coberturas
  const convenioConTratamientos = {
    ...convenio,
    coberturas: convenio.coberturas.map(cov => ({
      ...cov,
      tratamiento: typeof cov.tratamiento === 'string'
        ? TRATAMIENTOS_FALSOS.find(t => t._id === cov.tratamiento) || cov.tratamiento
        : cov.tratamiento,
    })),
  };

  return convenioConTratamientos;
}

// Crear un nuevo convenio
export async function crearConvenio(convenio: NuevoConvenio): Promise<Convenio> {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Buscar la mutua para obtener sus datos
  const mutuaData = await import('./mutuasApi').then(m => m.obtenerMutuas({ limit: 1000 }));
  const mutua = mutuaData.data.find(m => m._id === convenio.mutua);

  if (!mutua) {
    throw new Error('Mutua no encontrada');
  }

  const nuevoConvenio: Convenio = {
    ...convenio,
    _id: `c${CONVENIOS_FALSOS.length + 1}`,
    mutua: {
      _id: mutua._id!,
      nombreComercial: mutua.nombreComercial,
      razonSocial: mutua.razonSocial,
    },
    estado: convenio.estado || 'activo',
    coberturas: convenio.coberturas.map((cov, idx) => ({
      ...cov,
      _id: `cov${CONVENIOS_FALSOS.length * 10 + idx + 1}`,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  CONVENIOS_FALSOS.push(nuevoConvenio);
  return nuevoConvenio;
}

// Actualizar un convenio existente
export async function actualizarConvenio(id: string, convenio: Partial<NuevoConvenio>): Promise<Convenio> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = CONVENIOS_FALSOS.findIndex(c => c._id === id);
  if (index === -1) {
    throw new Error('Convenio no encontrado');
  }

  // Si se actualiza la mutua, obtener sus datos
  if (convenio.mutua) {
    const mutuaData = await import('./mutuasApi').then(m => m.obtenerMutuas({ limit: 1000 }));
    const mutua = mutuaData.data.find(m => m._id === convenio.mutua);
    if (mutua) {
      CONVENIOS_FALSOS[index].mutua = {
        _id: mutua._id!,
        nombreComercial: mutua.nombreComercial,
        razonSocial: mutua.razonSocial,
      };
    }
  }

  CONVENIOS_FALSOS[index] = {
    ...CONVENIOS_FALSOS[index],
    ...convenio,
    coberturas: convenio.coberturas
      ? convenio.coberturas.map((cov, idx) => ({
          ...cov,
          _id: cov._id || `cov${Date.now()}-${idx}`,
        }))
      : CONVENIOS_FALSOS[index].coberturas,
    updatedAt: new Date().toISOString(),
  };

  return CONVENIOS_FALSOS[index];
}

// Eliminar un convenio (soft delete - cambiar a inactivo)
export async function eliminarConvenio(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = CONVENIOS_FALSOS.findIndex(c => c._id === id);
  if (index === -1) {
    throw new Error('Convenio no encontrado');
  }

  CONVENIOS_FALSOS[index].estado = 'inactivo';
  CONVENIOS_FALSOS[index].updatedAt = new Date().toISOString();
}

// Obtener lista de tratamientos disponibles
export async function obtenerTratamientos(busqueda?: string): Promise<Tratamiento[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  let tratamientos = [...TRATAMIENTOS_FALSOS];

  if (busqueda) {
    const busquedaLower = busqueda.toLowerCase();
    tratamientos = tratamientos.filter(
      t =>
        t.nombre.toLowerCase().includes(busquedaLower) ||
        t.codigo?.toLowerCase().includes(busquedaLower)
    );
  }

  return tratamientos;
}


