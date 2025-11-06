// API para historial de visitas del paciente
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Visita {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: 'programada' | 'completada' | 'cancelada';
  tratamientosRealizados?: Array<{
    tratamiento: {
      _id: string;
      nombre: string;
      costo?: number;
    };
    pieza?: string;
    notas?: string;
  }>;
  notasClinicas?: string;
  odontogramaSnapshot?: {
    _id: string;
    fechaCreacion: string;
    estadoPiezas: any;
  };
  documentosAdjuntos?: Array<{
    _id: string;
    nombreArchivo: string;
    url: string;
    mimeType: string;
    tipoDocumento?: string;
    fechaSubida: string;
  }>;
  pagosAsociados?: Array<{
    _id: string;
    monto: number;
    fecha: string;
    metodoPago: string;
    estado: string;
  }>;
  sede?: {
    _id: string;
    nombre: string;
  };
}

export interface DetalleVisita extends Visita {
  // Incluye toda la información expandida de la visita
}

export interface FiltrosVisitas {
  fechaDesde?: string;
  fechaHasta?: string;
  profesionalId?: string;
  sort?: string; // ej: 'fechaHoraInicio:desc'
}

export interface PaginacionVisitas {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface RespuestaVisitas {
  visitas: Visita[];
  pagination: PaginacionVisitas;
}

// Obtener visitas de un paciente con paginación y filtros
export async function obtenerVisitasByPacienteId(
  pacienteId: string,
  page: number = 1,
  limit: number = 20,
  filtros?: FiltrosVisitas
): Promise<RespuestaVisitas> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generar visitas falsas más completas
  const index = parseInt(pacienteId) - 1 || 0;
  const profesionales = [
    { _id: 'prof-1', nombre: 'Dr. Juan', apellidos: 'Pérez' },
    { _id: 'prof-2', nombre: 'Dra. María', apellidos: 'González' },
    { _id: 'prof-3', nombre: 'Dr. Carlos', apellidos: 'Martínez' },
  ];

  const visitas: Visita[] = [
    {
      _id: `${pacienteId}-visita-1`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[0],
      fechaHoraInicio: new Date(2024, 11, 10, 9, 0).toISOString(),
      fechaHoraFin: new Date(2024, 11, 10, 10, 0).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-1',
            nombre: 'Limpieza dental profesional',
            costo: 60,
          },
          notas: 'Limpieza completa realizada sin complicaciones. Eliminación de placa y sarro. Índice de placa reducido del 25% al 8%.',
        },
        {
          tratamiento: {
            _id: 'trat-2',
            nombre: 'Revisión general',
            costo: 30,
          },
          notas: 'Estado bucal bueno. Sin signos de patología activa. Exploración completa de todas las piezas dentales. Sin caries nuevas detectadas.',
        },
        {
          tratamiento: {
            _id: 'trat-3',
            nombre: 'Aplicación de flúor',
            costo: 25,
          },
          notas: 'Aplicación tópica de flúor para prevención de caries. Gel de flúor al 1.23% aplicado durante 4 minutos.',
        },
      ],
      notasClinicas: 'Paciente con buena higiene bucal. Se recomienda continuar con las revisiones cada 6 meses. Sin signos de patología activa. Se observa ligera acumulación de placa en zona posterior que se ha eliminado. Exploración periodontal normal. Índice de placa: 12%. Se realizó limpieza completa y aplicación de flúor. Paciente informado sobre la importancia de mantener una buena higiene oral.',
      documentosAdjuntos: [
        {
          _id: 'doc-visita-1',
          nombreArchivo: 'Radiografía panorámica.pdf',
          url: '#',
          mimeType: 'application/pdf',
          tipoDocumento: 'Radiografía',
          fechaSubida: new Date(2024, 11, 10).toISOString(),
        },
        {
          _id: 'doc-visita-2',
          nombreArchivo: 'Fotografía intraoral frontal.jpg',
          url: '#',
          mimeType: 'image/jpeg',
          tipoDocumento: 'Fotografía',
          fechaSubida: new Date(2024, 11, 10).toISOString(),
        },
        {
          _id: 'doc-visita-3',
          nombreArchivo: 'Fotografía intraoral lateral.jpg',
          url: '#',
          mimeType: 'image/jpeg',
          tipoDocumento: 'Fotografía',
          fechaSubida: new Date(2024, 11, 10).toISOString(),
        },
      ],
      pagosAsociados: [
        {
          _id: 'pago-1',
          monto: 115,
          fecha: new Date(2024, 11, 10).toISOString(),
          metodoPago: 'Efectivo',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-2`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[0],
      fechaHoraInicio: new Date(2024, 10, 15, 10, 30).toISOString(),
      fechaHoraFin: new Date(2024, 10, 15, 11, 30).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-4',
            nombre: 'Obturación composite',
            costo: 80,
          },
          pieza: '36',
          notas: 'Obturación realizada en pieza 36, superficies O y M. Caries de grado 2. Material composite de alta calidad.',
        },
      ],
      notasClinicas: 'Tratamiento de caries en pieza 36 completado con éxito. Paciente asintomático. Se recomienda control en 3 meses para verificar la evolución.',
      pagosAsociados: [
        {
          _id: 'pago-2',
          monto: 80,
          fecha: new Date(2024, 10, 15).toISOString(),
          metodoPago: 'Tarjeta',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-3`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[1],
      fechaHoraInicio: new Date(2024, 9, 20, 14, 0).toISOString(),
      fechaHoraFin: new Date(2024, 9, 20, 15, 30).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-5',
            nombre: 'Consulta inicial ortodoncia',
            costo: 50,
          },
          notas: 'Evaluación completa para tratamiento de ortodoncia. Se realizaron radiografías y fotografías.',
        },
        {
          tratamiento: {
            _id: 'trat-6',
            nombre: 'Estudio de ortodoncia',
            costo: 150,
          },
          notas: 'Estudio completo con modelos, radiografías y análisis cefalométrico.',
        },
      ],
      notasClinicas: 'Consulta inicial para tratamiento de ortodoncia. Se detecta maloclusión clase II. Se propone tratamiento con brackets metálicos. Duración estimada: 18-24 meses.',
      documentosAdjuntos: [
        {
          _id: 'doc-visita-3',
          nombreArchivo: 'Radiografía cefalométrica.pdf',
          url: '#',
          mimeType: 'application/pdf',
          tipoDocumento: 'Radiografía',
          fechaSubida: new Date(2024, 9, 20).toISOString(),
        },
        {
          _id: 'doc-visita-4',
          nombreArchivo: 'Fotografías extraorales.jpg',
          url: '#',
          mimeType: 'image/jpeg',
          tipoDocumento: 'Fotografía',
          fechaSubida: new Date(2024, 9, 20).toISOString(),
        },
      ],
      pagosAsociados: [
        {
          _id: 'pago-3',
          monto: 200,
          fecha: new Date(2024, 9, 20).toISOString(),
          metodoPago: 'Transferencia',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-4`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[2],
      fechaHoraInicio: new Date(2024, 8, 5, 11, 0).toISOString(),
      fechaHoraFin: new Date(2024, 8, 5, 12, 0).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-7',
            nombre: 'Revisión de rutina',
            costo: 30,
          },
          notas: 'Revisión de rutina. Estado general bueno.',
        },
      ],
      notasClinicas: 'Revisión de rutina. Paciente sin quejas. Se observa buena higiene bucal. Sin cambios significativos desde la última visita.',
      pagosAsociados: [
        {
          _id: 'pago-4',
          monto: 30,
          fecha: new Date(2024, 8, 5).toISOString(),
          metodoPago: 'Efectivo',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-5`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[0],
      fechaHoraInicio: new Date(2024, 11, 20, 14, 0).toISOString(),
      fechaHoraFin: new Date(2024, 11, 20, 15, 0).toISOString(),
      estado: 'programada',
      tratamientosRealizados: [],
      notasClinicas: 'Cita programada para limpieza dental de rutina.',
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-6`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[1],
      fechaHoraInicio: new Date(2024, 6, 15, 10, 0).toISOString(),
      fechaHoraFin: new Date(2024, 6, 15, 11, 0).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-8',
            nombre: 'Control post-tratamiento',
            costo: 30,
          },
          notas: 'Control de obturación en pieza 36. Evolución correcta.',
        },
      ],
      notasClinicas: 'Control post-tratamiento. Obturación en pieza 36 evoluciona correctamente. Paciente asintomático.',
      pagosAsociados: [
        {
          _id: 'pago-5',
          monto: 30,
          fecha: new Date(2024, 6, 15).toISOString(),
          metodoPago: 'Efectivo',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-7`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[0],
      fechaHoraInicio: new Date(2024, 5, 20, 9, 0).toISOString(),
      fechaHoraFin: new Date(2024, 5, 20, 10, 0).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-9',
            nombre: 'Primera consulta',
            costo: 50,
          },
          notas: 'Primera consulta en la clínica. Exploración inicial completa.',
        },
      ],
      notasClinicas: 'Primera consulta en la clínica. Exploración inicial completa. Se detectaron varias caries que requieren tratamiento. Anamnesis completa realizada.',
      documentosAdjuntos: [
        {
          _id: 'doc-visita-5',
          nombreArchivo: 'Radiografía panorámica inicial.pdf',
          url: '#',
          mimeType: 'application/pdf',
          tipoDocumento: 'Radiografía',
          fechaSubida: new Date(2024, 5, 20).toISOString(),
        },
      ],
      pagosAsociados: [
        {
          _id: 'pago-6',
          monto: 50,
          fecha: new Date(2024, 5, 20).toISOString(),
          metodoPago: 'Efectivo',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-8`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[1],
      fechaHoraInicio: new Date(2024, 4, 15, 15, 0).toISOString(),
      fechaHoraFin: new Date(2024, 4, 15, 16, 0).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-10',
            nombre: 'Control ortodoncia',
            costo: 50,
          },
          notas: 'Control mensual de ortodoncia. Ajuste de brackets. Progreso satisfactorio.',
        },
      ],
      notasClinicas: 'Control mensual de ortodoncia. Ajuste de brackets en arcada superior e inferior. Progreso satisfactorio. Paciente con buena adherencia al tratamiento. Se observa mejoría en la alineación dental.',
      pagosAsociados: [
        {
          _id: 'pago-7',
          monto: 50,
          fecha: new Date(2024, 4, 15).toISOString(),
          metodoPago: 'Transferencia',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-9`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[0],
      fechaHoraInicio: new Date(2024, 3, 20, 10, 0).toISOString(),
      fechaHoraFin: new Date(2024, 3, 20, 11, 30).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-11',
            nombre: 'Endodoncia pieza 46',
            costo: 300,
          },
          pieza: '46',
          notas: 'Endodoncia realizada en pieza 46. Pulpa necrótica. Tratamiento completado en una sesión.',
        },
      ],
      notasClinicas: 'Endodoncia realizada en pieza 46. Pulpa necrótica detectada. Tratamiento completado en una sesión. Se utilizó técnica rotatoria. Obturación con gutapercha y cemento sellador. Control radiográfico post-tratamiento satisfactorio.',
      documentosAdjuntos: [
        {
          _id: 'doc-visita-6',
          nombreArchivo: 'Radiografía periapical pieza 46.pdf',
          url: '#',
          mimeType: 'application/pdf',
          tipoDocumento: 'Radiografía',
          fechaSubida: new Date(2024, 3, 20).toISOString(),
        },
      ],
      pagosAsociados: [
        {
          _id: 'pago-8',
          monto: 300,
          fecha: new Date(2024, 3, 20).toISOString(),
          metodoPago: 'Tarjeta',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
    {
      _id: `${pacienteId}-visita-10`,
      paciente: {
        _id: pacienteId,
        nombre: 'Paciente',
        apellidos: 'Ejemplo',
      },
      profesional: profesionales[2],
      fechaHoraInicio: new Date(2024, 2, 10, 11, 0).toISOString(),
      fechaHoraFin: new Date(2024, 2, 10, 12, 0).toISOString(),
      estado: 'completada',
      tratamientosRealizados: [
        {
          tratamiento: {
            _id: 'trat-12',
            nombre: 'Blanqueamiento dental',
            costo: 250,
          },
          notas: 'Blanqueamiento dental profesional. Técnica con peróxido de hidrógeno al 35%. Resultados visibles inmediatamente.',
        },
      ],
      notasClinicas: 'Blanqueamiento dental profesional realizado. Técnica con peróxido de hidrógeno al 35%. Aplicación durante 3 sesiones de 20 minutos. Resultados visibles inmediatamente. Paciente satisfecho con los resultados. Se proporcionaron instrucciones de mantenimiento.',
      documentosAdjuntos: [
        {
          _id: 'doc-visita-7',
          nombreArchivo: 'Fotografía antes blanqueamiento.jpg',
          url: '#',
          mimeType: 'image/jpeg',
          tipoDocumento: 'Fotografía',
          fechaSubida: new Date(2024, 2, 10).toISOString(),
        },
        {
          _id: 'doc-visita-8',
          nombreArchivo: 'Fotografía después blanqueamiento.jpg',
          url: '#',
          mimeType: 'image/jpeg',
          tipoDocumento: 'Fotografía',
          fechaSubida: new Date(2024, 2, 10).toISOString(),
        },
      ],
      pagosAsociados: [
        {
          _id: 'pago-9',
          monto: 250,
          fecha: new Date(2024, 2, 10).toISOString(),
          metodoPago: 'Transferencia',
          estado: 'completado',
        },
      ],
      sede: {
        _id: 'sede-1',
        nombre: 'Clínica Central',
      },
    },
  ];

  // Aplicar filtros
  let visitasFiltradas = [...visitas];
  
  if (filtros?.fechaDesde) {
    const fechaDesde = new Date(filtros.fechaDesde);
    visitasFiltradas = visitasFiltradas.filter(v => new Date(v.fechaHoraInicio) >= fechaDesde);
  }
  
  if (filtros?.fechaHasta) {
    const fechaHasta = new Date(filtros.fechaHasta);
    visitasFiltradas = visitasFiltradas.filter(v => new Date(v.fechaHoraInicio) <= fechaHasta);
  }
  
  if (filtros?.profesionalId) {
    visitasFiltradas = visitasFiltradas.filter(v => v.profesional._id === filtros.profesionalId);
  }

  // Aplicar ordenamiento
  if (filtros?.sort) {
    const [campo, orden] = filtros.sort.split(':');
    visitasFiltradas.sort((a, b) => {
      const aVal = new Date(a.fechaHoraInicio).getTime();
      const bVal = new Date(b.fechaHoraInicio).getTime();
      return orden === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }

  // Aplicar paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const visitasPaginadas = visitasFiltradas.slice(startIndex, endIndex);

  return {
    visitas: visitasPaginadas,
    pagination: {
      totalDocs: visitasFiltradas.length,
      totalPages: Math.ceil(visitasFiltradas.length / limit),
      page,
      limit,
    },
  };
}

// Obtener detalles completos de una visita específica
export async function obtenerDetalleVisita(visitaId: string): Promise<DetalleVisita> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Extraer pacienteId del visitaId (formato: pacienteId-visita-X)
  const pacienteId = visitaId.split('-')[0];
  const visitas = await obtenerVisitasByPacienteId(pacienteId, 1, 100);
  const visita = visitas.visitas.find(v => v._id === visitaId);
  
  if (!visita) {
    throw new Error('Visita no encontrada');
  }
  
  return visita as DetalleVisita;
}

// Subir documento asociado a una visita
export async function subirDocumentoVisita(
  visitaId: string,
  archivo: File,
  tipoDocumento: string,
  descripcion?: string
): Promise<{ _id: string; nombreArchivo: string; url: string; mimeType: string; fechaSubida: string }> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    _id: `doc-visita-${Date.now()}`,
    nombreArchivo: archivo.name,
    url: '#',
    mimeType: archivo.type,
    fechaSubida: new Date().toISOString(),
  };
}

