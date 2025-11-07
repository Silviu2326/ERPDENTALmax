// API para Rentabilidad y Análisis del módulo Cuadro de Mandos e Informes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface RentabilidadKPIs {
  ingresosTotales: number;
  costosTotales: number;
  margenBruto: number;
  ebitda: number;
  numeroPacientesNuevos: number;
  ticketPromedio: number;
}

export interface RentabilidadPorTratamiento {
  tratamientoNombre: string;
  tratamientoId: string;
  ingresos: number;
  costosDirectos: number;
  margen: number;
  cantidadRealizados: number;
}

export interface RentabilidadPorProfesional {
  profesionalNombre: string;
  profesionalId: string;
  facturacionTotal: number;
  horasTrabajadas: number;
  facturacionPorHora: number;
}

export interface EvolucionFinanciera {
  periodo: string;
  ingresos: number;
  costos: number;
}

export interface RentabilidadFilters {
  fechaInicio: string; // Formato YYYY-MM-DD
  fechaFin: string; // Formato YYYY-MM-DD
  sedeId?: string; // Opcional
  groupBy?: 'day' | 'week' | 'month'; // Para evolución
}

/**
 * Obtiene los principales Key Performance Indicators (KPIs) financieros
 * para un período y sede determinados.
 */
export async function obtenerKPIsRentabilidad(
  filtros: RentabilidadFilters
): Promise<RentabilidadKPIs> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });
    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(`${API_BASE_URL}/analisis/rentabilidad/kpis?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener KPIs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerKPIsRentabilidad:', error);
    // Retornar datos mock para desarrollo
    return {
      ingresosTotales: 125450.75,
      costosTotales: 78250.30,
      margenBruto: 47200.45,
      ebitda: 38500.20,
      numeroPacientesNuevos: 42,
      ticketPromedio: 2986.92,
    };
  }
}

/**
 * Devuelve un desglose de la rentabilidad por cada tipo de tratamiento.
 */
export async function obtenerRentabilidadPorTratamiento(
  filtros: RentabilidadFilters
): Promise<RentabilidadPorTratamiento[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });
    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(
      `${API_BASE_URL}/analisis/rentabilidad/por-tratamiento?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Error al obtener rentabilidad por tratamiento: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerRentabilidadPorTratamiento:', error);
    // Retornar datos mock para desarrollo
    return [
      {
        tratamientoNombre: 'Limpieza dental',
        tratamientoId: '1',
        ingresos: 4250,
        costosDirectos: 850,
        margen: 3400,
        cantidadRealizados: 85,
      },
      {
        tratamientoNombre: 'Implante dental',
        tratamientoId: '2',
        ingresos: 18000,
        costosDirectos: 9000,
        margen: 9000,
        cantidadRealizados: 12,
      },
      {
        tratamientoNombre: 'Ortodoncia',
        tratamientoId: '3',
        ingresos: 12000,
        costosDirectos: 4800,
        margen: 7200,
        cantidadRealizados: 8,
      },
      {
        tratamientoNombre: 'Endodoncia',
        tratamientoId: '4',
        ingresos: 6750,
        costosDirectos: 2025,
        margen: 4725,
        cantidadRealizados: 15,
      },
      {
        tratamientoNombre: 'Revisión general',
        tratamientoId: '5',
        ingresos: 3600,
        costosDirectos: 720,
        margen: 2880,
        cantidadRealizados: 120,
      },
    ];
  }
}

/**
 * Analiza la facturación y rentabilidad generada por cada profesional.
 */
export async function obtenerRentabilidadPorProfesional(
  filtros: RentabilidadFilters
): Promise<RentabilidadPorProfesional[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });
    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(
      `${API_BASE_URL}/analisis/rentabilidad/por-profesional?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Error al obtener rentabilidad por profesional: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerRentabilidadPorProfesional:', error);
    // Retornar datos mock para desarrollo
    return [
      {
        profesionalNombre: 'Juan Pérez',
        profesionalId: '1',
        facturacionTotal: 45200,
        horasTrabajadas: 160,
        facturacionPorHora: 282.5,
      },
      {
        profesionalNombre: 'María García',
        profesionalId: '2',
        facturacionTotal: 38900,
        horasTrabajadas: 140,
        facturacionPorHora: 277.86,
      },
      {
        profesionalNombre: 'Carlos López',
        profesionalId: '3',
        facturacionTotal: 41350,
        horasTrabajadas: 150,
        facturacionPorHora: 275.67,
      },
    ];
  }
}

/**
 * Proporciona datos para un gráfico de evolución de ingresos vs costos
 * a lo largo del tiempo.
 */
export async function obtenerEvolucionFinanciera(
  filtros: RentabilidadFilters
): Promise<EvolucionFinanciera[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      groupBy: filtros.groupBy || 'day',
    });
    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(
      `${API_BASE_URL}/analisis/rentabilidad/evolucion?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Error al obtener evolución financiera: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerEvolucionFinanciera:', error);
    // Retornar datos mock para desarrollo
    const datos: EvolucionFinanciera[] = [];
    const inicio = new Date(filtros.fechaInicio);
    const fin = new Date(filtros.fechaFin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= Math.min(dias, 30); i++) {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + i);
      datos.push({
        periodo: fecha.toISOString().split('T')[0],
        ingresos: 3000 + Math.random() * 2000,
        costos: 1500 + Math.random() * 1000,
      });
    }
    
    return datos;
  }
}



