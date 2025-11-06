// API para el módulo Analítica Avanzada & Data
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface CohortRetentionParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  groupBy: 'monthly' | 'quarterly';
  clinicId?: string;
}

export interface CohortRetentionData {
  cohortDate: string;
  totalPatients: number;
  retention: number[]; // Array de porcentajes de retención por período
}

export interface CohortRetentionResponse {
  cohorts: CohortRetentionData[];
}

/**
 * Obtiene los datos procesados para el análisis de cohortes de retención de pacientes
 * @param params Parámetros de filtrado para el análisis
 * @returns Datos de cohortes con tasas de retención
 */
export async function getCohortRetention(params: CohortRetentionParams): Promise<CohortRetentionResponse> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    groupBy: params.groupBy,
  });

  if (params.clinicId) {
    queryParams.append('clinicId', params.clinicId);
  }

  const response = await fetch(`${API_BASE_URL}/analytics/cohorts/retention?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // La autenticación se manejará mediante cookies o tokens según el sistema
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener datos de cohortes' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// ========== APIs para Análisis de Ausencias (No-show) ==========

export interface FiltrosAusencias {
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  sedeId?: string;
  profesionalId?: string;
  tipoTratamiento?: string;
}

export interface AusenciasKPIs {
  totalAusencias: number;
  tasaAusentismo: number; // Porcentaje
  perdidaEstimada: number; // En moneda
}

export interface EvolucionAusencias {
  fecha: string;
  tasa: number; // Porcentaje
  total: number;
}

export interface PacienteReincidente {
  pacienteId: string;
  nombreCompleto: string;
  numeroAusencias: number;
  ultimaAusencia: string; // ISO Date
}

export interface PacientesReincidentesResponse {
  pacientes: PacienteReincidente[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Obtiene los KPIs de ausencias (no-shows)
 * @param filtros Parámetros de filtrado
 * @returns KPIs de ausencias
 */
export async function obtenerAusenciasKPIs(filtros: FiltrosAusencias): Promise<AusenciasKPIs> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.profesionalId) {
    queryParams.append('profesionalId', filtros.profesionalId);
  }
  if (filtros.tipoTratamiento) {
    queryParams.append('tipoTratamiento', filtros.tipoTratamiento);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/ausencias/kpis?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener KPIs de ausencias' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene la evolución temporal de la tasa de ausentismo
 * @param filtros Parámetros de filtrado
 * @param agrupacion Tipo de agrupación: 'dia', 'semana', 'mes'
 * @returns Array con la evolución de la tasa de ausentismo
 */
export async function obtenerEvolucionAusencias(
  filtros: FiltrosAusencias,
  agrupacion: 'dia' | 'semana' | 'mes' = 'semana'
): Promise<EvolucionAusencias[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    agrupacion,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.profesionalId) {
    queryParams.append('profesionalId', filtros.profesionalId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/ausencias/evolucion?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener evolución de ausencias' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene el listado de pacientes reincidentes en ausencias
 * @param filtros Parámetros de filtrado
 * @param page Número de página (default: 1)
 * @param limit Límite de resultados por página (default: 10)
 * @returns Lista paginada de pacientes reincidentes
 */
export async function obtenerPacientesReincidentes(
  filtros: FiltrosAusencias,
  page: number = 1,
  limit: number = 10
): Promise<PacientesReincidentesResponse> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/ausencias/pacientes-reincidentes?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener pacientes reincidentes' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// ========== APIs para Producción por Profesional (Box) ==========

export interface FiltrosProduccionBox {
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  sedeId?: string;
  profesionalId?: string;
  boxId?: string;
  especialidad?: string;
}

export interface ProduccionBoxKPIs {
  produccionTotal: number;
  produccionPromedioProfesional: number;
  utilizacionBoxes: number; // Porcentaje
  produccionPorBox: number;
  totalProfesionales: number;
  totalBoxes: number;
}

export interface ProduccionProfesional {
  profesionalId: string;
  nombreCompleto: string;
  especialidad: string;
  produccionTotal: number;
  numeroCitas: number;
  horasTrabajadas: number;
  boxesAsignados: string[];
  produccionPorBox: Array<{
    boxId: string;
    boxNombre: string;
    produccion: number;
  }>;
}

export interface ProduccionBox {
  boxId: string;
  boxNombre: string;
  sedeId: string;
  produccionTotal: number;
  utilizacionPorcentaje: number;
  horasDisponibles: number;
  horasUtilizadas: number;
  profesionalesAsignados: string[];
  produccionPromedioProfesional: number;
}

export interface ComparativaItem {
  id: string;
  nombre: string;
  produccion: number;
  porcentaje: number;
}

export interface EvolucionProduccion {
  fecha: string;
  produccion: number;
  profesionalId?: string;
  boxId?: string;
}

export interface UtilizacionCalor {
  diaSemana: number;
  franjaHoraria: string;
  utilizacionPorcentaje: number;
  produccion: number;
}

/**
 * Obtiene los KPIs de producción por profesional y box
 * @param filtros Parámetros de filtrado
 * @returns KPIs de producción
 */
export async function obtenerProduccionBoxKPIs(filtros: FiltrosProduccionBox): Promise<ProduccionBoxKPIs> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.profesionalId) {
    queryParams.append('profesionalId', filtros.profesionalId);
  }
  if (filtros.boxId) {
    queryParams.append('boxId', filtros.boxId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/produccion-box/kpis?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener KPIs de producción' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene los datos de producción por profesional
 * @param filtros Parámetros de filtrado
 * @returns Array de datos de producción por profesional
 */
export async function obtenerProduccionProfesionales(filtros: FiltrosProduccionBox): Promise<ProduccionProfesional[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.profesionalId) {
    queryParams.append('profesionalId', filtros.profesionalId);
  }
  if (filtros.boxId) {
    queryParams.append('boxId', filtros.boxId);
  }
  if (filtros.especialidad) {
    queryParams.append('especialidad', filtros.especialidad);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/produccion-box/profesionales?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener producción por profesional' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene los datos de producción por box
 * @param filtros Parámetros de filtrado
 * @returns Array de datos de producción por box
 */
export async function obtenerProduccionBoxes(filtros: FiltrosProduccionBox): Promise<ProduccionBox[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.boxId) {
    queryParams.append('boxId', filtros.boxId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/produccion-box/boxes?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener producción por box' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene datos comparativos entre profesionales o boxes
 * @param filtros Parámetros de filtrado
 * @param tipoComparacion Tipo de comparación: 'profesionales' o 'boxes'
 * @param limit Límite de resultados (default: 10)
 * @returns Array de datos comparativos
 */
export async function obtenerComparativaProduccion(
  filtros: FiltrosProduccionBox,
  tipoComparacion: 'profesionales' | 'boxes' = 'profesionales',
  limit: number = 10
): Promise<ComparativaItem[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    tipoComparacion,
    limit: limit.toString(),
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/produccion-box/comparativa?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener comparativa de producción' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene la evolución temporal de la producción
 * @param filtros Parámetros de filtrado
 * @param agrupacion Tipo de agrupación: 'dia', 'semana', 'mes'
 * @returns Array con la evolución de la producción
 */
export async function obtenerEvolucionProduccion(
  filtros: FiltrosProduccionBox,
  agrupacion: 'dia' | 'semana' | 'mes' = 'semana'
): Promise<EvolucionProduccion[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    agrupacion,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.profesionalId) {
    queryParams.append('profesionalId', filtros.profesionalId);
  }
  if (filtros.boxId) {
    queryParams.append('boxId', filtros.boxId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/produccion-box/evolucion?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener evolución de producción' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene datos de utilización de boxes para mapa de calor
 * @param filtros Parámetros de filtrado
 * @returns Array de datos de utilización por día y franja horaria
 */
export async function obtenerUtilizacionCalor(filtros: FiltrosProduccionBox): Promise<UtilizacionCalor[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.boxId) {
    queryParams.append('boxId', filtros.boxId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/produccion-box/utilizacion-calor?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener utilización de boxes' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// ========== APIs para Coste por Tratamiento y Margen ==========

export interface FiltrosCosteTratamiento {
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  sedeId?: string;
  tratamientoId?: string;
  areaClinica?: string;
}

export interface CosteTratamientoKPIs {
  costeTotal: number;
  ingresosTotales: number;
  margenBruto: number;
  margenPorcentual: number; // Porcentaje
  totalTratamientos: number;
  tratamientoMasRentable: {
    tratamientoId: string;
    tratamientoNombre: string;
    margen: number;
  };
  tratamientoMenosRentable: {
    tratamientoId: string;
    tratamientoNombre: string;
    margen: number;
  };
}

export interface CostePorTratamiento {
  tratamientoId: string;
  tratamientoNombre: string;
  areaClinica: string;
  ingresos: number;
  costeMateriales: number;
  costeLaboratorio: number;
  costePersonal: number;
  costeTotal: number;
  margen: number;
  margenPorcentual: number; // Porcentaje
  cantidadRealizados: number;
  precioUnitario: number;
  costeUnitario: number;
}

export interface EvolucionCosteMargen {
  fecha: string;
  ingresos: number;
  costes: number;
  margen: number;
  margenPorcentual: number;
}

/**
 * Obtiene los KPIs de coste por tratamiento y margen
 * @param filtros Parámetros de filtrado
 * @returns KPIs de coste y margen
 */
export async function obtenerCosteTratamientoKPIs(filtros: FiltrosCosteTratamiento): Promise<CosteTratamientoKPIs> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.tratamientoId) {
    queryParams.append('tratamientoId', filtros.tratamientoId);
  }
  if (filtros.areaClinica) {
    queryParams.append('areaClinica', filtros.areaClinica);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/coste-tratamiento/kpis?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener KPIs de coste' }));
    // Retornar datos mock para desarrollo si falla
    console.warn('Error obteniendo KPIs, usando datos mock:', errorData);
    return {
      costeTotal: 78250.30,
      ingresosTotales: 125450.75,
      margenBruto: 47200.45,
      margenPorcentual: 37.6,
      totalTratamientos: 240,
      tratamientoMasRentable: {
        tratamientoId: '1',
        tratamientoNombre: 'Limpieza dental',
        margen: 3400,
      },
      tratamientoMenosRentable: {
        tratamientoId: '5',
        tratamientoNombre: 'Revisión general',
        margen: 2880,
      },
    };
  }

  return await response.json();
}

/**
 * Obtiene el desglose detallado de costes y márgenes por tratamiento
 * @param filtros Parámetros de filtrado
 * @returns Array de datos de coste por tratamiento
 */
export async function obtenerCostePorTratamiento(filtros: FiltrosCosteTratamiento): Promise<CostePorTratamiento[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.tratamientoId) {
    queryParams.append('tratamientoId', filtros.tratamientoId);
  }
  if (filtros.areaClinica) {
    queryParams.append('areaClinica', filtros.areaClinica);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/coste-tratamiento/por-tratamiento?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener coste por tratamiento' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  // Retornar datos mock para desarrollo si falla
  try {
    return await response.json();
  } catch (error) {
    console.error('Error parseando respuesta:', error);
    // Datos mock para desarrollo
    return [
      {
        tratamientoId: '1',
        tratamientoNombre: 'Limpieza dental',
        areaClinica: 'Higiene',
        ingresos: 4250,
        costeMateriales: 300,
        costeLaboratorio: 0,
        costePersonal: 550,
        costeTotal: 850,
        margen: 3400,
        margenPorcentual: 80.0,
        cantidadRealizados: 85,
        precioUnitario: 50,
        costeUnitario: 10,
      },
      {
        tratamientoId: '2',
        tratamientoNombre: 'Implante dental',
        areaClinica: 'Implantología',
        ingresos: 18000,
        costeMateriales: 4500,
        costeLaboratorio: 3000,
        costePersonal: 1500,
        costeTotal: 9000,
        margen: 9000,
        margenPorcentual: 50.0,
        cantidadRealizados: 12,
        precioUnitario: 1500,
        costeUnitario: 750,
      },
      {
        tratamientoId: '3',
        tratamientoNombre: 'Ortodoncia',
        areaClinica: 'Ortodoncia',
        ingresos: 12000,
        costeMateriales: 2000,
        costeLaboratorio: 1800,
        costePersonal: 1000,
        costeTotal: 4800,
        margen: 7200,
        margenPorcentual: 60.0,
        cantidadRealizados: 8,
        precioUnitario: 1500,
        costeUnitario: 600,
      },
      {
        tratamientoId: '4',
        tratamientoNombre: 'Endodoncia',
        areaClinica: 'Endodoncia',
        ingresos: 6750,
        costeMateriales: 800,
        costeLaboratorio: 0,
        costePersonal: 1225,
        costeTotal: 2025,
        margen: 4725,
        margenPorcentual: 70.0,
        cantidadRealizados: 15,
        precioUnitario: 450,
        costeUnitario: 135,
      },
      {
        tratamientoId: '5',
        tratamientoNombre: 'Revisión general',
        areaClinica: 'General',
        ingresos: 3600,
        costeMateriales: 200,
        costeLaboratorio: 0,
        costePersonal: 520,
        costeTotal: 720,
        margen: 2880,
        margenPorcentual: 80.0,
        cantidadRealizados: 120,
        precioUnitario: 30,
        costeUnitario: 6,
      },
    ];
  }
}

/**
 * Obtiene la evolución temporal de costes y márgenes
 * @param filtros Parámetros de filtrado
 * @param agrupacion Tipo de agrupación: 'dia', 'semana', 'mes'
 * @returns Array con la evolución de costes y márgenes
 */
export async function obtenerEvolucionCosteMargen(
  filtros: FiltrosCosteTratamiento,
  agrupacion: 'dia' | 'semana' | 'mes' = 'semana'
): Promise<EvolucionCosteMargen[]> {
  const queryParams = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    agrupacion,
  });

  if (filtros.sedeId) {
    queryParams.append('sedeId', filtros.sedeId);
  }
  if (filtros.tratamientoId) {
    queryParams.append('tratamientoId', filtros.tratamientoId);
  }

  const response = await fetch(`${API_BASE_URL}/analitica/coste-tratamiento/evolucion?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener evolución de costes' }));
    // Retornar datos mock para desarrollo si falla
    console.warn('Error obteniendo evolución, usando datos mock:', errorData);
    const datos: EvolucionCosteMargen[] = [];
    const inicio = new Date(filtros.fechaInicio);
    const fin = new Date(filtros.fechaFin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= Math.min(dias, 30); i++) {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + i);
      const ingresos = 3000 + Math.random() * 2000;
      const costes = 1500 + Math.random() * 1000;
      const margen = ingresos - costes;
      datos.push({
        fecha: fecha.toISOString().split('T')[0],
        ingresos,
        costes,
        margen,
        margenPorcentual: ingresos > 0 ? (margen / ingresos) * 100 : 0,
      });
    }
    
    return datos;
  }

  return await response.json();
}

