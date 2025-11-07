// API para gestión de consentimientos informados
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ConsentimientoPlantilla {
  _id?: string;
  nombre: string;
  descripcion?: string;
  contenido: string; // HTML/Markdown con variables como {{nombre_paciente}}
  campos_variables: string[]; // Lista de variables disponibles
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface ConsentimientoPaciente {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
  };
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  plantilla_origen: {
    _id: string;
    nombre: string;
  };
  tratamiento?: {
    _id: string;
    nombre: string;
    descripcion?: string;
  };
  contenido_final: string; // HTML/texto con datos rellenados
  estado: 'pendiente' | 'firmado' | 'revocado';
  fecha_generacion: string;
  fecha_firma?: string;
  firma_digital_url?: string; // URL al archivo en S3/GCS
  hash_documento?: string;
}

export interface NuevaPlantilla {
  nombre: string;
  descripcion?: string;
  contenido: string;
}

export interface ActualizarPlantilla {
  nombre?: string;
  descripcion?: string;
  contenido?: string;
  activo?: boolean;
}

export interface GenerarConsentimiento {
  pacienteId: string;
  plantillaId: string;
  tratamientoId?: string;
}

export interface FirmarConsentimiento {
  firmaDigital: string; // Base64
}

// GET /api/consentimientos/plantillas
export async function obtenerPlantillas(): Promise<ConsentimientoPlantilla[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/plantillas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas de consentimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    throw error;
  }
}

// POST /api/consentimientos/plantillas
export async function crearPlantilla(plantilla: NuevaPlantilla): Promise<ConsentimientoPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/plantillas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al crear plantilla de consentimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear plantilla:', error);
    throw error;
  }
}

// PUT /api/consentimientos/plantillas/:id
export async function actualizarPlantilla(
  id: string,
  plantilla: ActualizarPlantilla
): Promise<ConsentimientoPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/plantillas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar plantilla de consentimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar plantilla:', error);
    throw error;
  }
}

// DELETE /api/consentimientos/plantillas/:id
export async function eliminarPlantilla(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/plantillas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar plantilla de consentimiento');
    }
  } catch (error) {
    console.error('Error al eliminar plantilla:', error);
    throw error;
  }
}

// GET /api/consentimientos/paciente/:pacienteId
export async function obtenerConsentimientosPorPaciente(
  pacienteId: string
): Promise<ConsentimientoPaciente[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/paciente/${pacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener consentimientos del paciente');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener consentimientos del paciente:', error);
    throw error;
  }
}

// POST /api/consentimientos/generar
export async function generarConsentimiento(
  datos: GenerarConsentimiento
): Promise<ConsentimientoPaciente> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/generar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error('Error al generar consentimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al generar consentimiento:', error);
    throw error;
  }
}

// PUT /api/consentimientos/:id/firmar
export async function firmarConsentimiento(
  id: string,
  firma: FirmarConsentimiento
): Promise<ConsentimientoPaciente> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/${id}/firmar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(firma),
    });

    if (!response.ok) {
      throw new Error('Error al firmar consentimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al firmar consentimiento:', error);
    throw error;
  }
}

// GET /api/consentimientos/:id
export async function obtenerConsentimientoPorId(id: string): Promise<ConsentimientoPaciente> {
  try {
    const response = await fetch(`${API_BASE_URL}/consentimientos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener consentimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener consentimiento:', error);
    throw error;
  }
}



