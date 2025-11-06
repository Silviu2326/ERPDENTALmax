// API para gestión de cumplimiento RGPD y LOPD
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Tipos e interfaces
export interface ConfiguracionRGPD {
  _id?: string;
  textoConsentimientoGeneral: string;
  periodoRetencionDatos: number; // en meses
  responsableTratamientoInfo: string;
  dpoInfo: string; // Data Protection Officer
}

export interface Consentimiento {
  _id?: string;
  pacienteId: string;
  tipoConsentimiento: 'TRATAMIENTO_DATOS' | 'COMUNICACIONES_COMERCIALES' | 'CESION_TERCEROS';
  fecha: string;
  estado: 'OTORGADO' | 'REVOCADO';
  metodo: 'FIRMA_DIGITAL' | 'CHECKBOX_WEB' | 'DOCUMENTO_FISICO';
  ipRegistro?: string;
  documentoAdjunto?: string;
  paciente?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
}

export interface SolicitudDerechos {
  _id?: string;
  pacienteId: string;
  tipoDerecho: 'ACCESO' | 'RECTIFICACION' | 'SUPRESION' | 'LIMITACION' | 'PORTABILIDAD' | 'OPOSICION';
  fechaSolicitud: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'RECHAZADA';
  detalleSolicitud: string;
  notasResolucion?: string;
  fechaResolucion?: string;
  paciente?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
}

export interface AuditLog {
  _id?: string;
  usuarioId: string;
  accion: string;
  entidad: string;
  entidadId: string;
  timestamp: string;
  detalles?: Record<string, any>;
  usuario?: {
    _id: string;
    nombre: string;
    email: string;
  };
}

export interface FiltrosSolicitudes {
  page?: number;
  limit?: number;
  status?: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'RECHAZADA';
  type?: 'ACCESO' | 'RECTIFICACION' | 'SUPRESION' | 'LIMITACION' | 'PORTABILIDAD' | 'OPOSICION';
}

export interface FiltrosLogs {
  usuarioId?: string;
  accion?: string;
  entidadId?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

// Obtener configuración de RGPD
export async function obtenerConfiguracionRGPD(): Promise<ConfiguracionRGPD> {
  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/config`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la configuración de RGPD');
  }

  return response.json();
}

// Actualizar configuración de RGPD
export async function actualizarConfiguracionRGPD(
  configuracion: ConfiguracionRGPD
): Promise<ConfiguracionRGPD> {
  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(configuracion),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la configuración de RGPD');
  }

  return response.json();
}

// Obtener solicitudes de derechos
export async function obtenerSolicitudesDerechos(
  filtros: FiltrosSolicitudes = {}
): Promise<SolicitudDerechos[]> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.status) params.append('status', filtros.status);
  if (filtros.type) params.append('type', filtros.type);

  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/requests?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las solicitudes de derechos');
  }

  return response.json();
}

// Crear nueva solicitud de derechos
export async function crearSolicitudDerechos(
  solicitud: Omit<SolicitudDerechos, '_id' | 'fechaSolicitud' | 'estado'>
): Promise<SolicitudDerechos> {
  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(solicitud),
  });

  if (!response.ok) {
    throw new Error('Error al crear la solicitud de derechos');
  }

  return response.json();
}

// Actualizar solicitud de derechos
export async function actualizarSolicitudDerechos(
  requestId: string,
  actualizacion: { estado?: string; notasResolucion?: string }
): Promise<SolicitudDerechos> {
  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/requests/${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(actualizacion),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la solicitud de derechos');
  }

  return response.json();
}

// Obtener logs de auditoría
export async function obtenerLogsAuditoria(
  filtros: FiltrosLogs = {}
): Promise<AuditLog[]> {
  const params = new URLSearchParams();
  
  if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
  if (filtros.accion) params.append('accion', filtros.accion);
  if (filtros.entidadId) params.append('entidadId', filtros.entidadId);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/logs?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los logs de auditoría');
  }

  return response.json();
}

// Anonimizar datos de paciente
export async function anonimizarDatosPaciente(pacienteId: string): Promise<{ mensaje: string }> {
  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/anonymize-patient/${pacienteId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al anonimizar los datos del paciente');
  }

  return response.json();
}

// Exportar datos de paciente
export async function exportarDatosPaciente(
  pacienteId: string,
  formato: 'json' | 'csv' = 'json'
): Promise<Blob> {
  const params = new URLSearchParams({ format: formato });
  
  const response = await fetch(
    `${API_BASE_URL}/compliance/rgpd/export-patient-data/${pacienteId}?${params.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Error al exportar los datos del paciente');
  }

  return response.blob();
}

// Obtener consentimientos de un paciente
export async function obtenerConsentimientosPaciente(
  pacienteId: string
): Promise<Consentimiento[]> {
  const response = await fetch(`${API_BASE_URL}/compliance/rgpd/consentimientos/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los consentimientos del paciente');
  }

  return response.json();
}


