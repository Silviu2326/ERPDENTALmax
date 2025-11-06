// API para Alertas Inteligentes KPI Thresholds
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface KPIThreshold {
  _id?: string;
  nombre: string;
  descripcion?: string;
  metrica: string; // 'ingresos', 'citas', 'pacientes-nuevos', 'tasa-ocupacion', 'tasa-cancelacion', etc.
  operador: 'mayor_que' | 'menor_que' | 'igual' | 'diferente' | 'entre';
  valorUmbral: number;
  valorUmbral2?: number; // Para operador 'entre'
  frecuenciaVerificacion: 'diaria' | 'semanal' | 'mensual' | 'tiempo_real';
  activa: boolean;
  notificaciones: {
    email: boolean;
    push: boolean;
    dashboard: boolean;
    usuariosNotificar?: string[]; // IDs de usuarios
  };
  sedeId?: string;
  profesionalId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlertaKPI {
  _id?: string;
  thresholdId: string;
  nombreThreshold: string;
  metrica: string;
  valorActual: number;
  valorUmbral: number;
  severidad: 'info' | 'advertencia' | 'critica';
  estado: 'activa' | 'revisada' | 'resuelta';
  fechaDeteccion: string;
  fechaResolucion?: string;
  mensaje: string;
  datosContexto?: Record<string, any>;
  sedeId?: string;
  profesionalId?: string;
}

export interface FiltrosAlertas {
  estado?: 'activa' | 'revisada' | 'resuelta';
  severidad?: 'info' | 'advertencia' | 'critica';
  metrica?: string;
  fechaInicio?: string;
  fechaFin?: string;
  sedeId?: string;
  profesionalId?: string;
}

export interface RespuestaAlertas {
  alertas: AlertaKPI[];
  total: number;
  resumen: {
    activas: number;
    revisadas: number;
    resueltas: number;
    porSeveridad: {
      info: number;
      advertencia: number;
      critica: number;
    };
  };
}

export interface RespuestaThresholds {
  thresholds: KPIThreshold[];
  total: number;
}

/**
 * Obtiene todos los thresholds de KPI configurados
 */
export async function obtenerThresholds(sedeId?: string): Promise<RespuestaThresholds> {
  try {
    const params = new URLSearchParams();
    if (sedeId) {
      params.append('sedeId', sedeId);
    }

    const response = await fetch(`${API_BASE_URL}/analitica/alertas/thresholds?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener thresholds: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerThresholds:', error);
    // Datos mock para desarrollo
    return {
      thresholds: [
        {
          _id: '1',
          nombre: 'Ingresos Mensuales Bajo Umbral',
          descripcion: 'Alerta cuando los ingresos mensuales están por debajo de 50,000€',
          metrica: 'ingresos',
          operador: 'menor_que',
          valorUmbral: 50000,
          frecuenciaVerificacion: 'mensual',
          activa: true,
          notificaciones: {
            email: true,
            push: true,
            dashboard: true,
          },
        },
        {
          _id: '2',
          nombre: 'Tasa de Cancelación Alta',
          descripcion: 'Alerta cuando la tasa de cancelación supera el 15%',
          metrica: 'tasa-cancelacion',
          operador: 'mayor_que',
          valorUmbral: 15,
          frecuenciaVerificacion: 'semanal',
          activa: true,
          notificaciones: {
            email: false,
            push: true,
            dashboard: true,
          },
        },
      ],
      total: 2,
    };
  }
}

/**
 * Crea un nuevo threshold de KPI
 */
export async function crearThreshold(threshold: Omit<KPIThreshold, '_id' | 'createdAt' | 'updatedAt'>): Promise<KPIThreshold> {
  try {
    const response = await fetch(`${API_BASE_URL}/analitica/alertas/thresholds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(threshold),
    });

    if (!response.ok) {
      throw new Error(`Error al crear threshold: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en crearThreshold:', error);
    throw error;
  }
}

/**
 * Actualiza un threshold existente
 */
export async function actualizarThreshold(
  thresholdId: string,
  threshold: Partial<KPIThreshold>
): Promise<KPIThreshold> {
  try {
    const response = await fetch(`${API_BASE_URL}/analitica/alertas/thresholds/${thresholdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(threshold),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar threshold: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en actualizarThreshold:', error);
    throw error;
  }
}

/**
 * Elimina un threshold
 */
export async function eliminarThreshold(thresholdId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/analitica/alertas/thresholds/${thresholdId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar threshold: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error en eliminarThreshold:', error);
    throw error;
  }
}

/**
 * Obtiene las alertas activas y resueltas según filtros
 */
export async function obtenerAlertas(filtros: FiltrosAlertas = {}): Promise<RespuestaAlertas> {
  try {
    const params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.severidad) params.append('severidad', filtros.severidad);
    if (filtros.metrica) params.append('metrica', filtros.metrica);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
    if (filtros.profesionalId) params.append('profesionalId', filtros.profesionalId);

    const response = await fetch(`${API_BASE_URL}/analitica/alertas?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener alertas: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerAlertas:', error);
    // Datos mock para desarrollo
    return {
      alertas: [
        {
          _id: '1',
          thresholdId: '1',
          nombreThreshold: 'Ingresos Mensuales Bajo Umbral',
          metrica: 'ingresos',
          valorActual: 45000,
          valorUmbral: 50000,
          severidad: 'advertencia',
          estado: 'activa',
          fechaDeteccion: new Date().toISOString(),
          mensaje: 'Los ingresos mensuales (45,000€) están por debajo del umbral establecido (50,000€)',
        },
        {
          _id: '2',
          thresholdId: '2',
          nombreThreshold: 'Tasa de Cancelación Alta',
          metrica: 'tasa-cancelacion',
          valorActual: 18.5,
          valorUmbral: 15,
          severidad: 'critica',
          estado: 'activa',
          fechaDeteccion: new Date(Date.now() - 86400000).toISOString(),
          mensaje: 'La tasa de cancelación (18.5%) supera el umbral crítico (15%)',
        },
      ],
      total: 2,
      resumen: {
        activas: 2,
        revisadas: 0,
        resueltas: 0,
        porSeveridad: {
          info: 0,
          advertencia: 1,
          critica: 1,
        },
      },
    };
  }
}

/**
 * Marca una alerta como revisada
 */
export async function marcarAlertaRevisada(alertaId: string): Promise<AlertaKPI> {
  try {
    const response = await fetch(`${API_BASE_URL}/analitica/alertas/${alertaId}/revisar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al marcar alerta como revisada: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en marcarAlertaRevisada:', error);
    throw error;
  }
}

/**
 * Marca una alerta como resuelta
 */
export async function marcarAlertaResuelta(alertaId: string, notas?: string): Promise<AlertaKPI> {
  try {
    const response = await fetch(`${API_BASE_URL}/analitica/alertas/${alertaId}/resolver`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ notas }),
    });

    if (!response.ok) {
      throw new Error(`Error al marcar alerta como resuelta: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en marcarAlertaResuelta:', error);
    throw error;
  }
}

/**
 * Obtiene las métricas disponibles para configurar thresholds
 */
export async function obtenerMetricasDisponibles(): Promise<Array<{ valor: string; etiqueta: string; descripcion: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/analitica/alertas/metricas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener métricas: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerMetricasDisponibles:', error);
    // Métricas mock
    return [
      { valor: 'ingresos', etiqueta: 'Ingresos Totales', descripcion: 'Ingresos totales en un período' },
      { valor: 'citas', etiqueta: 'Número de Citas', descripcion: 'Cantidad total de citas' },
      { valor: 'pacientes-nuevos', etiqueta: 'Pacientes Nuevos', descripcion: 'Número de pacientes nuevos' },
      { valor: 'tasa-ocupacion', etiqueta: 'Tasa de Ocupación', descripcion: 'Porcentaje de ocupación de sillones' },
      { valor: 'tasa-cancelacion', etiqueta: 'Tasa de Cancelación', descripcion: 'Porcentaje de citas canceladas' },
      { valor: 'ticket-promedio', etiqueta: 'Ticket Promedio', descripcion: 'Ingreso promedio por cita' },
      { valor: 'tasa-no-show', etiqueta: 'Tasa de No-Show', descripcion: 'Porcentaje de inasistencias' },
      { valor: 'tiempo-espera-promedio', etiqueta: 'Tiempo de Espera Promedio', descripcion: 'Tiempo promedio de espera de pacientes' },
    ];
  }
}


