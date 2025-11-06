// API para obtener indicadores de calidad del módulo Calidad y Auditoría

export interface IndicadorCalidad {
  id: string;
  nombre: string;
  valor: number;
  unidad: string; // '%', '€', '#'
  meta: number;
  valorPeriodoAnterior?: number;
  tendencia: 'positiva' | 'negativa' | 'neutral';
  descripcion?: string;
}

export interface IndicadoresResponse {
  indicadores: IndicadorCalidad[];
}

export interface FiltrosIndicadores {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  sedeId?: string;
}

export interface PuntoHistorico {
  fecha: string; // YYYY-MM-DD
  valor: number;
}

export interface ConfiguracionIndicador {
  id: string;
  nombre: string;
  descripcion: string;
  unidadMedida: string;
  formulaCalculo: string;
  meta: number;
  umbrales?: {
    bajo: number;
    medio: number;
  };
  fuenteDatos: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Obtiene los valores agregados de todos los KPIs configurados para el dashboard principal
 */
export async function obtenerIndicadores(
  filtros: FiltrosIndicadores
): Promise<IndicadoresResponse> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });

    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(`${API_BASE_URL}/calidad/indicadores?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener indicadores: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerIndicadores:', error);
    throw error;
  }
}

/**
 * Obtiene los datos históricos de un indicador específico para renderizar un gráfico de tendencia
 */
export async function obtenerHistoricoIndicador(
  indicadorId: string,
  filtros: FiltrosIndicadores & { agrupacion: 'diaria' | 'semanal' | 'mensual' }
): Promise<PuntoHistorico[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      agrupacion: filtros.agrupacion,
    });

    if (filtros.sedeId) {
      params.append('sedeId', filtros.sedeId);
    }

    const response = await fetch(
      `${API_BASE_URL}/calidad/indicadores/${indicadorId}/historico?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener histórico: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerHistoricoIndicador:', error);
    throw error;
  }
}

/**
 * Devuelve la lista de todos los indicadores disponibles que el usuario puede visualizar,
 * junto con su configuración (metas, umbrales)
 */
export async function obtenerConfiguracionIndicadores(): Promise<ConfiguracionIndicador[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/calidad/configuracion/indicadores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener configuración: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerConfiguracionIndicadores:', error);
    throw error;
  }
}


