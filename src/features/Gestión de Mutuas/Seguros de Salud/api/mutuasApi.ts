// API para gestión de mutuas y seguros de salud
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Mutua {
  _id?: string;
  nombreComercial: string;
  razonSocial?: string;
  cif: string;
  direccion?: {
    calle?: string;
    ciudad?: string;
    codigoPostal?: string;
    provincia?: string;
    pais?: string;
  };
  contacto?: {
    telefono?: string;
    email?: string;
    personaContacto?: string;
  };
  condicionesGenerales?: string;
  activo: boolean;
  clinicaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevaMutua {
  nombreComercial: string;
  razonSocial?: string;
  cif: string;
  direccion?: {
    calle?: string;
    ciudad?: string;
    codigoPostal?: string;
    provincia?: string;
    pais?: string;
  };
  contacto?: {
    telefono?: string;
    email?: string;
    personaContacto?: string;
  };
  condicionesGenerales?: string;
  activo?: boolean;
  clinicaId?: string;
}

export interface FiltrosMutuas {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'activo' | 'inactivo';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Datos falsos para mutuas
const MUTUAS_FALSAS: Mutua[] = [
  {
    _id: '1',
    nombreComercial: 'Sanitas',
    razonSocial: 'Sanitas Seguros de Salud S.A.',
    cif: 'A28012345',
    direccion: {
      calle: 'Calle Raimundo Fernández Villaverde, 65',
      ciudad: 'Madrid',
      codigoPostal: '28003',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915789123',
      email: 'contacto@sanitas.es',
      personaContacto: 'María González',
    },
    condicionesGenerales: 'Cobertura dental completa. Copago del 20% en tratamientos especiales. Tope anual de 1.200€.',
    activo: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    _id: '2',
    nombreComercial: 'Adeslas',
    razonSocial: 'Adeslas Segurcaixa S.A.',
    cif: 'A28023456',
    direccion: {
      calle: 'Avenida de América, 20',
      ciudad: 'Madrid',
      codigoPostal: '28028',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915678234',
      email: 'info@adeslas.es',
      personaContacto: 'Carlos Martínez',
    },
    condicionesGenerales: 'Cobertura del 80% en tratamientos básicos y 60% en especialidades. Sin tope anual.',
    activo: true,
    createdAt: '2023-02-20T09:15:00Z',
    updatedAt: '2024-02-05T11:20:00Z',
  },
  {
    _id: '3',
    nombreComercial: 'DKV Seguros',
    razonSocial: 'DKV Seguros de Salud S.A.U.',
    cif: 'A28034567',
    direccion: {
      calle: 'Paseo de la Castellana, 259',
      ciudad: 'Madrid',
      codigoPostal: '28046',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915456789',
      email: 'atencion@dkv.es',
      personaContacto: 'Ana Rodríguez',
    },
    condicionesGenerales: 'Cobertura del 100% en prevención, 80% en básicos, 50% en especialidades. Tope anual de 1.500€.',
    activo: true,
    createdAt: '2023-03-10T08:30:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },
  {
    _id: '4',
    nombreComercial: 'Asisa',
    razonSocial: 'Asisa Seguros de Salud S.A.',
    cif: 'A28045678',
    direccion: {
      calle: 'Calle Serrano, 90',
      ciudad: 'Madrid',
      codigoPostal: '28006',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915345678',
      email: 'comercial@asisa.es',
      personaContacto: 'Luis Fernández',
    },
    condicionesGenerales: 'Cobertura del 75% en todos los tratamientos. Tope anual de 1.000€ por paciente.',
    activo: true,
    createdAt: '2023-04-05T12:00:00Z',
    updatedAt: '2024-04-20T10:15:00Z',
  },
  {
    _id: '5',
    nombreComercial: 'Mapfre Salud',
    razonSocial: 'Mapfre Salud S.A.',
    cif: 'A28056789',
    direccion: {
      calle: 'Calle de la Estrella Polar, 1',
      ciudad: 'Madrid',
      codigoPostal: '28007',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915234567',
      email: 'salud@mapfre.es',
      personaContacto: 'Patricia Sánchez',
    },
    condicionesGenerales: 'Cobertura del 70% en tratamientos básicos, 50% en especialidades. Sin copago en urgencias.',
    activo: true,
    createdAt: '2023-05-12T14:20:00Z',
    updatedAt: '2024-05-18T09:30:00Z',
  },
  {
    _id: '6',
    nombreComercial: 'Fiatc Salud',
    razonSocial: 'Fiatc Mutua de Seguros y Reaseguros a Prima Fija',
    cif: 'A28067890',
    direccion: {
      calle: 'Paseo de Gracia, 11',
      ciudad: 'Barcelona',
      codigoPostal: '08007',
      provincia: 'Barcelona',
      pais: 'España',
    },
    contacto: {
      telefono: '934567890',
      email: 'salud@fiatc.es',
      personaContacto: 'Jordi Puig',
    },
    condicionesGenerales: 'Cobertura del 85% en tratamientos básicos, 65% en especialidades. Tope anual de 1.300€.',
    activo: true,
    createdAt: '2023-06-18T11:45:00Z',
    updatedAt: '2024-06-25T13:20:00Z',
  },
  {
    _id: '7',
    nombreComercial: 'Allianz Care',
    razonSocial: 'Allianz Care España S.A.',
    cif: 'A28078901',
    direccion: {
      calle: 'Calle de María de Molina, 50',
      ciudad: 'Madrid',
      codigoPostal: '28006',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915123456',
      email: 'care@allianz.es',
      personaContacto: 'Roberto Jiménez',
    },
    condicionesGenerales: 'Cobertura del 90% en prevención y básicos, 70% en especialidades. Tope anual de 2.000€.',
    activo: true,
    createdAt: '2023-07-22T15:10:00Z',
    updatedAt: '2024-07-30T08:45:00Z',
  },
  {
    _id: '8',
    nombreComercial: 'SegurCaixa Adeslas',
    razonSocial: 'SegurCaixa Adeslas S.A.',
    cif: 'A28089012',
    direccion: {
      calle: 'Avenida Diagonal, 621',
      ciudad: 'Barcelona',
      codigoPostal: '08028',
      provincia: 'Barcelona',
      pais: 'España',
    },
    contacto: {
      telefono: '934456789',
      email: 'salud@segurcaixaadeslas.es',
      personaContacto: 'Marta López',
    },
    condicionesGenerales: 'Cobertura del 80% en todos los tratamientos. Sin tope anual. Prioridad en citas.',
    activo: false,
    createdAt: '2023-08-30T10:30:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
  },
  {
    _id: '9',
    nombreComercial: 'Cigna Salud',
    razonSocial: 'Cigna Healthcare España S.A.',
    cif: 'A28090123',
    direccion: {
      calle: 'Calle de la Princesa, 25',
      ciudad: 'Madrid',
      codigoPostal: '28008',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915012345',
      email: 'salud@cigna.es',
      personaContacto: 'David Ruiz',
    },
    condicionesGenerales: 'Cobertura del 100% en prevención, 85% en básicos, 60% en especialidades. Tope anual de 1.800€.',
    activo: true,
    createdAt: '2023-09-15T13:20:00Z',
    updatedAt: '2024-09-22T11:10:00Z',
  },
  {
    _id: '10',
    nombreComercial: 'Axa Salud',
    razonSocial: 'Axa Seguros Generales S.A.',
    cif: 'A28101234',
    direccion: {
      calle: 'Paseo de la Castellana, 200',
      ciudad: 'Madrid',
      codigoPostal: '28046',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915901234',
      email: 'salud@axa.es',
      personaContacto: 'Carmen Torres',
    },
    condicionesGenerales: 'Cobertura del 75% en tratamientos básicos, 55% en especialidades. Tope anual de 1.100€.',
    activo: true,
    createdAt: '2023-10-05T09:45:00Z',
    updatedAt: '2024-10-12T14:30:00Z',
  },
  {
    _id: '11',
    nombreComercial: 'Mutua Madrileña',
    razonSocial: 'Mutua Madrileña Automovilista',
    cif: 'A28112345',
    direccion: {
      calle: 'Calle de José Abascal, 56',
      ciudad: 'Madrid',
      codigoPostal: '28003',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915890123',
      email: 'salud@mutuamadrilena.es',
      personaContacto: 'Fernando Moreno',
    },
    condicionesGenerales: 'Cobertura del 90% en prevención y básicos, 70% en especialidades. Sin tope anual para socios.',
    activo: true,
    createdAt: '2023-11-20T10:15:00Z',
    updatedAt: '2024-11-28T16:20:00Z',
  },
  {
    _id: '12',
    nombreComercial: 'Vitaldent Seguros',
    razonSocial: 'Vitaldent Seguros Dentales S.L.',
    cif: 'B28123456',
    direccion: {
      calle: 'Calle de Alcalá, 45',
      ciudad: 'Madrid',
      codigoPostal: '28014',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915780012',
      email: 'seguros@vitaldent.es',
      personaContacto: 'Isabel García',
    },
    condicionesGenerales: 'Cobertura dental exclusiva. 100% en prevención, 80% en básicos, 50% en especialidades. Tope anual de 1.500€.',
    activo: true,
    createdAt: '2023-12-10T11:30:00Z',
    updatedAt: '2024-12-18T09:45:00Z',
  },
  {
    _id: '13',
    nombreComercial: 'Generali Salud',
    razonSocial: 'Generali Seguros S.A.',
    cif: 'A28134567',
    direccion: {
      calle: 'Paseo de la Castellana, 11',
      ciudad: 'Madrid',
      codigoPostal: '28046',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915670901',
      email: 'salud@generali.es',
      personaContacto: 'Javier Martín',
    },
    condicionesGenerales: 'Cobertura del 85% en tratamientos básicos, 65% en especialidades. Tope anual de 1.400€.',
    activo: true,
    createdAt: '2024-01-08T08:20:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '14',
    nombreComercial: 'Zurich Salud',
    razonSocial: 'Zurich Seguros S.A.',
    cif: 'A28145678',
    direccion: {
      calle: 'Calle de la Princesa, 1',
      ciudad: 'Madrid',
      codigoPostal: '28008',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915560890',
      email: 'salud@zurich.es',
      personaContacto: 'Laura Hernández',
    },
    condicionesGenerales: 'Cobertura del 80% en todos los tratamientos. Tope anual de 1.200€. Descuentos en ortodoncia.',
    activo: true,
    createdAt: '2024-02-12T12:45:00Z',
    updatedAt: '2024-02-20T15:30:00Z',
  },
  {
    _id: '15',
    nombreComercial: 'Medifiatc',
    razonSocial: 'Medifiatc Seguros de Salud S.A.',
    cif: 'A28156789',
    direccion: {
      calle: 'Calle de Balmes, 184',
      ciudad: 'Barcelona',
      codigoPostal: '08006',
      provincia: 'Barcelona',
      pais: 'España',
    },
    contacto: {
      telefono: '934450789',
      email: 'salud@medifiatc.es',
      personaContacto: 'Sergi Vila',
    },
    condicionesGenerales: 'Cobertura del 90% en prevención, 75% en básicos, 55% en especialidades. Tope anual de 1.600€.',
    activo: true,
    createdAt: '2024-03-18T09:10:00Z',
    updatedAt: '2024-03-25T11:20:00Z',
  },
  {
    _id: '16',
    nombreComercial: 'Quirónsalud',
    razonSocial: 'Quirónsalud Seguros de Salud S.A.',
    cif: 'A28167890',
    direccion: {
      calle: 'Calle Diego de Velázquez, 1',
      ciudad: 'Madrid',
      codigoPostal: '28223',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '914567890',
      email: 'seguros@quironsalud.es',
      personaContacto: 'Elena Vázquez',
    },
    condicionesGenerales: 'Cobertura del 85% en tratamientos básicos, 65% en especialidades. Tope anual de 1.700€. Red de clínicas propia.',
    activo: true,
    createdAt: '2024-04-10T10:00:00Z',
    updatedAt: '2024-04-15T14:30:00Z',
  },
  {
    _id: '17',
    nombreComercial: 'HNA Salud',
    razonSocial: 'HNA Seguros de Salud S.A.',
    cif: 'A28178901',
    direccion: {
      calle: 'Avenida de la Albufera, 73',
      ciudad: 'Madrid',
      codigoPostal: '28038',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '914456789',
      email: 'salud@hna.es',
      personaContacto: 'Javier Moreno',
    },
    condicionesGenerales: 'Cobertura del 80% en prevención y básicos, 60% en especialidades. Tope anual de 1.300€. Sin copago en urgencias.',
    activo: true,
    createdAt: '2024-05-05T08:20:00Z',
    updatedAt: '2024-05-10T11:45:00Z',
  },
  {
    _id: '18',
    nombreComercial: 'Vivaz Salud',
    razonSocial: 'Vivaz Seguros de Salud S.A.',
    cif: 'A28189012',
    direccion: {
      calle: 'Calle de Serrano, 45',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915345678',
      email: 'atencion@vivaz.es',
      personaContacto: 'Carmen Delgado',
    },
    condicionesGenerales: 'Cobertura del 100% en prevención, 85% en básicos, 70% en especialidades. Tope anual de 2.200€. App móvil incluida.',
    activo: true,
    createdAt: '2024-06-12T09:30:00Z',
    updatedAt: '2024-06-18T15:20:00Z',
  },
  {
    _id: '19',
    nombreComercial: 'MGC Mutua',
    razonSocial: 'MGC Mutua de Seguros',
    cif: 'A28190123',
    direccion: {
      calle: 'Calle de la Princesa, 31',
      ciudad: 'Madrid',
      codigoPostal: '28008',
      provincia: 'Madrid',
      pais: 'España',
    },
    contacto: {
      telefono: '915234567',
      email: 'salud@mgcmutua.es',
      personaContacto: 'Roberto Silva',
    },
    condicionesGenerales: 'Cobertura del 75% en todos los tratamientos. Tope anual de 1.000€. Descuentos especiales en ortodoncia.',
    activo: true,
    createdAt: '2024-07-20T11:15:00Z',
    updatedAt: '2024-07-25T09:00:00Z',
  },
  {
    _id: '20',
    nombreComercial: 'Previsora Bilbaína',
    razonSocial: 'Previsora Bilbaína Seguros S.A.',
    cif: 'A28201234',
    direccion: {
      calle: 'Gran Vía, 30',
      ciudad: 'Bilbao',
      codigoPostal: '48009',
      provincia: 'Vizcaya',
      pais: 'España',
    },
    contacto: {
      telefono: '944123456',
      email: 'salud@previsorabilbaina.es',
      personaContacto: 'Ane Etxebarria',
    },
    condicionesGenerales: 'Cobertura del 90% en prevención, 80% en básicos, 60% en especialidades. Tope anual de 1.500€. Cobertura regional amplia.',
    activo: true,
    createdAt: '2024-08-15T10:45:00Z',
    updatedAt: '2024-08-22T13:30:00Z',
  },
];

// Obtener listado paginado de mutuas
export async function obtenerMutuas(filtros: FiltrosMutuas = {}): Promise<PaginatedResponse<Mutua>> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  let mutuasFiltradas = [...MUTUAS_FALSAS];

  // Aplicar filtro de búsqueda
  if (filtros.search) {
    const searchLower = filtros.search.toLowerCase();
    mutuasFiltradas = mutuasFiltradas.filter(
      m => 
        m.nombreComercial.toLowerCase().includes(searchLower) ||
        m.razonSocial?.toLowerCase().includes(searchLower) ||
        m.cif.toLowerCase().includes(searchLower) ||
        m.contacto?.email?.toLowerCase().includes(searchLower)
    );
  }

  // Aplicar filtro de estado
  if (filtros.estado) {
    const activo = filtros.estado === 'activo';
    mutuasFiltradas = mutuasFiltradas.filter(m => m.activo === activo);
  }

  // Paginación
  const page = filtros.page || 1;
  const limit = filtros.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = mutuasFiltradas.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: mutuasFiltradas.slice(startIndex, endIndex),
    total,
    page,
    limit,
    totalPages,
  };
}

// Obtener detalle de una mutua por ID
export async function obtenerMutuaPorId(id: string): Promise<Mutua> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const mutua = MUTUAS_FALSAS.find(m => m._id === id);
  if (!mutua) {
    throw new Error('Mutua no encontrada');
  }
  
  return mutua;
}

// Crear una nueva mutua
export async function crearMutua(mutua: NuevaMutua): Promise<Mutua> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaMutua: Mutua = {
    ...mutua,
    _id: String(MUTUAS_FALSAS.length + 1),
    activo: mutua.activo !== undefined ? mutua.activo : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  MUTUAS_FALSAS.push(nuevaMutua);
  return nuevaMutua;
}

// Actualizar una mutua existente
export async function actualizarMutua(id: string, mutua: Partial<NuevaMutua>): Promise<Mutua> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MUTUAS_FALSAS.findIndex(m => m._id === id);
  if (index === -1) {
    throw new Error('Mutua no encontrada');
  }
  
  MUTUAS_FALSAS[index] = {
    ...MUTUAS_FALSAS[index],
    ...mutua,
    updatedAt: new Date().toISOString(),
  };
  
  return MUTUAS_FALSAS[index];
}

// Desactivar una mutua (soft delete)
export async function desactivarMutua(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = MUTUAS_FALSAS.findIndex(m => m._id === id);
  if (index === -1) {
    throw new Error('Mutua no encontrada');
  }
  
  MUTUAS_FALSAS[index].activo = false;
  MUTUAS_FALSAS[index].updatedAt = new Date().toISOString();
}

// Reactivar una mutua
export async function reactivarMutua(id: string): Promise<Mutua> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = MUTUAS_FALSAS.findIndex(m => m._id === id);
  if (index === -1) {
    throw new Error('Mutua no encontrada');
  }
  
  MUTUAS_FALSAS[index].activo = true;
  MUTUAS_FALSAS[index].updatedAt = new Date().toISOString();
  
  return MUTUAS_FALSAS[index];
}


