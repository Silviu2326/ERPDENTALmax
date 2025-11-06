// API para gestión de documentos del paciente
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type CategoriaDocumento = 'Radiografía' | 'Consentimiento' | 'Administrativo' | 'Informe Externo' | 'Fotografía' | 'Otro';

export interface Documento {
  _id: string;
  pacienteId: string;
  nombreOriginal: string;
  nombreAlmacenado: string;
  url?: string;
  tipoMime: string;
  tamaño: number;
  categoria: CategoriaDocumento;
  descripcion?: string;
  fechaSubida: string;
  subidoPor?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  isDeleted: boolean;
}

export interface DocumentoConUrlSegura extends Documento {
  urlSegura?: string;
}

export interface DatosSubirDocumento {
  file: File;
  categoria: CategoriaDocumento;
  descripcion?: string;
}

// Obtener todos los documentos de un paciente
export async function obtenerDocumentosPorPaciente(
  pacienteId: string,
  categoria?: CategoriaDocumento
): Promise<Documento[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = parseInt(pacienteId) - 1 || 0;
  
  const documentos: Documento[] = [
    {
      _id: `${pacienteId}-doc-1`,
      pacienteId,
      nombreOriginal: 'Radiografía panorámica 2024.pdf',
      nombreAlmacenado: 'rad-panoramica-2024.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 2048576,
      categoria: 'Radiografía',
      descripcion: 'Radiografía panorámica de control anual. Se observa buen estado general de las estructuras óseas.',
      fechaSubida: new Date(2024, 10, 1).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-2`,
      pacienteId,
      nombreOriginal: 'Consentimiento informado ortodoncia.pdf',
      nombreAlmacenado: 'consentimiento-ortodoncia.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 512000,
      categoria: 'Consentimiento',
      descripcion: 'Consentimiento informado para tratamiento de ortodoncia. Firmado por el paciente y testigo.',
      fechaSubida: new Date(2024, 9, 15).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-3`,
      pacienteId,
      nombreOriginal: 'Fotografía intraoral frontal.jpg',
      nombreAlmacenado: 'foto-intraoral-frontal.jpg',
      url: '#',
      tipoMime: 'image/jpeg',
      tamaño: 1024000,
      categoria: 'Fotografía',
      descripcion: 'Fotografía intraoral frontal para seguimiento del tratamiento de ortodoncia',
      fechaSubida: new Date(2024, 11, 5).toISOString(),
      subidoPor: {
        _id: 'prof-2',
        nombre: 'Dra. María',
        apellidos: 'González',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-4`,
      pacienteId,
      nombreOriginal: 'Radiografía cefalométrica.pdf',
      nombreAlmacenado: 'rad-cefalometrica.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 1536000,
      categoria: 'Radiografía',
      descripcion: 'Radiografía cefalométrica lateral para estudio de ortodoncia',
      fechaSubida: new Date(2024, 9, 20).toISOString(),
      subidoPor: {
        _id: 'prof-2',
        nombre: 'Dra. María',
        apellidos: 'González',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-5`,
      pacienteId,
      nombreOriginal: 'Informe médico externo.pdf',
      nombreAlmacenado: 'informe-externo.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 768000,
      categoria: 'Informe Externo',
      descripcion: 'Informe médico externo del cardiólogo. Paciente apto para tratamiento dental.',
      fechaSubida: new Date(2024, 8, 20).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-6`,
      pacienteId,
      nombreOriginal: 'Fotografías extraorales.jpg',
      nombreAlmacenado: 'fotos-extraorales.jpg',
      url: '#',
      tipoMime: 'image/jpeg',
      tamaño: 2048000,
      categoria: 'Fotografía',
      descripcion: 'Serie de fotografías extraorales para documentación del caso de ortodoncia',
      fechaSubida: new Date(2024, 9, 20).toISOString(),
      subidoPor: {
        _id: 'prof-2',
        nombre: 'Dra. María',
        apellidos: 'González',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-7`,
      pacienteId,
      nombreOriginal: 'Presupuesto ortodoncia.pdf',
      nombreAlmacenado: 'presupuesto-ortodoncia.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 256000,
      categoria: 'Administrativo',
      descripcion: 'Presupuesto detallado del tratamiento de ortodoncia. Incluye costos y plan de pagos.',
      fechaSubida: new Date(2024, 9, 25).toISOString(),
      subidoPor: {
        _id: 'prof-2',
        nombre: 'Dra. María',
        apellidos: 'González',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-8`,
      pacienteId,
      nombreOriginal: 'Fotografía intraoral lateral.jpg',
      nombreAlmacenado: 'foto-intraoral-lateral.jpg',
      url: '#',
      tipoMime: 'image/jpeg',
      tamaño: 1536000,
      categoria: 'Fotografía',
      descripcion: 'Fotografía intraoral lateral para seguimiento del tratamiento',
      fechaSubida: new Date(2024, 11, 5).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-9`,
      pacienteId,
      nombreOriginal: 'Radiografía periapical pieza 36.pdf',
      nombreAlmacenado: 'rad-periapical-36.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 1024000,
      categoria: 'Radiografía',
      descripcion: 'Radiografía periapical de la pieza 36 antes del tratamiento de obturación',
      fechaSubida: new Date(2024, 10, 20).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-10`,
      pacienteId,
      nombreOriginal: 'Radiografía periapical pieza 46.pdf',
      nombreAlmacenado: 'rad-periapical-46.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 1024000,
      categoria: 'Radiografía',
      descripcion: 'Radiografía periapical de la pieza 46 antes de la endodoncia. Se observa lesión periapical.',
      fechaSubida: new Date(2024, 3, 20).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-11`,
      pacienteId,
      nombreOriginal: 'Fotografía antes blanqueamiento.jpg',
      nombreAlmacenado: 'foto-antes-blanqueamiento.jpg',
      url: '#',
      tipoMime: 'image/jpeg',
      tamaño: 1536000,
      categoria: 'Fotografía',
      descripcion: 'Fotografía intraoral antes del tratamiento de blanqueamiento dental',
      fechaSubida: new Date(2024, 2, 10).toISOString(),
      subidoPor: {
        _id: 'prof-3',
        nombre: 'Dr. Carlos',
        apellidos: 'Martínez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-12`,
      pacienteId,
      nombreOriginal: 'Fotografía después blanqueamiento.jpg',
      nombreAlmacenado: 'foto-despues-blanqueamiento.jpg',
      url: '#',
      tipoMime: 'image/jpeg',
      tamaño: 1536000,
      categoria: 'Fotografía',
      descripcion: 'Fotografía intraoral después del tratamiento de blanqueamiento dental. Resultados visibles.',
      fechaSubida: new Date(2024, 2, 10).toISOString(),
      subidoPor: {
        _id: 'prof-3',
        nombre: 'Dr. Carlos',
        apellidos: 'Martínez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-13`,
      pacienteId,
      nombreOriginal: 'Radiografía post-endodoncia pieza 46.pdf',
      nombreAlmacenado: 'rad-post-endodoncia-46.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 1024000,
      categoria: 'Radiografía',
      descripcion: 'Radiografía de control post-endodoncia. Obturación correcta. Sin signos de patología.',
      fechaSubida: new Date(2024, 3, 25).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-14`,
      pacienteId,
      nombreOriginal: 'Consentimiento informado endodoncia.pdf',
      nombreAlmacenado: 'consentimiento-endodoncia.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 384000,
      categoria: 'Consentimiento',
      descripcion: 'Consentimiento informado para tratamiento de endodoncia en pieza 46. Firmado por el paciente.',
      fechaSubida: new Date(2024, 3, 20).toISOString(),
      subidoPor: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      isDeleted: false,
    },
    {
      _id: `${pacienteId}-doc-15`,
      pacienteId,
      nombreOriginal: 'Consentimiento informado blanqueamiento.pdf',
      nombreAlmacenado: 'consentimiento-blanqueamiento.pdf',
      url: '#',
      tipoMime: 'application/pdf',
      tamaño: 256000,
      categoria: 'Consentimiento',
      descripcion: 'Consentimiento informado para tratamiento de blanqueamiento dental. Firmado por el paciente.',
      fechaSubida: new Date(2024, 2, 10).toISOString(),
      subidoPor: {
        _id: 'prof-3',
        nombre: 'Dr. Carlos',
        apellidos: 'Martínez',
      },
      isDeleted: false,
    },
  ];

  // Filtrar por categoría si se especifica
  if (categoria) {
    return documentos.filter(doc => doc.categoria === categoria);
  }

  return documentos;
}

// Subir un nuevo documento para un paciente
export async function subirDocumento(
  pacienteId: string,
  datos: DatosSubirDocumento
): Promise<Documento> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    _id: `doc-${Date.now()}`,
    pacienteId,
    nombreOriginal: datos.file.name,
    nombreAlmacenado: `doc-${Date.now()}-${datos.file.name}`,
    url: '#',
    tipoMime: datos.file.type,
    tamaño: datos.file.size,
    categoria: datos.categoria,
    descripcion: datos.descripcion,
    fechaSubida: new Date().toISOString(),
    subidoPor: {
      _id: 'prof-1',
      nombre: 'Dr. Juan',
      apellidos: 'Pérez',
    },
    isDeleted: false,
  };
}

// Obtener URL segura para visualizar o descargar un documento
export async function obtenerUrlSeguraDocumento(documentoId: string): Promise<{ url: string }> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En una implementación real, esto devolvería una URL firmada temporal
  return { url: `https://example.com/documentos/${documentoId}` };
}

// Actualizar metadatos de un documento
export async function actualizarMetadatosDocumento(
  documentoId: string,
  datos: {
    categoria?: CategoriaDocumento;
    descripcion?: string;
  }
): Promise<Documento> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En una implementación real, obtendríamos el documento y lo actualizaríamos
  return {
    _id: documentoId,
    pacienteId: '1',
    nombreOriginal: 'documento.pdf',
    nombreAlmacenado: 'doc.pdf',
    url: '#',
    tipoMime: 'application/pdf',
    tamaño: 1024000,
    categoria: datos.categoria || 'Otro',
    descripcion: datos.descripcion,
    fechaSubida: new Date().toISOString(),
    isDeleted: false,
  };
}

// Eliminar un documento (soft delete)
export async function eliminarDocumento(documentoId: string): Promise<void> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En una implementación real, se marcaría el documento como eliminado
}

// Formatear tamaño de archivo a formato legible
export function formatearTamañoArchivo(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Obtener icono según tipo MIME
export function obtenerIconoTipoMime(tipoMime: string): string {
  if (tipoMime.startsWith('image/')) {
    return '🖼️';
  }
  if (tipoMime === 'application/pdf') {
    return '📄';
  }
  if (tipoMime.includes('dicom') || tipoMime.includes('DICOM')) {
    return '🏥';
  }
  return '📎';
}

// Verificar si un tipo de archivo es previsualizable
export function esPrevisualizable(tipoMime: string): boolean {
  return (
    tipoMime.startsWith('image/') ||
    tipoMime === 'application/pdf' ||
    tipoMime.includes('dicom') ||
    tipoMime.includes('DICOM')
  );
}

