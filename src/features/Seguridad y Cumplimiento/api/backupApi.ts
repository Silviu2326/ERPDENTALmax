// API para gestión de copias de seguridad
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface BackupLog {
  _id?: string;
  timestamp: Date;
  type: 'manual' | 'auto';
  status: 'pending' | 'completed' | 'failed';
  storagePath: string;
  size: number; // en bytes
  createdBy?: {
    _id: string;
    nombre: string;
  };
  durationMs?: number;
  errorMessage?: string;
  description?: string;
}

export interface BackupSettings {
  schedule: string; // expresión cron
  retentionDays: number;
  enabled: boolean;
}

export interface BackupListResponse {
  backups: BackupLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBackupResponse {
  jobId: string;
  message: string;
}

export interface DownloadUrlResponse {
  url: string;
  expiresAt: string;
}

/**
 * Obtiene una lista paginada del historial de copias de seguridad
 */
export async function listBackups(params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed';
}): Promise<BackupListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/backups?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el historial de copias de seguridad');
  }

  return response.json();
}

/**
 * Crea una copia de seguridad manual
 */
export async function createManualBackup(description?: string): Promise<CreateBackupResponse> {
  const response = await fetch(`${API_BASE_URL}/backups/manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la copia de seguridad');
  }

  return response.json();
}

/**
 * Obtiene una URL de descarga temporal para una copia de seguridad
 */
export async function getBackupDownloadUrl(backupId: string): Promise<DownloadUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/backups/${backupId}/download`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la URL de descarga');
  }

  return response.json();
}

/**
 * Inicia el proceso de restauración desde una copia de seguridad
 */
export async function restoreBackup(
  backupId: string,
  confirmationToken: string
): Promise<{ message: string; jobId: string }> {
  const response = await fetch(`${API_BASE_URL}/backups/${backupId}/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ confirmationToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar la restauración');
  }

  return response.json();
}

/**
 * Obtiene la configuración actual de copias de seguridad automáticas
 */
export async function getBackupSettings(): Promise<BackupSettings> {
  const response = await fetch(`${API_BASE_URL}/backups/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la configuración');
  }

  return response.json();
}

/**
 * Actualiza la configuración de copias de seguridad automáticas
 */
export async function updateBackupSettings(
  settings: Partial<BackupSettings>
): Promise<BackupSettings> {
  const response = await fetch(`${API_BASE_URL}/backups/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la configuración');
  }

  return response.json();
}

/**
 * Formatea el tamaño de bytes a formato legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}



