// API para gestión de autorizaciones de tratamientos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface DocumentoAutorizacion {
  nombreArchivo: string;
  url: string;
  subidoPor: {
    _id: string;
    nombre: string;
  };
  fechaSubida: string;
}

export interface HistorialEstado {
  estado: string;
  fecha: string;
  modificadoPor: {
    _id: string;
    nombre: string;
  };
}

export interface Autorizacion {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  tratamientoPlanificado: {
    _id: string;
    nombre: string;
    descripcion?: string;
  };
  mutua: {
    _id: string;
    nombreComercial: string;
  };
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional';
  codigoSolicitud: string;
  codigoAutorizacion?: string;
  fechaSolicitud: string;
  fechaRespuesta?: string;
  notas?: string;
  documentos: DocumentoAutorizacion[];
  historialEstados: HistorialEstado[];
}

export interface FiltrosAutorizaciones {
  page?: number;
  limit?: number;
  pacienteId?: string;
  mutuaId?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface NuevaAutorizacion {
  pacienteId: string;
  tratamientoPlanificadoId: string;
  mutuaId: string;
  notas?: string;
}

export interface ActualizarAutorizacion {
  estado?: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional';
  codigoAutorizacion?: string;
  notas?: string;
  fechaRespuesta?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Datos falsos para autorizaciones
const AUTORIZACIONES_FALSAS: Autorizacion[] = [
  {
    _id: 'a1',
    paciente: { _id: 'p1', nombre: 'Juan', apellidos: 'García López' },
    tratamientoPlanificado: { _id: 't4', nombre: 'Endodoncia', descripcion: 'Endodoncia en pieza 36' },
    mutua: { _id: '1', nombreComercial: 'Sanitas' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-001',
    codigoAutorizacion: 'SAN-AUT-12345',
    fechaSolicitud: '2024-01-15T10:00:00Z',
    fechaRespuesta: '2024-01-18T14:30:00Z',
    notas: 'Autorización aprobada sin observaciones. Tratamiento a realizar en 2 sesiones.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_36.pdf',
        url: '/documentos/autorizaciones/a1/radiografia.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-01-15T10:15:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-15T10:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
      { estado: 'Aprobada', fecha: '2024-01-18T14:30:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Sanitas' } },
    ],
  },
  {
    _id: 'a2',
    paciente: { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
    tratamientoPlanificado: { _id: 't7', nombre: 'Corona cerámica', descripcion: 'Corona en pieza 21' },
    mutua: { _id: '2', nombreComercial: 'Adeslas' },
    estado: 'Pendiente',
    codigoSolicitud: 'AUT-2024-002',
    fechaSolicitud: '2024-01-20T09:30:00Z',
    notas: 'Esperando respuesta de la aseguradora. Documentación completa enviada.',
    documentos: [
      {
        nombreArchivo: 'presupuesto_corona.pdf',
        url: '/documentos/autorizaciones/a2/presupuesto.pdf',
        subidoPor: { _id: 'u2', nombre: 'Dr. González' },
        fechaSubida: '2024-01-20T09:35:00Z',
      },
      {
        nombreArchivo: 'foto_clinica_pieza_21.jpg',
        url: '/documentos/autorizaciones/a2/foto.jpg',
        subidoPor: { _id: 'u2', nombre: 'Dr. González' },
        fechaSubida: '2024-01-20T09:40:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-20T09:30:00Z', modificadoPor: { _id: 'u2', nombre: 'Dr. González' } },
    ],
  },
  {
    _id: 'a3',
    paciente: { _id: 'p3', nombre: 'Carlos', apellidos: 'Fernández Torres' },
    tratamientoPlanificado: { _id: 't8', nombre: 'Implante dental', descripcion: 'Implante en pieza 46' },
    mutua: { _id: '3', nombreComercial: 'DKV Seguros' },
    estado: 'Requiere Información Adicional',
    codigoSolicitud: 'AUT-2024-003',
    fechaSolicitud: '2024-01-18T11:00:00Z',
    fechaRespuesta: '2024-01-22T16:00:00Z',
    notas: 'Se requiere TAC de la zona y justificación médica adicional.',
    documentos: [
      {
        nombreArchivo: 'radiografia_panoramica.pdf',
        url: '/documentos/autorizaciones/a3/panoramica.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-01-18T11:10:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-18T11:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
      { estado: 'Requiere Información Adicional', fecha: '2024-01-22T16:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema DKV' } },
    ],
  },
  {
    _id: 'a4',
    paciente: { _id: 'p4', nombre: 'Ana', apellidos: 'López Martín' },
    tratamientoPlanificado: { _id: 't9', nombre: 'Ortodoncia', descripcion: 'Ortodoncia completa superior e inferior' },
    mutua: { _id: '4', nombreComercial: 'Asisa' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-004',
    codigoAutorizacion: 'ASI-AUT-78901',
    fechaSolicitud: '2024-01-10T08:00:00Z',
    fechaRespuesta: '2024-01-12T12:00:00Z',
    notas: 'Autorización aprobada para tratamiento de ortodoncia. Duración estimada 24 meses.',
    documentos: [
      {
        nombreArchivo: 'estudio_ortodoncia.pdf',
        url: '/documentos/autorizaciones/a4/estudio.pdf',
        subidoPor: { _id: 'u3', nombre: 'Dr. Ruiz' },
        fechaSubida: '2024-01-10T08:15:00Z',
      },
      {
        nombreArchivo: 'fotos_ortodoncia.zip',
        url: '/documentos/autorizaciones/a4/fotos.zip',
        subidoPor: { _id: 'u3', nombre: 'Dr. Ruiz' },
        fechaSubida: '2024-01-10T08:20:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-10T08:00:00Z', modificadoPor: { _id: 'u3', nombre: 'Dr. Ruiz' } },
      { estado: 'Aprobada', fecha: '2024-01-12T12:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Asisa' } },
    ],
  },
  {
    _id: 'a5',
    paciente: { _id: 'p5', nombre: 'Pedro', apellidos: 'Sánchez Díaz' },
    tratamientoPlanificado: { _id: 't6', nombre: 'Extracción quirúrgica', descripcion: 'Extracción de muela del juicio incluida' },
    mutua: { _id: '5', nombreComercial: 'Mapfre Salud' },
    estado: 'Rechazada',
    codigoSolicitud: 'AUT-2024-005',
    fechaSolicitud: '2024-01-25T14:00:00Z',
    fechaRespuesta: '2024-01-28T10:00:00Z',
    notas: 'Rechazada por no cumplir criterios de urgencia. Se requiere justificación médica adicional.',
    documentos: [
      {
        nombreArchivo: 'radiografia_muela_juicio.pdf',
        url: '/documentos/autorizaciones/a5/radiografia.pdf',
        subidoPor: { _id: 'u2', nombre: 'Dr. González' },
        fechaSubida: '2024-01-25T14:10:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-25T14:00:00Z', modificadoPor: { _id: 'u2', nombre: 'Dr. González' } },
      { estado: 'Rechazada', fecha: '2024-01-28T10:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Mapfre' } },
    ],
  },
  {
    _id: 'a6',
    paciente: { _id: 'p6', nombre: 'Laura', apellidos: 'Gómez Pérez' },
    tratamientoPlanificado: { _id: 't10', nombre: 'Blanqueamiento', descripcion: 'Blanqueamiento dental completo' },
    mutua: { _id: '6', nombreComercial: 'Fiatc Salud' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-006',
    codigoAutorizacion: 'FIA-AUT-45678',
    fechaSolicitud: '2024-01-22T13:00:00Z',
    fechaRespuesta: '2024-01-24T15:30:00Z',
    notas: 'Autorización aprobada. Tratamiento estético con cobertura del 50%.',
    documentos: [],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-22T13:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
      { estado: 'Aprobada', fecha: '2024-01-24T15:30:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Fiatc' } },
    ],
  },
  {
    _id: 'a7',
    paciente: { _id: 'p7', nombre: 'Miguel', apellidos: 'Torres Jiménez' },
    tratamientoPlanificado: { _id: 't3', nombre: 'Empaste complejo', descripcion: 'Empaste en pieza 15 con reconstrucción' },
    mutua: { _id: '7', nombreComercial: 'Allianz Care' },
    estado: 'Pendiente',
    codigoSolicitud: 'AUT-2024-007',
    fechaSolicitud: '2024-01-28T10:00:00Z',
    notas: 'Solicitud enviada. Esperando respuesta.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_15.pdf',
        url: '/documentos/autorizaciones/a7/radiografia.pdf',
        subidoPor: { _id: 'u3', nombre: 'Dr. Ruiz' },
        fechaSubida: '2024-01-28T10:05:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-28T10:00:00Z', modificadoPor: { _id: 'u3', nombre: 'Dr. Ruiz' } },
    ],
  },
  {
    _id: 'a8',
    paciente: { _id: 'p8', nombre: 'Sofía', apellidos: 'Martínez Ruiz' },
    tratamientoPlanificado: { _id: 't4', nombre: 'Endodoncia', descripcion: 'Endodoncia en pieza 24' },
    mutua: { _id: '1', nombreComercial: 'Sanitas' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-008',
    codigoAutorizacion: 'SAN-AUT-23456',
    fechaSolicitud: '2024-01-12T09:00:00Z',
    fechaRespuesta: '2024-01-14T11:00:00Z',
    notas: 'Autorización aprobada. Tratamiento a realizar en 1 sesión.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_24.pdf',
        url: '/documentos/autorizaciones/a8/radiografia.pdf',
        subidoPor: { _id: 'u2', nombre: 'Dr. González' },
        fechaSubida: '2024-01-12T09:10:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-12T09:00:00Z', modificadoPor: { _id: 'u2', nombre: 'Dr. González' } },
      { estado: 'Aprobada', fecha: '2024-01-14T11:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Sanitas' } },
    ],
  },
  {
    _id: 'a9',
    paciente: { _id: 'p1', nombre: 'Juan', apellidos: 'García López' },
    tratamientoPlanificado: { _id: 't2', nombre: 'Empaste simple', descripcion: 'Empaste en pieza 14' },
    mutua: { _id: '1', nombreComercial: 'Sanitas' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-009',
    codigoAutorizacion: 'SAN-AUT-34567',
    fechaSolicitud: '2024-01-05T08:00:00Z',
    fechaRespuesta: '2024-01-06T10:00:00Z',
    notas: 'Autorización aprobada para empaste simple.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_14.pdf',
        url: '/documentos/autorizaciones/a9/radiografia.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-01-05T08:10:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-05T08:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
      { estado: 'Aprobada', fecha: '2024-01-06T10:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Sanitas' } },
    ],
  },
  {
    _id: 'a10',
    paciente: { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
    tratamientoPlanificado: { _id: 't1', nombre: 'Limpieza dental', descripcion: 'Limpieza dental profesional' },
    mutua: { _id: '2', nombreComercial: 'Adeslas' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-010',
    codigoAutorizacion: 'ADE-AUT-11111',
    fechaSolicitud: '2024-01-08T09:00:00Z',
    fechaRespuesta: '2024-01-08T11:00:00Z',
    notas: 'Limpieza dental aprobada sin copago.',
    documentos: [],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-08T09:00:00Z', modificadoPor: { _id: 'u2', nombre: 'Dr. González' } },
      { estado: 'Aprobada', fecha: '2024-01-08T11:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Adeslas' } },
    ],
  },
  {
    _id: 'a11',
    paciente: { _id: 'p3', nombre: 'Carlos', apellidos: 'Fernández Torres' },
    tratamientoPlanificado: { _id: 't5', nombre: 'Extracción simple', descripcion: 'Extracción de pieza 18' },
    mutua: { _id: '3', nombreComercial: 'DKV Seguros' },
    estado: 'Pendiente',
    codigoSolicitud: 'AUT-2024-011',
    fechaSolicitud: '2024-01-30T10:00:00Z',
    notas: 'Solicitud de extracción simple pendiente de aprobación.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_18.pdf',
        url: '/documentos/autorizaciones/a11/radiografia.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-01-30T10:15:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-30T10:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
    ],
  },
  {
    _id: 'a12',
    paciente: { _id: 'p4', nombre: 'Ana', apellidos: 'López Martín' },
    tratamientoPlanificado: { _id: 't2', nombre: 'Empaste simple', descripcion: 'Empaste en pieza 26' },
    mutua: { _id: '4', nombreComercial: 'Asisa' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-012',
    codigoAutorizacion: 'ASI-AUT-22222',
    fechaSolicitud: '2024-01-16T14:00:00Z',
    fechaRespuesta: '2024-01-17T09:00:00Z',
    notas: 'Empaste aprobado con copago del 25%.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_26.pdf',
        url: '/documentos/autorizaciones/a12/radiografia.pdf',
        subidoPor: { _id: 'u3', nombre: 'Dr. Ruiz' },
        fechaSubida: '2024-01-16T14:10:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-01-16T14:00:00Z', modificadoPor: { _id: 'u3', nombre: 'Dr. Ruiz' } },
      { estado: 'Aprobada', fecha: '2024-01-17T09:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Asisa' } },
    ],
  },
  {
    _id: 'a13',
    paciente: { _id: 'p1', nombre: 'Juan', apellidos: 'García López' },
    tratamientoPlanificado: { _id: 't7', nombre: 'Corona cerámica', descripcion: 'Corona en pieza 16' },
    mutua: { _id: '1', nombreComercial: 'Sanitas' },
    estado: 'Pendiente',
    codigoSolicitud: 'AUT-2024-013',
    fechaSolicitud: '2024-02-01T10:00:00Z',
    notas: 'Solicitud de corona cerámica pendiente de revisión. Documentación completa.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_16.pdf',
        url: '/documentos/autorizaciones/a13/radiografia.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-02-01T10:15:00Z',
      },
      {
        nombreArchivo: 'presupuesto_corona.pdf',
        url: '/documentos/autorizaciones/a13/presupuesto.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-02-01T10:20:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-02-01T10:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
    ],
  },
  {
    _id: 'a14',
    paciente: { _id: 'p5', nombre: 'Pedro', apellidos: 'Sánchez Díaz' },
    tratamientoPlanificado: { _id: 't1', nombre: 'Limpieza dental', descripcion: 'Limpieza dental profesional' },
    mutua: { _id: '5', nombreComercial: 'Mapfre Salud' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-014',
    codigoAutorizacion: 'MAP-AUT-33333',
    fechaSolicitud: '2024-02-05T08:00:00Z',
    fechaRespuesta: '2024-02-05T10:00:00Z',
    notas: 'Limpieza dental aprobada sin copago.',
    documentos: [],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-02-05T08:00:00Z', modificadoPor: { _id: 'u2', nombre: 'Dr. González' } },
      { estado: 'Aprobada', fecha: '2024-02-05T10:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Mapfre' } },
    ],
  },
  {
    _id: 'a15',
    paciente: { _id: 'p6', nombre: 'Laura', apellidos: 'Gómez Pérez' },
    tratamientoPlanificado: { _id: 't3', nombre: 'Empaste complejo', descripcion: 'Empaste complejo en pieza 27' },
    mutua: { _id: '6', nombreComercial: 'Fiatc Salud' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-015',
    codigoAutorizacion: 'FIA-AUT-44444',
    fechaSolicitud: '2024-02-10T11:00:00Z',
    fechaRespuesta: '2024-02-12T14:00:00Z',
    notas: 'Empaste complejo aprobado con copago del 25%.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_27.pdf',
        url: '/documentos/autorizaciones/a15/radiografia.pdf',
        subidoPor: { _id: 'u3', nombre: 'Dr. Ruiz' },
        fechaSubida: '2024-02-10T11:10:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-02-10T11:00:00Z', modificadoPor: { _id: 'u3', nombre: 'Dr. Ruiz' } },
      { estado: 'Aprobada', fecha: '2024-02-12T14:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Fiatc' } },
    ],
  },
  {
    _id: 'a16',
    paciente: { _id: 'p7', nombre: 'Miguel', apellidos: 'Torres Jiménez' },
    tratamientoPlanificado: { _id: 't8', nombre: 'Implante dental', descripcion: 'Implante en pieza 46' },
    mutua: { _id: '7', nombreComercial: 'Allianz Care' },
    estado: 'Requiere Información Adicional',
    codigoSolicitud: 'AUT-2024-016',
    fechaSolicitud: '2024-02-15T09:00:00Z',
    fechaRespuesta: '2024-02-18T16:00:00Z',
    notas: 'Se requiere TAC 3D y justificación médica detallada del implante.',
    documentos: [
      {
        nombreArchivo: 'radiografia_panoramica.pdf',
        url: '/documentos/autorizaciones/a16/panoramica.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-02-15T09:15:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-02-15T09:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
      { estado: 'Requiere Información Adicional', fecha: '2024-02-18T16:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Allianz' } },
    ],
  },
  {
    _id: 'a17',
    paciente: { _id: 'p8', nombre: 'Sofía', apellidos: 'Martínez Ruiz' },
    tratamientoPlanificado: { _id: 't2', nombre: 'Empaste simple', descripcion: 'Empaste en pieza 35' },
    mutua: { _id: '1', nombreComercial: 'Sanitas' },
    estado: 'Aprobada',
    codigoSolicitud: 'AUT-2024-017',
    codigoAutorizacion: 'SAN-AUT-55555',
    fechaSolicitud: '2024-02-20T13:00:00Z',
    fechaRespuesta: '2024-02-21T09:00:00Z',
    notas: 'Empaste simple aprobado con copago del 20%.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_35.pdf',
        url: '/documentos/autorizaciones/a17/radiografia.pdf',
        subidoPor: { _id: 'u2', nombre: 'Dr. González' },
        fechaSubida: '2024-02-20T13:10:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-02-20T13:00:00Z', modificadoPor: { _id: 'u2', nombre: 'Dr. González' } },
      { estado: 'Aprobada', fecha: '2024-02-21T09:00:00Z', modificadoPor: { _id: 'sys', nombre: 'Sistema Sanitas' } },
    ],
  },
  {
    _id: 'a18',
    paciente: { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
    tratamientoPlanificado: { _id: 't4', nombre: 'Endodoncia', descripcion: 'Endodoncia en pieza 14' },
    mutua: { _id: '2', nombreComercial: 'Adeslas' },
    estado: 'Pendiente',
    codigoSolicitud: 'AUT-2024-018',
    fechaSolicitud: '2024-02-25T10:00:00Z',
    notas: 'Solicitud de endodoncia en revisión. Esperando respuesta de la aseguradora.',
    documentos: [
      {
        nombreArchivo: 'radiografia_pieza_14.pdf',
        url: '/documentos/autorizaciones/a18/radiografia.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-02-25T10:15:00Z',
      },
      {
        nombreArchivo: 'justificacion_medica.pdf',
        url: '/documentos/autorizaciones/a18/justificacion.pdf',
        subidoPor: { _id: 'u1', nombre: 'Dr. Martínez' },
        fechaSubida: '2024-02-25T10:20:00Z',
      },
    ],
    historialEstados: [
      { estado: 'Pendiente', fecha: '2024-02-25T10:00:00Z', modificadoPor: { _id: 'u1', nombre: 'Dr. Martínez' } },
    ],
  },
];

// Obtener lista paginada de autorizaciones
export async function obtenerAutorizaciones(
  filtros: FiltrosAutorizaciones
): Promise<PaginatedResponse<Autorizacion>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let autorizacionesFiltradas = [...AUTORIZACIONES_FALSAS];

  // Aplicar filtros
  if (filtros.pacienteId) {
    autorizacionesFiltradas = autorizacionesFiltradas.filter(a => a.paciente._id === filtros.pacienteId);
  }

  if (filtros.mutuaId) {
    autorizacionesFiltradas = autorizacionesFiltradas.filter(a => a.mutua._id === filtros.mutuaId);
  }

  if (filtros.estado) {
    autorizacionesFiltradas = autorizacionesFiltradas.filter(a => a.estado === filtros.estado);
  }

  if (filtros.fechaDesde) {
    const fechaDesde = new Date(filtros.fechaDesde);
    autorizacionesFiltradas = autorizacionesFiltradas.filter(
      a => new Date(a.fechaSolicitud) >= fechaDesde
    );
  }

  if (filtros.fechaHasta) {
    const fechaHasta = new Date(filtros.fechaHasta);
    autorizacionesFiltradas = autorizacionesFiltradas.filter(
      a => new Date(a.fechaSolicitud) <= fechaHasta
    );
  }

  // Paginación
  const page = filtros.page || 1;
  const limit = filtros.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = autorizacionesFiltradas.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: autorizacionesFiltradas.slice(startIndex, endIndex),
    total,
    page,
    limit,
    totalPages,
  };
}

// Crear una nueva autorización
export async function crearAutorizacion(
  datos: NuevaAutorizacion
): Promise<Autorizacion> {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener datos de paciente, mutua y tratamiento (simulado)
  const mutuasData = await import('./mutuasApi').then(m => m.obtenerMutuas({ limit: 1000 }));
  const mutua = mutuasData.data.find(m => m._id === datos.mutuaId);
  
  const tratamientosData = await import('./conveniosApi').then(c => c.obtenerTratamientos());
  const tratamiento = tratamientosData.find(t => t._id === datos.tratamientoPlanificadoId);

  // Simular datos de paciente
  const pacientesFalsos = [
    { _id: 'p1', nombre: 'Juan', apellidos: 'García López' },
    { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
    { _id: 'p3', nombre: 'Carlos', apellidos: 'Fernández Torres' },
  ];
  const paciente = pacientesFalsos.find(p => p._id === datos.pacienteId) || pacientesFalsos[0];

  const nuevaAutorizacion: Autorizacion = {
    _id: `a${AUTORIZACIONES_FALSAS.length + 1}`,
    paciente: { _id: paciente._id, nombre: paciente.nombre, apellidos: paciente.apellidos },
    tratamientoPlanificado: tratamiento 
      ? { _id: tratamiento._id, nombre: tratamiento.nombre, descripcion: '' }
      : { _id: datos.tratamientoPlanificadoId, nombre: 'Tratamiento', descripcion: '' },
    mutua: mutua 
      ? { _id: mutua._id!, nombreComercial: mutua.nombreComercial }
      : { _id: datos.mutuaId, nombreComercial: 'Mutua' },
    estado: 'Pendiente',
    codigoSolicitud: `AUT-2024-${String(AUTORIZACIONES_FALSAS.length + 1).padStart(3, '0')}`,
    fechaSolicitud: new Date().toISOString(),
    notas: datos.notas,
    documentos: [],
    historialEstados: [
      {
        estado: 'Pendiente',
        fecha: new Date().toISOString(),
        modificadoPor: { _id: 'u1', nombre: 'Usuario' },
      },
    ],
  };

  AUTORIZACIONES_FALSAS.push(nuevaAutorizacion);
  return nuevaAutorizacion;
}

// Obtener detalle de una autorización específica
export async function obtenerAutorizacionPorId(id: string): Promise<Autorizacion> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const autorizacion = AUTORIZACIONES_FALSAS.find(a => a._id === id);
  if (!autorizacion) {
    throw new Error('Autorización no encontrada');
  }

  return autorizacion;
}

// Actualizar una autorización
export async function actualizarAutorizacion(
  id: string,
  datos: ActualizarAutorizacion
): Promise<Autorizacion> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = AUTORIZACIONES_FALSAS.findIndex(a => a._id === id);
  if (index === -1) {
    throw new Error('Autorización no encontrada');
  }

  const autorizacionActualizada = {
    ...AUTORIZACIONES_FALSAS[index],
    ...datos,
  };

  // Actualizar historial si cambia el estado
  if (datos.estado && datos.estado !== AUTORIZACIONES_FALSAS[index].estado) {
    autorizacionActualizada.historialEstados = [
      ...AUTORIZACIONES_FALSAS[index].historialEstados,
      {
        estado: datos.estado,
        fecha: datos.fechaRespuesta || new Date().toISOString(),
        modificadoPor: { _id: 'u1', nombre: 'Usuario' },
      },
    ];
  }

  AUTORIZACIONES_FALSAS[index] = autorizacionActualizada;
  return autorizacionActualizada;
}

// Subir documentos a una autorización
export async function subirDocumentosAutorizacion(
  id: string,
  archivos: File[]
): Promise<Autorizacion> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = AUTORIZACIONES_FALSAS.findIndex(a => a._id === id);
  if (index === -1) {
    throw new Error('Autorización no encontrada');
  }

  const nuevosDocumentos = archivos.map(archivo => ({
    nombreArchivo: archivo.name,
    url: `/documentos/autorizaciones/${id}/${archivo.name}`,
    subidoPor: { _id: 'u1', nombre: 'Usuario' },
    fechaSubida: new Date().toISOString(),
  }));

  AUTORIZACIONES_FALSAS[index].documentos = [
    ...AUTORIZACIONES_FALSAS[index].documentos,
    ...nuevosDocumentos,
  ];

  return AUTORIZACIONES_FALSAS[index];
}


