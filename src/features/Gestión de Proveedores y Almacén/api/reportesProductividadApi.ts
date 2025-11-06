// API para reportes de productividad por profesional
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ProductividadProfesional {
  profesionalId: string;
  nombreCompleto: string;
  ingresosTotales: number;
  numeroTratamientos: number;
  horasSillon: number;
  costeMateriales: number;
  rentabilidad: number; // ingresosTotales - costeMateriales
  productividadPorHora: number; // ingresosTotales / horasSillon
}

export interface FiltrosProductividad {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  profesionalId?: string;
  sedeId?: string;
}

export interface ResumenKPIs {
  totalIngresos: number;
  totalTratamientos: number;
  totalHoras: number;
  totalCosteMateriales: number;
  rentabilidadTotal: number;
  promedioProductividadPorHora: number;
  numeroProfesionales: number;
}

/**
 * Obtiene los datos agregados de productividad por profesional para un período y filtros determinados
 */
export async function obtenerProductividadProfesional(
  filtros: FiltrosProductividad
): Promise<ProductividadProfesional[]> {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.profesionalId) {
    params.append('profesionalId', filtros.profesionalId);
  }
  if (filtros.sedeId) {
    params.append('sedeId', filtros.sedeId);
  }

  const response = await fetch(
    `${API_BASE_URL}/reportes/productividad/profesional?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener los datos de productividad');
  }

  return response.json();
}

/**
 * Calcula los KPIs resumen a partir de los datos de productividad
 */
export function calcularResumenKPIs(
  datos: ProductividadProfesional[]
): ResumenKPIs {
  if (datos.length === 0) {
    return {
      totalIngresos: 0,
      totalTratamientos: 0,
      totalHoras: 0,
      totalCosteMateriales: 0,
      rentabilidadTotal: 0,
      promedioProductividadPorHora: 0,
      numeroProfesionales: 0,
    };
  }

  const totalIngresos = datos.reduce((sum, p) => sum + p.ingresosTotales, 0);
  const totalTratamientos = datos.reduce((sum, p) => sum + p.numeroTratamientos, 0);
  const totalHoras = datos.reduce((sum, p) => sum + p.horasSillon, 0);
  const totalCosteMateriales = datos.reduce((sum, p) => sum + p.costeMateriales, 0);
  const rentabilidadTotal = totalIngresos - totalCosteMateriales;
  const promedioProductividadPorHora = totalHoras > 0 ? totalIngresos / totalHoras : 0;

  return {
    totalIngresos,
    totalTratamientos,
    totalHoras,
    totalCosteMateriales,
    rentabilidadTotal,
    promedioProductividadPorHora,
    numeroProfesionales: datos.length,
  };
}


