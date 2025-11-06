// API para gestión de pacientes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Paciente {
  _id?: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento?: string;
  DNI?: string;
  numeroHistoriaClinica?: string;
  telefonos?: string[];
  email?: string;
  direccion?: {
    calle?: string;
    ciudad?: string;
    codigoPostal?: string;
    provincia?: string;
  };
  genero?: string;
  status: 'activo' | 'inactivo' | 'archivado';
  fechaAlta?: string;
  ultimaVisita?: string;
  saldoPendiente?: number;
  notasAdministrativas?: string;
  clinicaId?: string;
}

export interface FiltrosBusquedaPacientes {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginacionInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RespuestaListadoPacientes {
  data: Paciente[];
  pagination: PaginacionInfo;
}

// Datos falsos de pacientes
const PACIENTES_FALSOS: Paciente[] = [
  {
    _id: '1',
    nombre: 'María',
    apellidos: 'García López',
    DNI: '12345678A',
    numeroHistoriaClinica: 'HC-2024-001',
    telefonos: ['612345678', '912345678'],
    email: 'maria.garcia@email.com',
    direccion: {
      calle: 'Calle Mayor 123',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      provincia: 'Madrid',
    },
    fechaNacimiento: '1985-05-15',
    genero: 'Femenino',
    status: 'activo',
    fechaAlta: '2024-01-15',
    ultimaVisita: '2024-12-10',
    saldoPendiente: 150.50,
  },
  {
    _id: '2',
    nombre: 'Juan',
    apellidos: 'Martínez Sánchez',
    DNI: '87654321B',
    numeroHistoriaClinica: 'HC-2024-002',
    telefonos: ['623456789'],
    email: 'juan.martinez@email.com',
    direccion: {
      calle: 'Avenida de la Paz 45',
      ciudad: 'Barcelona',
      codigoPostal: '08001',
      provincia: 'Barcelona',
    },
    fechaNacimiento: '1990-08-22',
    genero: 'Masculino',
    status: 'activo',
    fechaAlta: '2024-02-20',
    ultimaVisita: '2024-12-08',
    saldoPendiente: 0,
  },
  {
    _id: '3',
    nombre: 'Ana',
    apellidos: 'Rodríguez Pérez',
    DNI: '11223344C',
    numeroHistoriaClinica: 'HC-2024-003',
    telefonos: ['634567890', '934567890'],
    email: 'ana.rodriguez@email.com',
    direccion: {
      calle: 'Plaza España 7',
      ciudad: 'Valencia',
      codigoPostal: '46001',
      provincia: 'Valencia',
    },
    fechaNacimiento: '1988-03-10',
    genero: 'Femenino',
    status: 'activo',
    fechaAlta: '2024-03-05',
    ultimaVisita: '2024-12-12',
    saldoPendiente: 320.75,
  },
  {
    _id: '4',
    nombre: 'Carlos',
    apellidos: 'Fernández Torres',
    DNI: '55667788D',
    numeroHistoriaClinica: 'HC-2024-004',
    telefonos: ['645678901'],
    email: 'carlos.fernandez@email.com',
    direccion: {
      calle: 'Calle Gran Vía 89',
      ciudad: 'Sevilla',
      codigoPostal: '41001',
      provincia: 'Sevilla',
    },
    fechaNacimiento: '1992-11-30',
    genero: 'Masculino',
    status: 'activo',
    fechaAlta: '2024-04-12',
    ultimaVisita: '2024-12-05',
    saldoPendiente: 0,
  },
  {
    _id: '5',
    nombre: 'Laura',
    apellidos: 'González Ruiz',
    DNI: '99887766E',
    numeroHistoriaClinica: 'HC-2024-005',
    telefonos: ['656789012'],
    email: 'laura.gonzalez@email.com',
    direccion: {
      calle: 'Avenida Libertad 12',
      ciudad: 'Bilbao',
      codigoPostal: '48001',
      provincia: 'Vizcaya',
    },
    fechaNacimiento: '1987-07-18',
    genero: 'Femenino',
    status: 'activo',
    fechaAlta: '2024-05-20',
    ultimaVisita: '2024-12-11',
    saldoPendiente: 85.25,
  },
  {
    _id: '6',
    nombre: 'Pedro',
    apellidos: 'López Morales',
    DNI: '44332211F',
    numeroHistoriaClinica: 'HC-2024-006',
    telefonos: ['667890123'],
    email: 'pedro.lopez@email.com',
    direccion: {
      calle: 'Calle Real 34',
      ciudad: 'Málaga',
      codigoPostal: '29001',
      provincia: 'Málaga',
    },
    fechaNacimiento: '1995-02-14',
    genero: 'Masculino',
    status: 'inactivo',
    fechaAlta: '2024-06-10',
    ultimaVisita: '2024-11-20',
    saldoPendiente: 0,
  },
  {
    _id: '7',
    nombre: 'Sofía',
    apellidos: 'Hernández Jiménez',
    DNI: '22114433G',
    numeroHistoriaClinica: 'HC-2024-007',
    telefonos: ['678901234'],
    email: 'sofia.hernandez@email.com',
    direccion: {
      calle: 'Paseo de la Castellana 200',
      ciudad: 'Madrid',
      codigoPostal: '28046',
      provincia: 'Madrid',
    },
    fechaNacimiento: '1991-09-25',
    genero: 'Femenino',
    status: 'activo',
    fechaAlta: '2024-07-15',
    ultimaVisita: '2024-12-09',
    saldoPendiente: 200.00,
  },
  {
    _id: '8',
    nombre: 'Miguel',
    apellidos: 'Díaz Castro',
    DNI: '33445566H',
    numeroHistoriaClinica: 'HC-2024-008',
    telefonos: ['689012345'],
    email: 'miguel.diaz@email.com',
    direccion: {
      calle: 'Calle Colón 56',
      ciudad: 'Valencia',
      codigoPostal: '46004',
      provincia: 'Valencia',
    },
    fechaNacimiento: '1989-12-05',
    genero: 'Masculino',
    status: 'activo',
    fechaAlta: '2024-08-22',
    ultimaVisita: '2024-12-07',
    saldoPendiente: 0,
  },
];

// Obtener lista paginada y filtrada de pacientes
export async function obtenerPacientes(filtros: FiltrosBusquedaPacientes = {}): Promise<RespuestaListadoPacientes> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  let pacientesFiltrados = [...PACIENTES_FALSOS];

  // Aplicar filtro de búsqueda
  if (filtros.search) {
    const searchLower = filtros.search.toLowerCase();
    pacientesFiltrados = pacientesFiltrados.filter(
      p => 
        p.nombre.toLowerCase().includes(searchLower) ||
        p.apellidos.toLowerCase().includes(searchLower) ||
        p.DNI?.toLowerCase().includes(searchLower) ||
        p.numeroHistoriaClinica?.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower)
    );
  }

  // Aplicar filtro de status
  if (filtros.status) {
    pacientesFiltrados = pacientesFiltrados.filter(p => p.status === filtros.status);
  }

  // Aplicar ordenamiento
  const sortBy = filtros.sortBy || 'apellidos';
  const sortOrder = filtros.sortOrder || 'asc';
  
  pacientesFiltrados.sort((a, b) => {
    let aVal: any = a[sortBy as keyof Paciente];
    let bVal: any = b[sortBy as keyof Paciente];
    
    if (aVal === undefined || aVal === null) aVal = '';
    if (bVal === undefined || bVal === null) bVal = '';
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Aplicar paginación
  const page = filtros.page || 1;
  const limit = filtros.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pacientesPaginados = pacientesFiltrados.slice(startIndex, endIndex);

  return {
    data: pacientesPaginados,
    pagination: {
      total: pacientesFiltrados.length,
      page,
      limit,
      totalPages: Math.ceil(pacientesFiltrados.length / limit),
    },
  };
}

// Obtener datos completos de un único paciente
export async function obtenerPacientePorId(id: string): Promise<Paciente> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const paciente = PACIENTES_FALSOS.find(p => p._id === id);
  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }

  return paciente;
}

// Interfaces para crear nuevo paciente según el modelo del documento
export interface DatosPersonales {
  nombre: string;
  apellidos: string;
  dni?: string;
  fechaNacimiento?: string;
  genero?: string;
}

export interface Contacto {
  email?: string;
  telefono?: string;
  direccion?: {
    calle?: string;
    ciudad?: string;
    codigoPostal?: string;
  };
}

export interface ContactoEmergencia {
  nombre?: string;
  telefono?: string;
  relacion?: string;
}

export interface HistoriaMedica {
  alergias?: string[];
  enfermedadesCronicas?: string[];
  medicacionActual?: string[];
  notas?: string;
}

export interface DatosSeguro {
  aseguradora?: string;
  numeroPoliza?: string;
  tipoPlan?: string;
}

export interface NuevoPaciente {
  datosPersonales: DatosPersonales;
  contacto: Contacto;
  contactoEmergencia?: ContactoEmergencia;
  historiaMedica?: HistoriaMedica;
  datosSeguro?: DatosSeguro;
  administrativo?: {
    clinicaAsociada?: string;
    estado?: 'Activo' | 'Inactivo';
  };
}

// Crear un nuevo paciente
export async function crearPaciente(paciente: NuevoPaciente): Promise<Paciente> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevoId = String(PACIENTES_FALSOS.length + 1);
  const nuevoPaciente: Paciente = {
    _id: nuevoId,
    nombre: paciente.datosPersonales.nombre,
    apellidos: paciente.datosPersonales.apellidos,
    DNI: paciente.datosPersonales.dni,
    fechaNacimiento: paciente.datosPersonales.fechaNacimiento,
    genero: paciente.datosPersonales.genero,
    numeroHistoriaClinica: `HC-2024-${String(PACIENTES_FALSOS.length + 1).padStart(3, '0')}`,
    telefonos: paciente.contacto.telefono ? [paciente.contacto.telefono] : [],
    email: paciente.contacto.email,
    direccion: paciente.contacto.direccion,
    status: paciente.administrativo?.estado?.toLowerCase() as 'activo' | 'inactivo' | 'archivado' || 'activo',
    fechaAlta: new Date().toISOString().split('T')[0],
    saldoPendiente: 0,
  };
  
  PACIENTES_FALSOS.push(nuevoPaciente);
  return nuevoPaciente;
}

// Buscar pacientes duplicados por criterios
export interface CriteriosBusquedaDuplicados {
  dni?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
}

export async function buscarPacientesDuplicados(
  criterios: CriteriosBusquedaDuplicados
): Promise<Paciente[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let pacientesFiltrados = [...PACIENTES_FALSOS];
  
  if (criterios.dni) {
    pacientesFiltrados = pacientesFiltrados.filter(p => 
      p.DNI?.toLowerCase() === criterios.dni?.toLowerCase()
    );
  }
  
  if (criterios.nombre) {
    pacientesFiltrados = pacientesFiltrados.filter(p => 
      p.nombre.toLowerCase().includes(criterios.nombre!.toLowerCase())
    );
  }
  
  if (criterios.apellidos) {
    pacientesFiltrados = pacientesFiltrados.filter(p => 
      p.apellidos.toLowerCase().includes(criterios.apellidos!.toLowerCase())
    );
  }
  
  if (criterios.email) {
    pacientesFiltrados = pacientesFiltrados.filter(p => 
      p.email?.toLowerCase() === criterios.email?.toLowerCase()
    );
  }
  
  return pacientesFiltrados;
}

