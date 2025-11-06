// API para gestión de documentos y plantillas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PlantillaDocumento {
  _id?: string;
  nombre: string;
  contenido: string; // HTML con placeholders
  tipo: 'Consentimiento' | 'Presupuesto' | 'Informe' | 'Receta' | 'Otro';
  variables: string[]; // Lista de variables disponibles
  clinicaId?: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface DocumentoGenerado {
  _id?: string;
  pacienteId: string;
  plantillaUsada: string;
  contenidoFinal: string; // HTML o referencia a archivo
  fechaCreacion: string;
  creadoPor: {
    _id: string;
    nombre: string;
  };
  estado: 'Generado' | 'Firmado' | 'Enviado';
  urlArchivo?: string;
  formato?: 'PDF' | 'HTML';
}

export interface DatosGeneracionDocumento {
  plantillaId: string;
  pacienteId: string;
  datosAdicionales?: Record<string, any>;
}

// Obtener todas las plantillas disponibles
export async function obtenerPlantillas(tipo?: string): Promise<PlantillaDocumento[]> {
  try {
    const url = tipo 
      ? `${API_BASE_URL}/documentos/plantillas?tipo=${tipo}`
      : `${API_BASE_URL}/documentos/plantillas`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    throw error;
  }
}

// Crear una nueva plantilla (solo Admin)
export async function crearPlantilla(plantilla: Omit<PlantillaDocumento, '_id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<PlantillaDocumento> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentos/plantillas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al crear plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear plantilla:', error);
    throw error;
  }
}

// Actualizar una plantilla existente (solo Admin)
export async function actualizarPlantilla(
  id: string,
  plantilla: Partial<PlantillaDocumento>
): Promise<PlantillaDocumento> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentos/plantillas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar plantilla:', error);
    throw error;
  }
}

// Eliminar una plantilla (solo Admin)
export async function eliminarPlantilla(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentos/plantillas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar plantilla');
    }
  } catch (error) {
    console.error('Error al eliminar plantilla:', error);
    throw error;
  }
}

// Generar un documento a partir de una plantilla y datos del paciente
export async function generarDocumento(datos: DatosGeneracionDocumento): Promise<{ contenidoHtml: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentos/generar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error('Error al generar documento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al generar documento:', error);
    throw error;
  }
}

// Guardar un documento generado en el historial del paciente
export async function guardarDocumento(documento: {
  pacienteId: string;
  plantillaId: string;
  contenidoFinal: string;
  formato: 'PDF' | 'HTML';
}): Promise<DocumentoGenerado> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentos/guardar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(documento),
    });

    if (!response.ok) {
      throw new Error('Error al guardar documento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al guardar documento:', error);
    throw error;
  }
}

// Obtener el historial de documentos generados para un paciente
export async function obtenerDocumentosPorPaciente(pacienteId: string): Promise<DocumentoGenerado[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/documentos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener documentos del paciente');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener documentos del paciente:', error);
    throw error;
  }
}

// Interfaces para captura de firmas
export interface DocumentoParaFirma {
  id: string;
  titulo: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  urlContenido: string;
  estado: 'pendiente_firma' | 'firmado' | 'rechazado';
}

export interface FirmaDocumento {
  firmanteId: string;
  firmanteRol: 'Paciente' | 'Odontologo';
  urlFirma: string;
  fechaFirma: Date;
  metadatos: {
    ip: string;
    userAgent: string;
  };
}

export interface DocumentoFirmado {
  id: string;
  estado: 'firmado';
  firmas: FirmaDocumento[];
}

export interface DatosFirma {
  signatureData: string; // base64
  firmanteId: string;
  firmanteRol: 'Paciente' | 'Odontologo';
  metadatos: {
    ip: string;
    userAgent: string;
  };
}

// Obtener documento para firma
export async function obtenerDocumentoParaFirma(documentoId: string): Promise<DocumentoParaFirma> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentos/${documentoId}/contenido-para-firma`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener documento para firma');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener documento para firma:', error);
    throw error;
  }
}

// Agregar firma a documento
export async function agregarFirmaADocumento(
  documentoId: string,
  datosFirma: DatosFirma
): Promise<DocumentoFirmado> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentos/${documentoId}/firmas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datosFirma),
    });

    if (!response.ok) {
      throw new Error('Error al agregar firma al documento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al agregar firma al documento:', error);
    throw error;
  }
}

