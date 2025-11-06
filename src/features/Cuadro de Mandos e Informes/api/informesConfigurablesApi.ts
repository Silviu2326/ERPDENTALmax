// API para Informes Configurables
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Tipos para metadatos de fuentes de datos
export interface FieldMetadata {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object';
  label: string;
  relation?: {
    model: string;
    field: string;
  };
}

export interface DataSourceMetadata {
  dataSource: string;
  label: string;
  fields: FieldMetadata[];
}

// Tipos para configuración de informes
export type FilterOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'contains' | 'not_contains' | 'between' | 'in' | 'not_in';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // Para operadores como 'between'
}

export interface FilterGroup {
  conditions: FilterCondition[];
  logic: 'AND' | 'OR';
}

export interface GroupingConfig {
  field: string;
  label?: string;
}

export interface AggregationConfig {
  field: string;
  function: 'sum' | 'count' | 'avg' | 'min' | 'max';
  label?: string;
}

export interface ReportConfiguration {
  dataSource: string;
  columns: string[];
  filters?: FilterGroup[];
  grouping?: GroupingConfig[];
  aggregation?: AggregationConfig[];
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  page?: number;
  visualizationType?: 'table' | 'bar' | 'line' | 'pie';
}

export interface ReportData {
  data: any[];
  totalRecords: number;
  columns: string[];
}

export interface SavedReport {
  _id: string;
  nombre: string;
  descripcion?: string;
  propietario: {
    _id: string;
    nombre: string;
  };
  configuracion: ReportConfiguration;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CreateSavedReportRequest {
  nombre: string;
  descripcion?: string;
  configuracion: ReportConfiguration;
}

// Obtener metadatos de todas las fuentes de datos disponibles
export async function getReportMetadata(): Promise<DataSourceMetadata[]> {
  const response = await fetch(`${API_BASE_URL}/reports/metadata`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener metadatos de fuentes de datos');
  }

  return response.json();
}

// Generar un informe basado en la configuración
export async function generateReport(config: ReportConfiguration): Promise<ReportData> {
  const response = await fetch(`${API_BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al generar el informe' }));
    throw new Error(error.message || 'Error al generar el informe');
  }

  return response.json();
}

// Obtener lista de informes guardados
export async function getSavedReports(): Promise<SavedReport[]> {
  const response = await fetch(`${API_BASE_URL}/reports/saved`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener informes guardados');
  }

  return response.json();
}

// Crear un nuevo informe guardado
export async function createSavedReport(report: CreateSavedReportRequest): Promise<SavedReport> {
  const response = await fetch(`${API_BASE_URL}/reports/saved`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al guardar el informe' }));
    throw new Error(error.message || 'Error al guardar el informe');
  }

  return response.json();
}

// Obtener un informe guardado por ID
export async function getSavedReportById(id: string): Promise<SavedReport> {
  const response = await fetch(`${API_BASE_URL}/reports/saved/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el informe guardado');
  }

  return response.json();
}

// Actualizar un informe guardado
export async function updateSavedReport(id: string, report: Partial<CreateSavedReportRequest>): Promise<SavedReport> {
  const response = await fetch(`${API_BASE_URL}/reports/saved/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el informe' }));
    throw new Error(error.message || 'Error al actualizar el informe');
  }

  return response.json();
}

// Eliminar un informe guardado
export async function deleteSavedReport(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reports/saved/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el informe');
  }
}


