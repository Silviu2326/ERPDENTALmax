// API para gestión de planes de tratamiento de ortodoncia
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface DiagnosticoOrtodoncico {
  claseEsqueletal: string;
  patronFacial: string;
  analisisDental: string;
  resumen: string;
}

export interface FaseTratamiento {
  nombre: string;
  descripcion: string;
  aparatologia: string;
  duracionEstimadaMeses: number;
  citasRequeridas: number;
}

export interface FotoEstudio {
  url: string;
  descripcion: string;
}

export interface RadiografiaEstudio {
  url: string;
  tipo: string;
}

export interface MedidaCefalometrica {
  medida: string;
  valor: string;
  norma: string;
}

export interface Estudios {
  fotos: FotoEstudio[];
  radiografias: RadiografiaEstudio[];
  cefalometria: MedidaCefalometrica[];
}

export interface PlanTratamientoOrtodoncia {
  _id?: string;
  paciente: string; // ObjectId del paciente
  odontologo: string; // ObjectId del odontólogo
  fechaCreacion?: string;
  estado: 'Propuesto' | 'Aceptado' | 'En Progreso' | 'Finalizado' | 'Rechazado';
  diagnostico: DiagnosticoOrtodoncico;
  objetivosTratamiento: string[];
  fases: FaseTratamiento[];
  estudios: Estudios;
  presupuestoId?: string; // ObjectId del presupuesto
  notas?: string;
}

export interface CrearPlanTratamientoRequest {
  pacienteId: string;
  odontologoId: string;
  diagnostico: DiagnosticoOrtodoncico;
  objetivos: string[];
  fases: FaseTratamiento[];
  estudios?: Estudios;
  presupuestoId?: string;
  notas?: string;
}

export interface ActualizarPlanTratamientoRequest {
  estado?: PlanTratamientoOrtodoncia['estado'];
  diagnostico?: DiagnosticoOrtodoncico;
  objetivos?: string[];
  fases?: FaseTratamiento[];
  estudios?: Estudios;
  presupuestoId?: string;
  notas?: string;
}

/**
 * Crea un nuevo plan de tratamiento de ortodoncia para un paciente
 */
export async function crearPlanTratamiento(
  datos: CrearPlanTratamientoRequest
): Promise<PlanTratamientoOrtodoncia> {
  try {
    const response = await fetch(`${API_BASE_URL}/ortodoncia/planes-tratamiento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        pacienteId: datos.pacienteId,
        odontologoId: datos.odontologoId,
        diagnostico: datos.diagnostico,
        objetivos: datos.objetivos,
        fases: datos.fases,
        estudios: datos.estudios || { fotos: [], radiografias: [], cefalometria: [] },
        presupuestoId: datos.presupuestoId,
        notas: datos.notas,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error al crear plan de tratamiento: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear plan de tratamiento de ortodoncia:', error);
    throw error;
  }
}

/**
 * Obtiene todos los planes de tratamiento de ortodoncia de un paciente específico
 */
export async function obtenerPlanesPorPaciente(
  pacienteId: string
): Promise<PlanTratamientoOrtodoncia[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/ortodoncia/planes-tratamiento/paciente/${pacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener planes de tratamiento: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener planes de tratamiento de ortodoncia:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles completos de un plan de tratamiento específico
 */
export async function obtenerPlanPorId(
  planId: string
): Promise<PlanTratamientoOrtodoncia> {
  try {
    const response = await fetch(`${API_BASE_URL}/ortodoncia/planes-tratamiento/${planId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener plan de tratamiento: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener plan de tratamiento de ortodoncia:', error);
    throw error;
  }
}

/**
 * Actualiza un plan de tratamiento de ortodoncia existente
 */
export async function actualizarPlanTratamiento(
  planId: string,
  datos: ActualizarPlanTratamientoRequest
): Promise<PlanTratamientoOrtodoncia> {
  try {
    const response = await fetch(`${API_BASE_URL}/ortodoncia/planes-tratamiento/${planId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error al actualizar plan de tratamiento: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar plan de tratamiento de ortodoncia:', error);
    throw error;
  }
}

/**
 * Elimina un plan de tratamiento de ortodoncia
 */
export async function eliminarPlanTratamiento(
  planId: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/ortodoncia/planes-tratamiento/${planId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar plan de tratamiento: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al eliminar plan de tratamiento de ortodoncia:', error);
    throw error;
  }
}

/**
 * Sube archivos de diagnóstico (fotos, radiografías) y los asocia a un plan
 */
export async function adjuntarArchivosDiagnostico(
  planId: string,
  archivos: File[],
  tipoArchivo: 'fotos' | 'radiografias',
  metadatos?: Array<{ descripcion?: string; tipo?: string }>
): Promise<PlanTratamientoOrtodoncia> {
  try {
    const formData = new FormData();
    
    archivos.forEach((archivo, index) => {
      formData.append('archivos', archivo);
      if (metadatos && metadatos[index]) {
        if (metadatos[index].descripcion) {
          formData.append(`metadata[${index}][descripcion]`, metadatos[index].descripcion!);
        }
        if (metadatos[index].tipo) {
          formData.append(`metadata[${index}][tipo]`, metadatos[index].tipo!);
        }
      }
    });
    
    formData.append('tipoArchivo', tipoArchivo);

    const response = await fetch(`${API_BASE_URL}/ortodoncia/planes-tratamiento/${planId}/archivos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // No establecer Content-Type para FormData, el navegador lo hace automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error al subir archivos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al adjuntar archivos de diagnóstico:', error);
    throw error;
  }
}



