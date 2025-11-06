// API para obtener indicadores de citas del módulo Cuadro de Mandos e Informes

export interface IndicadoresResumen {
  totalCitas: number;
  tasaOcupacion: number; // Porcentaje
  tasaNoShow: number; // Porcentaje
  tasaConfirmadas: number; // Porcentaje
}

export interface CitasPorOrigen {
  origen: 'web' | 'telefono' | 'presencial' | 'referido';
  cantidad: number;
}

export interface CitasPorTipo {
  tipo: string;
  cantidad: number;
}

export interface EvolucionOcupacion {
  fecha: string; // ISO 8601
  tasaOcupacion: number; // Porcentaje
}

export interface FiltrosIndicadores {
  fechaInicio: string; // ISO 8601
  fechaFin: string; // ISO 8601
  sedeId?: string;
  profesionalId?: string;
  intervalo?: 'diario' | 'semanal' | 'mensual';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Obtiene las tarjetas de resumen principales: total de citas, tasa de ocupación,
 * tasa de 'no-show' y porcentaje de citas confirmadas.
 */
export async function obtenerResumenCitas(
  filtros: FiltrosIndicadores
): Promise<IndicadoresResumen> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });

    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(`${API_BASE_URL}/indicadores/citas/resumen?${params}`);

    if (!response.ok) {
      throw new Error(`Error al obtener resumen de citas: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerResumenCitas:', error);
    // Retornar datos mock para desarrollo
    return {
      totalCitas: 287,
      tasaOcupacion: 85.5,
      tasaNoShow: 12.3,
      tasaConfirmadas: 87.5,
    };
  }
}

/**
 * Devuelve la distribución de citas según su canal de origen para alimentar un gráfico de tarta.
 */
export async function obtenerCitasPorOrigen(
  filtros: FiltrosIndicadores
): Promise<CitasPorOrigen[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });

    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(`${API_BASE_URL}/indicadores/citas/por-origen?${params}`);

    if (!response.ok) {
      throw new Error(`Error al obtener citas por origen: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerCitasPorOrigen:', error);
    // Retornar datos mock para desarrollo
    return [
      { origen: 'web', cantidad: 150 },
      { origen: 'telefono', cantidad: 200 },
      { origen: 'presencial', cantidad: 85 },
      { origen: 'referido', cantidad: 52 },
    ];
  }
}

/**
 * Devuelve la distribución de citas según el tipo de cita (primera visita, revisión, etc.).
 */
export async function obtenerCitasPorTipo(
  filtros: FiltrosIndicadores
): Promise<CitasPorTipo[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });

    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(`${API_BASE_URL}/indicadores/citas/por-tipo?${params}`);

    if (!response.ok) {
      throw new Error(`Error al obtener citas por tipo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerCitasPorTipo:', error);
    // Retornar datos mock para desarrollo
    return [
      { tipo: 'Primera Visita', cantidad: 120 },
      { tipo: 'Revisión', cantidad: 300 },
      { tipo: 'Tratamiento Específico', cantidad: 67 },
    ];
  }
}

/**
 * Proporciona datos de series temporales sobre la tasa de ocupación para un gráfico de líneas.
 */
export async function obtenerEvolucionOcupacion(
  filtros: FiltrosIndicadores
): Promise<EvolucionOcupacion[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      intervalo: filtros.intervalo || 'diario',
    });

    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(
      `${API_BASE_URL}/indicadores/citas/evolucion-ocupacion?${params}`
    );

    if (!response.ok) {
      throw new Error(`Error al obtener evolución de ocupación: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerEvolucionOcupacion:', error);
    // Retornar datos mock para desarrollo
    const datos: EvolucionOcupacion[] = [];
    const fechaInicio = new Date(filtros.fechaInicio);
    const fechaFin = new Date(filtros.fechaFin);
    const intervalo = filtros.intervalo || 'diario';

    let fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      datos.push({
        fecha: fechaActual.toISOString(),
        tasaOcupacion: Math.random() * 30 + 70, // Entre 70 y 100
      });

      if (intervalo === 'diario') {
        fechaActual.setDate(fechaActual.getDate() + 1);
      } else if (intervalo === 'semanal') {
        fechaActual.setDate(fechaActual.getDate() + 7);
      } else {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
      }
    }

    return datos;
  }
}


