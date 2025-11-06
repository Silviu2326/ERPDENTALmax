// API para perfil completo del paciente
// Nota: Esta API usa datos falsos, no requiere URL base

export interface PerfilCompletoPaciente {
  _id: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento?: string;
  genero?: string;
  dni?: string;
  datosContacto: {
    email?: string;
    telefono?: string;
    direccion?: string;
  };
  historialMedico: {
    alergias?: string[];
    enfermedades?: string[];
    medicacionActual?: string[];
  };
  alertasMedicas?: string[];
  fechaAlta?: string;
  notasAdministrativas?: string;
  saldo?: number;
  historiaClinica?: EvolucionClinica[];
  planesTratamiento?: PlanTratamiento[];
  citas?: CitaPaciente[];
  documentos?: DocumentoPaciente[];
  contactoEmergencia?: {
    nombre?: string;
    telefono?: string;
    relacion?: string;
  };
  datosSeguro?: {
    aseguradora?: string;
    numeroPoliza?: string;
    tipoPlan?: string;
  };
}

export interface EvolucionClinica {
  _id: string;
  paciente: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fecha: string;
  descripcion: string;
  tipo: string;
}

export interface PlanTratamiento {
  _id: string;
  paciente: string;
  nombre?: string;
  descripcion?: string;
  fechaCreacion?: string;
  estado?: string;
  tratamientos?: any[];
}

export interface CitaPaciente {
  _id: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  estado: string;
  tratamiento?: {
    _id: string;
    nombre: string;
  };
}

export interface DocumentoPaciente {
  _id: string;
  nombreArchivo: string;
  url: string;
  tipo: string;
  fechaSubida: string;
}

export interface InformacionGeneralPaciente {
  nombre: string;
  apellidos: string;
  fechaNacimiento?: string;
  genero?: string;
  dni?: string;
  datosContacto: {
    email?: string;
    telefono?: string;
    direccion?: string;
  };
  historialMedico: {
    alergias?: string[];
    enfermedades?: string[];
    medicacionActual?: string[];
  };
  alertasMedicas?: string[];
  notasAdministrativas?: string;
  contactoEmergencia?: {
    nombre?: string;
    telefono?: string;
    relacion?: string;
  };
  datosSeguro?: {
    aseguradora?: string;
    numeroPoliza?: string;
    tipoPlan?: string;
  };
}

// Generar datos falsos de perfil completo
function generarPerfilCompletoFalso(id: string): PerfilCompletoPaciente {
  const nombres = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Pedro', 'Sofía', 'Miguel'];
  const apellidos = ['García López', 'Martínez Sánchez', 'Rodríguez Pérez', 'Fernández Torres', 'González Ruiz', 'López Morales', 'Hernández Jiménez', 'Díaz Castro'];
  const dnis = ['12345678A', '87654321B', '11223344C', '55667788D', '99887766E', '44332211F', '22114433G', '33445566H'];
  const emails = ['maria.garcia@email.com', 'juan.martinez@email.com', 'ana.rodriguez@email.com', 'carlos.fernandez@email.com', 'laura.gonzalez@email.com', 'pedro.lopez@email.com', 'sofia.hernandez@email.com', 'miguel.diaz@email.com'];
  const telefonos = ['612345678', '623456789', '634567890', '645678901', '656789012', '667890123', '678901234', '689012345'];
  
  const index = parseInt(id) - 1 || 0;
  const nombre = nombres[index % nombres.length] || nombres[0];
  const apellido = apellidos[index % apellidos.length] || apellidos[0];
  const dni = dnis[index % dnis.length] || dnis[0];
  const email = emails[index % emails.length] || emails[0];
  const telefono = telefonos[index % telefonos.length] || telefonos[0];

  const fechaNacimiento = new Date(1985 + (index * 2), index % 12, (index * 3) + 1).toISOString().split('T')[0];
  const fechaAlta = new Date(2024, 0, 15 + (index * 5)).toISOString();

  // Generar más citas variadas y completas
  const citas = [
    {
      _id: `${id}-cita-1`,
      fecha_hora_inicio: new Date(2024, 11, 20, 10, 0).toISOString(),
      fecha_hora_fin: new Date(2024, 11, 20, 11, 0).toISOString(),
      profesional: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      estado: 'programada',
      tratamiento: {
        _id: 'trat-1',
        nombre: 'Limpieza dental profesional',
      },
      consultorio: 'Consultorio 1 - Sala A',
      notas: 'Recordar al paciente traer radiografías anteriores si las tiene.',
      motivoConsulta: 'Limpieza de rutina semestral',
      duracion: 60,
    },
    {
      _id: `${id}-cita-2`,
      fecha_hora_inicio: new Date(2024, 11, 10, 9, 0).toISOString(),
      fecha_hora_fin: new Date(2024, 11, 10, 10, 0).toISOString(),
      profesional: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      estado: 'realizada',
      tratamiento: {
        _id: 'trat-2',
        nombre: 'Revisión general + Limpieza',
      },
      consultorio: 'Consultorio 1 - Sala A',
      notas: 'Visita completada con éxito. Paciente en buen estado. Índice de placa: 12%. Se realizó limpieza completa y aplicación de flúor.',
      motivoConsulta: 'Revisión semestral',
      duracion: 60,
      costo: 115.00,
      metodoPago: 'Efectivo',
    },
    {
      _id: `${id}-cita-3`,
      fecha_hora_inicio: new Date(2024, 10, 25, 14, 30).toISOString(),
      fecha_hora_fin: new Date(2024, 10, 25, 15, 30).toISOString(),
      profesional: {
        _id: 'prof-2',
        nombre: 'Dra. María',
        apellidos: 'González',
      },
      estado: 'realizada',
      tratamiento: {
        _id: 'trat-3',
        nombre: 'Obturación composite - Pieza 36',
      },
      consultorio: 'Consultorio 2 - Sala B',
      notas: 'Tratamiento completado. Paciente asintomático. Obturación realizada con composite de alta calidad en superficies O y M.',
      motivoConsulta: 'Tratamiento de caries',
      duracion: 60,
      costo: 80.00,
      metodoPago: 'Tarjeta',
    },
    {
      _id: `${id}-cita-4`,
      fecha_hora_inicio: new Date(2024, 9, 15, 11, 0).toISOString(),
      fecha_hora_fin: new Date(2024, 9, 15, 12, 0).toISOString(),
      profesional: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      estado: 'cancelada',
      tratamiento: {
        _id: 'trat-4',
        nombre: 'Consulta inicial',
      },
      consultorio: 'Consultorio 1 - Sala A',
      motivoCancelacion: 'Cancelada por el paciente con 24h de antelación',
      motivoConsulta: 'Consulta inicial',
      duracion: 60,
    },
    {
      _id: `${id}-cita-5`,
      fecha_hora_inicio: new Date(2024, 8, 20, 15, 0).toISOString(),
      fecha_hora_fin: new Date(2024, 8, 20, 16, 30).toISOString(),
      profesional: {
        _id: 'prof-2',
        nombre: 'Dra. María',
        apellidos: 'González',
      },
      estado: 'realizada',
      tratamiento: {
        _id: 'trat-5',
        nombre: 'Consulta ortodoncia + Estudio completo',
      },
      consultorio: 'Consultorio 2 - Sala B',
      notas: 'Estudio de ortodoncia completado. Plan de tratamiento propuesto. Se realizaron radiografías cefalométricas y fotografías extraorales.',
      motivoConsulta: 'Consulta ortodoncia',
      duracion: 90,
      costo: 200.00,
      metodoPago: 'Transferencia',
    },
    {
      _id: `${id}-cita-6`,
      fecha_hora_inicio: new Date(2024, 7, 10, 10, 0).toISOString(),
      fecha_hora_fin: new Date(2024, 7, 10, 10, 30).toISOString(),
      profesional: {
        _id: 'prof-3',
        nombre: 'Dr. Carlos',
        apellidos: 'Martínez',
      },
      estado: 'realizada',
      tratamiento: {
        _id: 'trat-6',
        nombre: 'Revisión de rutina',
      },
      consultorio: 'Consultorio 3 - Sala C',
      notas: 'Revisión de rutina. Estado general bueno. Sin cambios significativos.',
      motivoConsulta: 'Revisión de rutina',
      duracion: 30,
      costo: 30.00,
      metodoPago: 'Efectivo',
    },
    {
      _id: `${id}-cita-7`,
      fecha_hora_inicio: new Date(2025, 0, 15, 9, 30).toISOString(),
      fecha_hora_fin: new Date(2025, 0, 15, 10, 30).toISOString(),
      profesional: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      estado: 'confirmada',
      tratamiento: {
        _id: 'trat-7',
        nombre: 'Control post-tratamiento',
      },
      consultorio: 'Consultorio 1 - Sala A',
      notas: 'Cita confirmada por SMS y email.',
      motivoConsulta: 'Control post-tratamiento',
      duracion: 60,
    },
    {
      _id: `${id}-cita-8`,
      fecha_hora_inicio: new Date(2024, 6, 5, 11, 0).toISOString(),
      fecha_hora_fin: new Date(2024, 6, 5, 12, 0).toISOString(),
      profesional: {
        _id: 'prof-1',
        nombre: 'Dr. Juan',
        apellidos: 'Pérez',
      },
      estado: 'realizada',
      tratamiento: {
        _id: 'trat-8',
        nombre: 'Primera consulta',
      },
      consultorio: 'Consultorio 1 - Sala A',
      notas: 'Primera consulta en la clínica. Exploración inicial completa. Se detectaron varias caries que requieren tratamiento.',
      motivoConsulta: 'Primera consulta',
      duracion: 60,
      costo: 50.00,
      metodoPago: 'Efectivo',
    },
  ];

  // Generar más planes de tratamiento completos
  const planesTratamiento = [
    {
      _id: `${id}-plan-1`,
      paciente: id,
      nombre: 'Plan de Ortodoncia Completo',
      descripcion: 'Tratamiento de ortodoncia con brackets metálicos. Duración estimada: 18 meses. Incluye controles mensuales y retenedores. Objetivo: corregir maloclusión clase II y apiñamiento.',
      fechaCreacion: new Date(2024, 9, 1).toISOString(),
      fechaInicio: new Date(2024, 9, 15).toISOString(),
      fechaFinEstimada: new Date(2026, 3, 15).toISOString(),
      estado: 'activo',
      prioridad: 'alta',
      tratamientos: [
        { nombre: 'Brackets metálicos superiores e inferiores', costo: 2500, estado: 'completado', fechaCompletado: new Date(2024, 9, 15).toISOString() },
        { nombre: 'Controles mensuales (18 meses)', costo: 900, estado: 'en-proceso', progreso: 8 },
        { nombre: 'Retenedores fijos', costo: 300, estado: 'pendiente' },
        { nombre: 'Retenedores removibles', costo: 200, estado: 'pendiente' },
      ],
      notas: 'Paciente con buena adherencia al tratamiento. Progreso satisfactorio.',
    },
    {
      _id: `${id}-plan-2`,
      paciente: id,
      nombre: 'Plan de Limpieza y Prevención',
      descripcion: 'Limpieza dental profesional cada 6 meses. Incluye revisión, limpieza y aplicación de flúor. Plan preventivo para mantener la salud bucal.',
      fechaCreacion: new Date(2024, 8, 15).toISOString(),
      fechaInicio: new Date(2024, 8, 15).toISOString(),
      fechaFinEstimada: new Date(2025, 2, 15).toISOString(),
      estado: 'completado',
      prioridad: 'media',
      tratamientos: [
        { nombre: 'Limpieza dental profesional', costo: 60, estado: 'completado', fechaCompletado: new Date(2024, 11, 10).toISOString() },
        { nombre: 'Aplicación de flúor', costo: 25, estado: 'completado', fechaCompletado: new Date(2024, 11, 10).toISOString() },
        { nombre: 'Revisión clínica', costo: 30, estado: 'completado', fechaCompletado: new Date(2024, 11, 10).toISOString() },
      ],
      notas: 'Plan completado exitosamente. Paciente con excelente higiene bucal.',
    },
    {
      _id: `${id}-plan-3`,
      paciente: id,
      nombre: 'Rehabilitación Oral - Implantes',
      descripcion: 'Plan de rehabilitación oral con implantes dentales. Incluye estudio previo, cirugía e implantes. Restauración funcional y estética de piezas ausentes.',
      fechaCreacion: new Date(2024, 7, 10).toISOString(),
      fechaInicio: new Date(2024, 7, 20).toISOString(),
      fechaFinEstimada: new Date(2025, 5, 20).toISOString(),
      estado: 'activo',
      prioridad: 'alta',
      tratamientos: [
        { nombre: 'Estudio radiológico y planificación', costo: 150, estado: 'completado', fechaCompletado: new Date(2024, 7, 25).toISOString() },
        { nombre: 'Cirugía de implante (pieza 16)', costo: 1200, estado: 'completado', fechaCompletado: new Date(2024, 8, 10).toISOString() },
        { nombre: 'Periodo de osteointegración (3 meses)', costo: 0, estado: 'en-proceso', progreso: 60 },
        { nombre: 'Cirugía de implante (pieza 26)', costo: 1200, estado: 'pendiente' },
        { nombre: 'Corona sobre implante (pieza 16)', costo: 800, estado: 'pendiente' },
        { nombre: 'Corona sobre implante (pieza 26)', costo: 800, estado: 'pendiente' },
      ],
      notas: 'Primer implante con buena evolución. Esperando periodo de osteointegración antes de continuar.',
    },
    {
      _id: `${id}-plan-4`,
      paciente: id,
      nombre: 'Tratamiento de Caries Múltiples',
      descripcion: 'Plan de tratamiento para eliminar caries detectadas en la revisión inicial. Incluye obturaciones y seguimiento.',
      fechaCreacion: new Date(2024, 6, 5).toISOString(),
      fechaInicio: new Date(2024, 6, 10).toISOString(),
      fechaFinEstimada: new Date(2024, 10, 30).toISOString(),
      estado: 'completado',
      prioridad: 'alta',
      tratamientos: [
        { nombre: 'Obturación composite - Pieza 36', costo: 80, estado: 'completado', fechaCompletado: new Date(2024, 10, 25).toISOString() },
        { nombre: 'Obturación composite - Pieza 46', costo: 80, estado: 'completado', fechaCompletado: new Date(2024, 9, 20).toISOString() },
        { nombre: 'Control post-tratamiento', costo: 30, estado: 'completado', fechaCompletado: new Date(2024, 11, 5).toISOString() },
      ],
      notas: 'Todas las caries han sido tratadas exitosamente. Paciente asintomático.',
    },
  ];

  // Generar más documentos completos
  const documentos = [
    {
      _id: `${id}-doc-1`,
      nombreArchivo: 'Radiografía panorámica 2024.pdf',
      url: '#',
      tipo: 'Radiografía',
      fechaSubida: new Date(2024, 10, 1).toISOString(),
      descripcion: 'Radiografía panorámica de control anual. Se observa buen estado general de las estructuras óseas.',
      tamaño: 2048576,
    },
    {
      _id: `${id}-doc-2`,
      nombreArchivo: 'Consentimiento informado ortodoncia.pdf',
      url: '#',
      tipo: 'Consentimiento',
      fechaSubida: new Date(2024, 9, 15).toISOString(),
      descripcion: 'Consentimiento informado para tratamiento de ortodoncia. Firmado por el paciente y testigo.',
      tamaño: 512000,
    },
    {
      _id: `${id}-doc-3`,
      nombreArchivo: 'Fotografía intraoral frontal.jpg',
      url: '#',
      tipo: 'Fotografía',
      fechaSubida: new Date(2024, 11, 5).toISOString(),
      descripcion: 'Fotografía intraoral frontal para seguimiento del tratamiento de ortodoncia',
      tamaño: 1024000,
    },
    {
      _id: `${id}-doc-4`,
      nombreArchivo: 'Informe médico externo.pdf',
      url: '#',
      tipo: 'Informe Externo',
      fechaSubida: new Date(2024, 8, 20).toISOString(),
      descripcion: 'Informe médico externo del cardiólogo. Paciente apto para tratamiento dental.',
      tamaño: 768000,
    },
    {
      _id: `${id}-doc-5`,
      nombreArchivo: 'Radiografía cefalométrica lateral.pdf',
      url: '#',
      tipo: 'Radiografía',
      fechaSubida: new Date(2024, 9, 20).toISOString(),
      descripcion: 'Radiografía cefalométrica lateral para estudio de ortodoncia',
      tamaño: 1536000,
    },
    {
      _id: `${id}-doc-6`,
      nombreArchivo: 'Fotografías extraorales.jpg',
      url: '#',
      tipo: 'Fotografía',
      fechaSubida: new Date(2024, 9, 20).toISOString(),
      descripcion: 'Serie de fotografías extraorales para documentación del caso de ortodoncia',
      tamaño: 2048000,
    },
  ];

  return {
    _id: id,
    nombre,
    apellidos: apellido,
    fechaNacimiento,
    genero: index % 2 === 0 ? 'Femenino' : 'Masculino',
    dni,
    datosContacto: {
      email,
      telefono,
      direccion: `Calle ${['Mayor', 'Gran Vía', 'Alcalá', 'Serrano', 'Princesa', 'Fuencarral'][index % 6]} ${index + 1}, ${['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'][index % 6]}`,
    },
    historialMedico: {
      alergias: index % 3 === 0 ? ['Penicilina', 'Látex'] : index % 3 === 1 ? ['Ibuprofeno'] : [],
      enfermedades: index % 2 === 0 ? ['Hipertensión', 'Diabetes tipo 2'] : ['Asma'],
      medicacionActual: index % 2 === 0 ? ['Metformina 500mg', 'Enalapril 10mg'] : ['Salbutamol inhalador'],
    },
    alertasMedicas: index % 4 === 0 ? ['Alergia severa a penicilina', 'Requiere profilaxis antibiótica'] : [],
    fechaAlta,
    notasAdministrativas: index % 2 === 0 ? 'Paciente preferente. Prefiere citas por la mañana. Buena adherencia al tratamiento.' : 'Paciente nuevo. Verificar cobertura de seguro. Prefiere comunicación por email.',
    saldo: index % 3 === 0 ? 150.50 : index % 3 === 1 ? 0 : -320.75,
    contactoEmergencia: {
      nombre: index % 2 === 0 ? 'María García López' : 'Juan Martínez Sánchez',
      telefono: index % 2 === 0 ? '612345678' : '623456789',
      relacion: index % 2 === 0 ? 'Cónyuge' : 'Hijo/a',
    },
    datosSeguro: {
      aseguradora: index % 2 === 0 ? 'Sanitas' : 'Adeslas',
      numeroPoliza: `POL-${2024 + index}-${1000 + index}`,
      tipoPlan: index % 2 === 0 ? 'Básico' : 'Premium',
    },
    historiaClinica: [
      {
        _id: `${id}-evol-1`,
        paciente: id,
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        fecha: new Date(2024, 11, 10).toISOString(),
        descripcion: 'Revisión general. Estado bucal bueno. Se recomienda limpieza profesional. Sin signos de patología activa. Índice de placa: 15%. Se realizó limpieza dental profesional y aplicación de flúor. Exploración completa sin hallazgos patológicos. Paciente con buena adherencia a las recomendaciones de higiene oral.',
        tipo: 'revision',
      },
      {
        _id: `${id}-evol-2`,
        paciente: id,
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        fecha: new Date(2024, 10, 25).toISOString(),
        descripcion: 'Tratamiento de caries en pieza 36. Obturación realizada con éxito con composite de alta calidad. Paciente asintomático. Se recomienda control en 3 meses. Caries de grado 2 tratada en superficies O y M. Material utilizado: composite nanohíbrido. Procedimiento sin complicaciones.',
        tipo: 'tratamiento',
      },
      {
        _id: `${id}-evol-3`,
        paciente: id,
        profesional: {
          _id: 'prof-2',
          nombre: 'Dra. María',
          apellidos: 'González',
        },
        fecha: new Date(2024, 9, 20).toISOString(),
        descripcion: 'Consulta inicial para ortodoncia. Exploración completa. Se detecta maloclusión clase II y apiñamiento moderado. Se realizaron radiografías y fotografías. Plan de tratamiento con brackets metálicos propuesto. Duración estimada: 18-24 meses. Análisis cefalométrico realizado. Paciente informado sobre el tratamiento y sus implicaciones.',
        tipo: 'consulta',
      },
      {
        _id: `${id}-evol-4`,
        paciente: id,
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        fecha: new Date(2024, 8, 5).toISOString(),
        descripcion: 'Revisión de rutina. Paciente sin quejas. Se observa buena higiene bucal. Sin cambios significativos desde la última visita. Se programó próxima revisión en 6 meses. Exploración periodontal normal. Índice de placa: 10%.',
        tipo: 'revision',
      },
      {
        _id: `${id}-evol-5`,
        paciente: id,
        profesional: {
          _id: 'prof-3',
          nombre: 'Dr. Carlos',
          apellidos: 'Martínez',
        },
        fecha: new Date(2024, 7, 10).toISOString(),
        descripcion: 'Primera consulta en la clínica. Exploración inicial completa. Se detectaron varias caries que requieren tratamiento. Se explicó plan de tratamiento al paciente. Anamnesis completa realizada. Historial médico revisado. Se identificaron alergias a penicilina y látex.',
        tipo: 'consulta',
      },
      {
        _id: `${id}-evol-6`,
        paciente: id,
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        fecha: new Date(2024, 6, 15).toISOString(),
        descripcion: 'Control post-tratamiento. Obturación en pieza 36 evoluciona correctamente. Paciente asintomático. Se observa buena adaptación del material. Sin signos de sensibilidad post-tratamiento. Se recomienda continuar con higiene oral adecuada.',
        tipo: 'control',
      },
    ],
    planesTratamiento,
    citas,
    documentos,
  };
}

// Obtener perfil completo del paciente
export async function obtenerPerfilCompletoPaciente(id: string): Promise<PerfilCompletoPaciente> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return generarPerfilCompletoFalso(id);
}

// Actualizar información general del paciente
export async function actualizarInformacionGeneral(
  id: string,
  datos: InformacionGeneralPaciente
): Promise<PerfilCompletoPaciente> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const perfil = generarPerfilCompletoFalso(id);
  return {
    ...perfil,
    ...datos,
  };
}

// Obtener evoluciones del paciente
export async function obtenerEvolucionesPaciente(
  id: string,
  page: number = 1,
  limit: number = 20
): Promise<{ data: EvolucionClinica[]; pagination: any }> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const perfil = generarPerfilCompletoFalso(id);
  const evoluciones = perfil.historiaClinica || [];
  
  // Aplicar paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const evolucionesPaginadas = evoluciones.slice(startIndex, endIndex);
  
  return {
    data: evolucionesPaginadas,
    pagination: {
      total: evoluciones.length,
      page,
      limit,
      totalPages: Math.ceil(evoluciones.length / limit),
    },
  };
}

// Obtener documentos del paciente
export async function obtenerDocumentosPaciente(id: string): Promise<DocumentoPaciente[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const perfil = generarPerfilCompletoFalso(id);
  return perfil.documentos || [];
}

// Subir documento del paciente
export async function subirDocumentoPaciente(
  _id: string,
  archivo: File,
  tipo: string
): Promise<DocumentoPaciente> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    _id: `doc-${Date.now()}`,
    nombreArchivo: archivo.name,
    url: '#',
    tipo,
    fechaSubida: new Date().toISOString(),
  };
}

