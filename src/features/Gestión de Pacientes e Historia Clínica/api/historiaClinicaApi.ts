// API para gestión de Historia Clínica Dental
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface HistoriaClinica {
  _id?: string;
  paciente: string;
  anamnesis: {
    antecedentesMedicos?: string;
    alergias?: string[];
    medicacionActual?: string;
  };
  odontograma?: Record<string, any>;
  periodontograma?: Record<string, any>;
  notasEvolucion?: NotaEvolucion[];
  documentos?: DocumentoClinico[];
}

export interface NotaEvolucion {
  _id?: string;
  fecha: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  subjetivo?: string;
  objetivo?: string;
  analisis?: string;
  plan?: string;
}

export interface DocumentoClinico {
  _id?: string;
  nombreArchivo: string;
  url: string;
  tipo: string;
  fechaSubida: string;
  descripcion?: string;
}

export interface AnamnesisData {
  antecedentesMedicos?: string;
  alergias?: string[];
  medicacionActual?: string;
}

// Interfaces para Alergias y Antecedentes Médicos (según documento)
export interface Alergia {
  nombre: string;
  tipo: 'medicamento' | 'material' | 'alimento' | 'otro';
  reaccion: string;
  critica: boolean;
}

export interface AntecedenteMedico {
  nombre: string;
  diagnostico: string;
  notas: string;
  critica: boolean;
}

export interface MedicacionActual {
  nombre: string;
  dosis: string;
}

export interface HistoriaMedica {
  alergias: Alergia[];
  antecedentes: AntecedenteMedico[];
  medicacionActual: MedicacionActual[];
  notasGenerales?: string;
}

/**
 * Obtiene la historia clínica completa de un paciente
 */
export async function obtenerHistoriaClinica(pacienteId: string): Promise<HistoriaClinica> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    _id: `hc-${pacienteId}`,
    paciente: pacienteId,
    anamnesis: {
      antecedentesMedicos: 'Paciente sin antecedentes médicos relevantes. Buena salud general.',
      alergias: ['Penicilina', 'Látex'],
      medicacionActual: 'Metformina 500mg cada 12 horas, Enalapril 10mg diario',
    },
    odontograma: {},
    periodontograma: {},
    notasEvolucion: [
      {
        _id: 'nota-1',
        fecha: new Date(2024, 11, 10).toISOString(),
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        subjetivo: 'Paciente refiere sensibilidad en pieza 36 al frío y al calor. La sensibilidad comenzó hace aproximadamente 2 semanas. No refiere dolor espontáneo.',
        objetivo: 'Caries profunda en pieza 36, superficie oclusal. Pulpa vital. Sin signos de infección. Exploración clínica: caries de grado 3 que afecta dentina. Prueba de sensibilidad positiva al frío.',
        analisis: 'Caries de grado 3 que requiere obturación con composite. La pulpa está vital y no hay signos de afectación pulpar. El tratamiento conservador es la opción más adecuada.',
        plan: 'Realizar obturación en pieza 36 con composite de alta calidad. Control en 3 meses para verificar la evolución. Instrucciones de higiene oral reforzadas.',
      },
      {
        _id: 'nota-2',
        fecha: new Date(2024, 10, 15).toISOString(),
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        subjetivo: 'Paciente asintomático. Buena higiene bucal. Refiere seguir las recomendaciones de higiene oral.',
        objetivo: 'Estado bucal general bueno. Ligera placa en zona posterior. Índice de placa: 15%. Sin signos de gingivitis activa. Exploración completa sin hallazgos patológicos.',
        analisis: 'Paciente con buena salud bucal. Requiere limpieza profesional para eliminar placa y sarro acumulado. El estado general es satisfactorio.',
        plan: 'Programar limpieza dental profesional. Revisión en 6 meses. Continuar con las medidas de higiene oral actuales.',
      },
      {
        _id: 'nota-3',
        fecha: new Date(2024, 9, 20).toISOString(),
        profesional: {
          _id: 'prof-2',
          nombre: 'Dra. María',
          apellidos: 'González',
        },
        subjetivo: 'Paciente consulta por necesidad de ortodoncia. Refiere preocupación estética y funcional. No refiere dolor ni molestias.',
        objetivo: 'Maloclusión clase II. Apiñamiento moderado en arcada inferior. Sobremordida aumentada. Se realizaron radiografías y fotografías para estudio completo.',
        analisis: 'Paciente candidato para tratamiento de ortodoncia. Se requiere tratamiento completo con brackets metálicos. Duración estimada: 18-24 meses.',
        plan: 'Realizar estudio completo de ortodoncia (modelos, radiografías, análisis cefalométrico). Presentar plan de tratamiento al paciente. Iniciar tratamiento tras aprobación.',
      },
      {
        _id: 'nota-4',
        fecha: new Date(2024, 8, 5).toISOString(),
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        subjetivo: 'Paciente asintomático. Refiere seguir las recomendaciones de higiene oral. No refiere quejas ni molestias.',
        objetivo: 'Revisión de rutina. Estado bucal general bueno. Ligera placa en zona posterior. Índice de placa: 10%. Sin signos de gingivitis activa. Exploración completa sin hallazgos patológicos.',
        analisis: 'Paciente con buena salud bucal. El estado general es satisfactorio. Se observa buena adherencia a las recomendaciones de higiene oral.',
        plan: 'Continuar con las medidas de higiene oral actuales. Programar próxima revisión en 6 meses. No se requiere tratamiento adicional en este momento.',
      },
      {
        _id: 'nota-5',
        fecha: new Date(2024, 7, 10).toISOString(),
        profesional: {
          _id: 'prof-3',
          nombre: 'Dr. Carlos',
          apellidos: 'Martínez',
        },
        subjetivo: 'Primera consulta en la clínica. Paciente refiere necesidad de revisión dental general. No refiere síntomas específicos.',
        objetivo: 'Exploración inicial completa. Se detectaron varias caries que requieren tratamiento. Anamnesis completa realizada. Historial médico revisado. Se identificaron alergias a penicilina y látex.',
        analisis: 'Paciente nuevo en la clínica. Requiere tratamiento de caries múltiples. Se debe tener en cuenta las alergias identificadas para futuros tratamientos.',
        plan: 'Explicar plan de tratamiento al paciente. Programar citas para tratamiento de caries. Realizar radiografías de control. Iniciar tratamiento conservador.',
      },
      {
        _id: 'nota-6',
        fecha: new Date(2024, 6, 15).toISOString(),
        profesional: {
          _id: 'prof-1',
          nombre: 'Dr. Juan',
          apellidos: 'Pérez',
        },
        subjetivo: 'Paciente refiere evolución favorable tras obturación. No refiere sensibilidad ni molestias. Satisfecho con el tratamiento.',
        objetivo: 'Control post-tratamiento. Obturación en pieza 36 evoluciona correctamente. Se observa buena adaptación del material. Sin signos de sensibilidad post-tratamiento. Exploración clínica normal.',
        analisis: 'Tratamiento exitoso. La obturación está funcionando correctamente. No se observan complicaciones. El paciente está satisfecho con los resultados.',
        plan: 'Continuar con higiene oral adecuada. Control en 3 meses para verificar la evolución a largo plazo. No se requiere tratamiento adicional.',
      },
    ],
    documentos: [
      {
        _id: 'doc-1',
        nombreArchivo: 'Radiografía panorámica 2024.pdf',
        url: '#',
        tipo: 'Radiografía',
        fechaSubida: new Date(2024, 10, 1).toISOString(),
        descripcion: 'Radiografía panorámica de control anual',
      },
    ],
  };
}

/**
 * Actualiza la sección de anamnesis de la historia clínica
 */
export async function actualizarAnamnesis(
  pacienteId: string,
  datos: AnamnesisData
): Promise<AnamnesisData> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return datos;
}

/**
 * Guarda o actualiza el estado completo del odontograma
 */
export async function actualizarOdontograma(
  pacienteId: string,
  odontogramaData: Record<string, any>
): Promise<Record<string, any>> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return odontogramaData;
}

/**
 * Añade una nueva nota de evolución (formato SOAP)
 */
export async function agregarNotaEvolucion(
  pacienteId: string,
  nota: Omit<NotaEvolucion, '_id' | 'profesional'> & { profesional?: string }
): Promise<NotaEvolucion> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    _id: `nota-${Date.now()}`,
    fecha: nota.fecha || new Date().toISOString(),
    profesional: {
      _id: 'prof-1',
      nombre: 'Dr. Juan',
      apellidos: 'Pérez',
    },
    subjetivo: nota.subjetivo,
    objetivo: nota.objetivo,
    analisis: nota.analisis,
    plan: nota.plan,
  };
}

/**
 * Obtiene la lista de documentos clínicos asociados al paciente
 */
export async function obtenerDocumentosClinicos(
  pacienteId: string
): Promise<DocumentoClinico[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = parseInt(pacienteId) - 1 || 0;
  
  return [
    {
      _id: `${pacienteId}-doc-clin-1`,
      nombreArchivo: 'Radiografía panorámica 2024.pdf',
      url: '#',
      tipo: 'Radiografía',
      fechaSubida: new Date(2024, 10, 1).toISOString(),
      descripcion: 'Radiografía panorámica de control anual. Se observa buen estado general de las estructuras óseas.',
    },
    {
      _id: `${pacienteId}-doc-clin-2`,
      nombreArchivo: 'Consentimiento informado ortodoncia.pdf',
      url: '#',
      tipo: 'Consentimiento',
      fechaSubida: new Date(2024, 9, 15).toISOString(),
      descripcion: 'Consentimiento informado para tratamiento de ortodoncia. Firmado por el paciente y testigo.',
    },
    {
      _id: `${pacienteId}-doc-clin-3`,
      nombreArchivo: 'Fotografía intraoral frontal.jpg',
      url: '#',
      tipo: 'Fotografía',
      fechaSubida: new Date(2024, 11, 5).toISOString(),
      descripcion: 'Fotografía intraoral frontal para seguimiento del tratamiento de ortodoncia',
    },
    {
      _id: `${pacienteId}-doc-clin-4`,
      nombreArchivo: 'Radiografía cefalométrica lateral.pdf',
      url: '#',
      tipo: 'Radiografía',
      fechaSubida: new Date(2024, 9, 20).toISOString(),
      descripcion: 'Radiografía cefalométrica lateral para estudio de ortodoncia',
    },
    {
      _id: `${pacienteId}-doc-clin-5`,
      nombreArchivo: 'Informe médico externo.pdf',
      url: '#',
      tipo: 'Informe Externo',
      fechaSubida: new Date(2024, 8, 20).toISOString(),
      descripcion: 'Informe médico externo del cardiólogo. Paciente apto para tratamiento dental.',
    },
  ];
}

/**
 * Sube un nuevo documento clínico asociado al paciente
 */
export async function subirDocumentoClinico(
  pacienteId: string,
  archivo: File,
  metadata: { tipo: string; descripcion?: string }
): Promise<DocumentoClinico> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    _id: `doc-clin-${Date.now()}`,
    nombreArchivo: archivo.name,
    url: '#',
    tipo: metadata.tipo,
    fechaSubida: new Date().toISOString(),
    descripcion: metadata.descripcion,
  };
}

/**
 * Obtiene el historial médico completo (alergias, antecedentes, medicación) de un paciente específico
 * GET /api/pacientes/:pacienteId/historia-medica
 */
export async function obtenerHistoriaMedica(pacienteId: string): Promise<HistoriaMedica> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 250));

  const index = parseInt(pacienteId) - 1 || 0;
  
  return {
    alergias: index % 3 === 0 ? [
      { nombre: 'Penicilina', tipo: 'medicamento' as const, reaccion: 'Urticaria y dificultad respiratoria', critica: true },
      { nombre: 'Látex', tipo: 'material' as const, reaccion: 'Dermatitis de contacto', critica: false },
    ] : index % 3 === 1 ? [
      { nombre: 'Ibuprofeno', tipo: 'medicamento' as const, reaccion: 'Dolor estomacal', critica: false },
    ] : [],
    antecedentes: index % 2 === 0 ? [
      { nombre: 'Hipertensión', diagnostico: 'Diagnosticada en 2020', notas: 'Controlada con medicación', critica: true },
      { nombre: 'Diabetes tipo 2', diagnostico: 'Diagnosticada en 2019', notas: 'Bien controlada. HbA1c: 6.5%', critica: true },
    ] : [
      { nombre: 'Asma', diagnostico: 'Diagnosticada en la infancia', notas: 'Leve, controlada con inhalador', critica: false },
    ],
    medicacionActual: index % 2 === 0 ? [
      { nombre: 'Metformina', dosis: '500mg cada 12 horas' },
      { nombre: 'Enalapril', dosis: '10mg diario' },
    ] : [
      { nombre: 'Salbutamol', dosis: 'Inhalador según necesidad' },
    ],
    notasGenerales: index % 2 === 0 
      ? 'Paciente con buen control de sus patologías. Requiere profilaxis antibiótica antes de procedimientos invasivos.'
      : 'Paciente con asma leve. No requiere profilaxis especial.',
  };
}

/**
 * Actualiza o sobrescribe el historial médico completo de un paciente
 * PUT /api/pacientes/:pacienteId/historia-medica
 */
export async function actualizarHistoriaMedica(
  pacienteId: string,
  historiaMedica: HistoriaMedica
): Promise<HistoriaMedica> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return historiaMedica;
}

