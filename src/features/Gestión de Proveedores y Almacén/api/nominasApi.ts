// API para gestión de nóminas y salarios
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces
export interface DesgloseComision {
  tratamientoId: string;
  paciente: string;
  montoTratamiento: number;
  porcentajeComision: number;
  montoComision: number;
}

export interface DesgloseDeduccion {
  concepto: string;
  monto: number;
}

export interface Nomina {
  _id?: string;
  empleadoId: string;
  empleadoNombre?: string;
  periodo: {
    mes: number;
    anio: number;
  };
  fechaCalculo: string;
  salarioBase: number;
  totalComisiones: number;
  totalPercepciones: number;
  totalDeducciones: number;
  netoAPagar: number;
  estado: 'Calculada' | 'Aprobada' | 'Pagada';
  desgloseComisiones?: DesgloseComision[];
  desgloseDeducciones?: DesgloseDeduccion[];
}

export interface FiltrosNominas {
  mes?: number;
  anio?: number;
  empleadoId?: string;
  estado?: 'Calculada' | 'Aprobada' | 'Pagada';
  page?: number;
  limit?: number;
}

export interface RespuestaNominas {
  nominas: Nomina[];
  totalPaginas: number;
  paginaActual: number;
  totalResultados: number;
}

export interface RespuestaCalcularNomina {
  jobId: string;
  status: 'iniciado';
}

export interface ConfiguracionSalarial {
  tipoContrato: 'Fijo' | 'Comision' | 'Mixto';
  salarioBase: number;
  porcentajeComision?: number;
  cuentaBancaria?: string;
  rfc?: string;
  configuracionFiscal?: {
    retenciones?: number;
    seguroSocial?: number;
    otros?: Record<string, number>;
  };
}

// Función auxiliar para hacer peticiones
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Calcula las nóminas para un período específico
 */
export async function calcularNominasPeriodo(
  mes: number,
  anio: number
): Promise<RespuestaCalcularNomina> {
  try {
    return await fetchAPI('/nominas/calcular', {
      method: 'POST',
      body: JSON.stringify({ mes, anio }),
    });
  } catch (error) {
    console.error('Error al calcular nóminas:', error);
    // Datos mock para desarrollo
    return {
      jobId: `job_${Date.now()}`,
      status: 'iniciado' as const,
    };
  }
}

/**
 * Obtiene una lista paginada de nóminas
 */
export async function obtenerNominas(filtros: FiltrosNominas = {}): Promise<RespuestaNominas> {
  try {
    const params = new URLSearchParams();
    if (filtros.mes) params.append('mes', filtros.mes.toString());
    if (filtros.anio) params.append('anio', filtros.anio.toString());
    if (filtros.empleadoId) params.append('empleadoId', filtros.empleadoId);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());

    const queryString = params.toString();
    return await fetchAPI(`/nominas?${queryString}`);
  } catch (error) {
    console.error('Error al obtener nóminas:', error);
    // Datos mock para desarrollo
    const nominasMock: Nomina[] = [
      {
        _id: '1',
        empleadoId: 'emp1',
        empleadoNombre: 'Dr. Juan Pérez',
        periodo: { mes: 7, anio: 2024 },
        fechaCalculo: '2024-07-31T10:00:00Z',
        salarioBase: 5000,
        totalComisiones: 2500,
        totalPercepciones: 7500,
        totalDeducciones: 1500,
        netoAPagar: 6000,
        estado: 'Calculada',
        desgloseComisiones: [
          {
            tratamientoId: 'trat1',
            paciente: 'María García',
            montoTratamiento: 1000,
            porcentajeComision: 25,
            montoComision: 250,
          },
        ],
        desgloseDeducciones: [
          { concepto: 'Impuestos', monto: 1000 },
          { concepto: 'Seguridad Social', monto: 500 },
        ],
      },
    ];

    return {
      nominas: nominasMock,
      totalPaginas: 1,
      paginaActual: filtros.page || 1,
      totalResultados: nominasMock.length,
    };
  }
}

/**
 * Obtiene el detalle completo de una nómina
 */
export async function obtenerNominaPorId(nominaId: string): Promise<Nomina> {
  try {
    return await fetchAPI(`/nominas/${nominaId}`);
  } catch (error) {
    console.error('Error al obtener nómina:', error);
    // Datos mock para desarrollo
    return {
      _id: nominaId,
      empleadoId: 'emp1',
      empleadoNombre: 'Dr. Juan Pérez',
      periodo: { mes: 7, anio: 2024 },
      fechaCalculo: '2024-07-31T10:00:00Z',
      salarioBase: 5000,
      totalComisiones: 2500,
      totalPercepciones: 7500,
      totalDeducciones: 1500,
      netoAPagar: 6000,
      estado: 'Calculada',
      desgloseComisiones: [
        {
          tratamientoId: 'trat1',
          paciente: 'María García',
          montoTratamiento: 1000,
          porcentajeComision: 25,
          montoComision: 250,
        },
      ],
      desgloseDeducciones: [
        { concepto: 'Impuestos', monto: 1000 },
        { concepto: 'Seguridad Social', monto: 500 },
      ],
    };
  }
}

/**
 * Actualiza el estado de una nómina
 */
export async function actualizarEstadoNomina(
  nominaId: string,
  estado: 'Calculada' | 'Aprobada' | 'Pagada'
): Promise<Nomina> {
  try {
    return await fetchAPI(`/nominas/${nominaId}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  } catch (error) {
    console.error('Error al actualizar estado de nómina:', error);
    throw error;
  }
}

/**
 * Obtiene la configuración salarial de un empleado
 */
export async function obtenerConfiguracionSalarial(
  empleadoId: string
): Promise<ConfiguracionSalarial> {
  try {
    return await fetchAPI(`/empleados/${empleadoId}/configuracion-salarial`);
  } catch (error) {
    console.error('Error al obtener configuración salarial:', error);
    // Datos mock para desarrollo
    return {
      tipoContrato: 'Mixto',
      salarioBase: 5000,
      porcentajeComision: 25,
      cuentaBancaria: 'ES12 3456 7890 1234 5678 9012',
      rfc: 'PEPJ123456789',
      configuracionFiscal: {
        retenciones: 20,
        seguroSocial: 10,
      },
    };
  }
}

/**
 * Crea o actualiza la configuración salarial de un empleado
 */
export async function actualizarConfiguracionSalarial(
  empleadoId: string,
  configuracion: ConfiguracionSalarial
): Promise<ConfiguracionSalarial> {
  try {
    return await fetchAPI(`/empleados/${empleadoId}/configuracion-salarial`, {
      method: 'PUT',
      body: JSON.stringify(configuracion),
    });
  } catch (error) {
    console.error('Error al actualizar configuración salarial:', error);
    throw error;
  }
}


