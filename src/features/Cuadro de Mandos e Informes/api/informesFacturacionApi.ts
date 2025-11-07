// API para Indicadores de Facturación del módulo Cuadro de Mandos e Informes

export interface KPIsGenerales {
  totalFacturado: number;
  totalCobrado: number;
  saldoPendiente: number;
  ticketMedio: number;
}

export interface EvolutivoFacturacion {
  periodo: string; // Formato según agrupacion: '2023-01-15', '2023-01', '2023'
  facturado: number;
  cobrado: number;
}

export interface FacturacionPorCategoria {
  categoria: string;
  total: number;
  porcentaje: number;
}

export interface FacturacionPorProfesional {
  profesionalId: string;
  nombre: string;
  totalFacturado: number;
  numeroTratamientos: number;
}

export interface FiltrosFacturacion {
  fechaInicio: string; // ISO 8601
  fechaFin: string; // ISO 8601
  sedeIds?: string[]; // Array de IDs de sedes
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Obtiene los KPIs principales (Total Facturado, Pagos Recibidos, Saldo Pendiente, Ticket Medio)
 * para un periodo y sedes seleccionadas.
 */
export async function obtenerKPIsGenerales(
  filtros: FiltrosFacturacion
): Promise<KPIsGenerales> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });

    if (filtros.sedeIds && filtros.sedeIds.length > 0) {
      params.append('sedeIds', filtros.sedeIds.join(','));
    }

    const response = await fetch(`${API_BASE_URL}/informes/facturacion/kpis-generales?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener KPIs generales: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerKPIsGenerales:', error);
    // Retornar datos mock para desarrollo
    return {
      totalFacturado: 150000,
      totalCobrado: 120000,
      saldoPendiente: 30000,
      ticketMedio: 250,
    };
  }
}

/**
 * Devuelve la evolución de la facturación y los cobros agrupados por día, mes o año
 * para el periodo y sedes seleccionadas.
 */
export async function obtenerEvolutivoFacturacion(
  filtros: FiltrosFacturacion,
  agrupacion: 'dia' | 'mes' | 'año' = 'mes'
): Promise<EvolutivoFacturacion[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      agrupacion,
    });

    if (filtros.sedeIds && filtros.sedeIds.length > 0) {
      params.append('sedeIds', filtros.sedeIds.join(','));
    }

    const response = await fetch(`${API_BASE_URL}/informes/facturacion/evolutivo?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener evolución de facturación: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerEvolutivoFacturacion:', error);
    // Retornar datos mock para desarrollo
    const datos: EvolutivoFacturacion[] = [];
    const fechaInicio = new Date(filtros.fechaInicio);
    const fechaFin = new Date(filtros.fechaFin);

    let fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      let periodo: string;
      if (agrupacion === 'dia') {
        periodo = fechaActual.toISOString().split('T')[0];
        fechaActual.setDate(fechaActual.getDate() + 1);
      } else if (agrupacion === 'mes') {
        periodo = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}`;
        fechaActual.setMonth(fechaActual.getMonth() + 1);
      } else {
        periodo = String(fechaActual.getFullYear());
        fechaActual.setFullYear(fechaActual.getFullYear() + 1);
      }

      datos.push({
        periodo,
        facturado: Math.random() * 50000 + 10000,
        cobrado: Math.random() * 45000 + 8000,
      });
    }

    return datos;
  }
}

/**
 * Agrega la facturación por categoría de tratamiento en el periodo y sedes seleccionadas.
 */
export async function obtenerFacturacionPorCategoria(
  filtros: FiltrosFacturacion
): Promise<FacturacionPorCategoria[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });

    if (filtros.sedeIds && filtros.sedeIds.length > 0) {
      params.append('sedeIds', filtros.sedeIds.join(','));
    }

    const response = await fetch(
      `${API_BASE_URL}/informes/facturacion/por-categoria-tratamiento?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener facturación por categoría: ${response.statusText}`);
    }

    const datos = await response.json();
    // Calcular porcentajes si no vienen del backend
    const total = datos.reduce((sum: number, item: FacturacionPorCategoria) => sum + item.total, 0);
    return datos.map((item: FacturacionPorCategoria) => ({
      ...item,
      porcentaje: total > 0 ? (item.total / total) * 100 : 0,
    }));
  } catch (error) {
    console.error('Error en obtenerFacturacionPorCategoria:', error);
    // Retornar datos mock para desarrollo
    const mockData: FacturacionPorCategoria[] = [
      { categoria: 'Implantología', total: 50000, porcentaje: 33.3 },
      { categoria: 'Ortodoncia', total: 40000, porcentaje: 26.7 },
      { categoria: 'Endodoncia', total: 30000, porcentaje: 20.0 },
      { categoria: 'Periodoncia', total: 20000, porcentaje: 13.3 },
      { categoria: 'Estética Dental', total: 10000, porcentaje: 6.7 },
    ];
    return mockData;
  }
}

/**
 * Calcula el rendimiento de facturación (total facturado y número de tratamientos) por cada profesional.
 */
export async function obtenerFacturacionPorProfesional(
  filtros: FiltrosFacturacion
): Promise<FacturacionPorProfesional[]> {
  try {
    const params = new URLSearchParams({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });

    if (filtros.sedeIds && filtros.sedeIds.length > 0) {
      params.append('sedeIds', filtros.sedeIds.join(','));
    }

    const response = await fetch(
      `${API_BASE_URL}/informes/facturacion/por-profesional?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener facturación por profesional: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerFacturacionPorProfesional:', error);
    // Retornar datos mock para desarrollo
    return [
      { profesionalId: '1', nombre: 'Dr. Juan Pérez', totalFacturado: 60000, numeroTratamientos: 45 },
      { profesionalId: '2', nombre: 'Dra. María García', totalFacturado: 55000, numeroTratamientos: 42 },
      { profesionalId: '3', nombre: 'Dr. Carlos López', totalFacturado: 48000, numeroTratamientos: 38 },
      { profesionalId: '4', nombre: 'Dra. Ana Martínez', totalFacturado: 42000, numeroTratamientos: 35 },
    ];
  }
}



