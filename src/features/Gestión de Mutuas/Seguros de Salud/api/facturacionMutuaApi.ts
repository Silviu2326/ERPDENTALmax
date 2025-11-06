// API para asistente de facturación a mutuas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PacienteConSeguro {
  _id: string;
  nombre: string;
  apellidos: string;
  DNI?: string;
  poliza: {
    mutuaId: string;
    mutuaNombre: string;
    numeroPoliza: string;
    fechaValidez: string;
    condicionesEspeciales?: string;
  };
}

export interface TratamientoFacturable {
  _id: string;
  tratamiento: {
    _id: string;
    nombre: string;
    codigoInterno?: string;
  };
  fechaRealizacion: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  precio: number;
  cantidad: number;
  notas?: string;
}

export interface DetalleCobertura {
  tratamientoId: string;
  codigoMutua: string;
  descripcion: string;
  precio: number;
  importeCubierto: number;
  copago: number;
  cobertura: number; // Porcentaje de cobertura
  limitacion?: string;
  requiereAutorizacion?: boolean;
}

export interface VerificacionCoberturaResponse {
  pacienteId: string;
  mutuaId: string;
  detalles: DetalleCobertura[];
  total: number;
  totalCubierto: number;
  totalCopago: number;
}

export interface TratamientoFacturacion {
  tratamientoId: string;
  codigoMutua: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  importeCubierto: number;
  copago: number;
}

export interface PrefacturaMutua {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    DNI?: string;
  };
  mutua: {
    _id: string;
    nombreComercial: string;
    razonSocial: string;
  };
  tratamientos: TratamientoFacturacion[];
  total: number;
  totalCubierto: number;
  totalCopago: number;
  fechaEmision: string;
  estado: 'borrador' | 'enviada' | 'pagada' | 'rechazada' | 'pagada_parcialmente';
  notas?: string;
}

export interface FacturaMutuaConfirmada extends PrefacturaMutua {
  numeroFactura: string;
  fechaEnvio: string;
  estado: 'enviada' | 'pagada' | 'rechazada' | 'pagada_parcialmente';
}

// Datos falsos para pacientes con seguro
const PACIENTES_CON_SEGURO_FALSOS: PacienteConSeguro[] = [
  {
    _id: 'p1',
    nombre: 'Juan',
    apellidos: 'García López',
    DNI: '12345678A',
    poliza: {
      mutuaId: '1',
      mutuaNombre: 'Sanitas',
      numeroPoliza: 'SAN-2024-001234',
      fechaValidez: '2024-12-31',
      condicionesEspeciales: 'Sin copago en prevención',
    },
  },
  {
    _id: 'p2',
    nombre: 'María',
    apellidos: 'Rodríguez Sánchez',
    DNI: '23456789B',
    poliza: {
      mutuaId: '2',
      mutuaNombre: 'Adeslas',
      numeroPoliza: 'ADE-2024-005678',
      fechaValidez: '2024-12-31',
    },
  },
  {
    _id: 'p3',
    nombre: 'Carlos',
    apellidos: 'Fernández Torres',
    DNI: '34567890C',
    poliza: {
      mutuaId: '3',
      mutuaNombre: 'DKV Seguros',
      numeroPoliza: 'DKV-2024-009012',
      fechaValidez: '2024-12-31',
    },
  },
  {
    _id: 'p4',
    nombre: 'Ana',
    apellidos: 'López Martín',
    DNI: '45678901D',
    poliza: {
      mutuaId: '4',
      mutuaNombre: 'Asisa',
      numeroPoliza: 'ASI-2024-003456',
      fechaValidez: '2024-12-31',
    },
  },
  {
    _id: 'p5',
    nombre: 'Pedro',
    apellidos: 'Sánchez Díaz',
    DNI: '56789012E',
    poliza: {
      mutuaId: '5',
      mutuaNombre: 'Mapfre Salud',
      numeroPoliza: 'MAP-2024-007890',
      fechaValidez: '2024-12-31',
    },
  },
  {
    _id: 'p6',
    nombre: 'Laura',
    apellidos: 'González Ruiz',
    DNI: '67890123F',
    poliza: {
      mutuaId: '1',
      mutuaNombre: 'Sanitas',
      numeroPoliza: 'SAN-2024-001567',
      fechaValidez: '2024-12-31',
    },
  },
  {
    _id: 'p7',
    nombre: 'Miguel',
    apellidos: 'Martínez Jiménez',
    DNI: '78901234G',
    poliza: {
      mutuaId: '6',
      mutuaNombre: 'Fiatc Salud',
      numeroPoliza: 'FIA-2024-002345',
      fechaValidez: '2024-12-31',
    },
  },
  {
    _id: 'p8',
    nombre: 'Sofía',
    apellidos: 'Hernández Moreno',
    DNI: '89012345H',
    poliza: {
      mutuaId: '7',
      mutuaNombre: 'Allianz Care',
      numeroPoliza: 'ALL-2024-004567',
      fechaValidez: '2024-12-31',
    },
  },
];

/**
 * Busca pacientes que tienen una póliza de seguro activa
 */
export async function buscarPacientesConSeguro(search?: string): Promise<PacienteConSeguro[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let pacientes = [...PACIENTES_CON_SEGURO_FALSOS];
  
  if (search) {
    const searchLower = search.toLowerCase();
    pacientes = pacientes.filter(
      p =>
        p.nombre.toLowerCase().includes(searchLower) ||
        p.apellidos.toLowerCase().includes(searchLower) ||
        p.DNI?.toLowerCase().includes(searchLower) ||
        p.poliza.numeroPoliza.toLowerCase().includes(searchLower) ||
        p.poliza.mutuaNombre.toLowerCase().includes(searchLower)
    );
  }
  
  return pacientes;
}

// Datos falsos para tratamientos facturables
const TRATAMIENTOS_FACTURABLES_FALSOS: Record<string, TratamientoFacturable[]> = {
  p1: [
    {
      _id: 'tf1',
      tratamiento: { _id: 't1', nombre: 'Limpieza dental', codigoInterno: 'LIM001' },
      fechaRealizacion: '2024-01-15T10:00:00Z',
      profesional: { _id: 'u1', nombre: 'Dr. Martínez', apellidos: 'García' },
      precio: 60,
      cantidad: 1,
      notas: 'Limpieza completa con profilaxis',
    },
    {
      _id: 'tf2',
      tratamiento: { _id: 't2', nombre: 'Empaste simple', codigoInterno: 'EMP001' },
      fechaRealizacion: '2024-01-20T14:30:00Z',
      profesional: { _id: 'u1', nombre: 'Dr. Martínez', apellidos: 'García' },
      precio: 45,
      cantidad: 1,
      notas: 'Empaste en pieza 36',
    },
  ],
  p2: [
    {
      _id: 'tf3',
      tratamiento: { _id: 't7', nombre: 'Corona cerámica', codigoInterno: 'COR001' },
      fechaRealizacion: '2024-01-25T09:00:00Z',
      profesional: { _id: 'u2', nombre: 'Dr. González', apellidos: 'López' },
      precio: 450,
      cantidad: 1,
      notas: 'Corona en pieza 21',
    },
  ],
  p3: [
    {
      _id: 'tf4',
      tratamiento: { _id: 't4', nombre: 'Endodoncia', codigoInterno: 'END001' },
      fechaRealizacion: '2024-01-18T11:00:00Z',
      profesional: { _id: 'u1', nombre: 'Dr. Martínez', apellidos: 'García' },
      precio: 350,
      cantidad: 1,
      notas: 'Endodoncia en pieza 36',
    },
  ],
};

/**
 * Obtiene la lista de tratamientos realizados a un paciente que aún no han sido facturados a su mutua
 */
export async function obtenerTratamientosPendientes(pacienteId: string): Promise<TratamientoFacturable[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return TRATAMIENTOS_FACTURABLES_FALSOS[pacienteId] || [];
}

/**
 * Verifica la cobertura de una lista de tratamientos para un paciente específico según su póliza
 */
export async function verificarCobertura(
  pacienteId: string,
  mutuaId: string,
  tratamientosIds: string[]
): Promise<VerificacionCoberturaResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular verificación de cobertura según la mutua
  const coberturasPorMutua: Record<string, Record<string, number>> = {
    '1': { t1: 100, t2: 80, t4: 60, t7: 50 }, // Sanitas
    '2': { t1: 100, t2: 85, t3: 75, t4: 65, t8: 40 }, // Adeslas
    '3': { t1: 100, t2: 80, t5: 70 }, // DKV
    '4': { t1: 100, t2: 75, t3: 70, t4: 60, t7: 50 }, // Asisa
    '5': { t1: 100, t2: 70, t5: 50 }, // Mapfre
    '6': { t1: 100, t2: 85, t3: 75, t4: 65 }, // Fiatc
    '7': { t1: 100, t2: 90, t3: 85, t4: 70, t7: 60, t8: 50 }, // Allianz
  };
  
  const coberturas = coberturasPorMutua[mutuaId] || { t1: 80, t2: 70 };
  
  const tratamientos = TRATAMIENTOS_FACTURABLES_FALSOS[pacienteId] || [];
  const tratamientosFiltrados = tratamientos.filter(t => tratamientosIds.includes(t._id));
  
  const detalles: DetalleCobertura[] = tratamientosFiltrados.map(t => {
    const cobertura = coberturas[t.tratamiento._id] || 70;
    const precio = t.precio * t.cantidad;
    const importeCubierto = (precio * cobertura) / 100;
    const copago = precio - importeCubierto;
    
    return {
      tratamientoId: t.tratamiento._id,
      codigoMutua: t.tratamiento.codigoInterno || t.tratamiento._id,
      descripcion: t.tratamiento.nombre,
      precio,
      importeCubierto,
      copago,
      cobertura,
      requiereAutorizacion: ['t4', 't7', 't8', 't9'].includes(t.tratamiento._id),
    };
  });
  
  const total = detalles.reduce((sum, d) => sum + d.precio, 0);
  const totalCubierto = detalles.reduce((sum, d) => sum + d.importeCubierto, 0);
  const totalCopago = detalles.reduce((sum, d) => sum + d.copago, 0);
  
  return {
    pacienteId,
    mutuaId,
    detalles,
    total,
    totalCubierto,
    totalCopago,
  };
}

/**
 * Genera un borrador de la factura (prefactura) con todos los cálculos realizados
 */
export async function generarPrefactura(
  pacienteId: string,
  mutuaId: string,
  tratamientos: TratamientoFacturacion[]
): Promise<PrefacturaMutua> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const paciente = PACIENTES_CON_SEGURO_FALSOS.find(p => p._id === pacienteId);
  const mutuas = await import('./mutuasApi');
  const mutuasList = await mutuas.obtenerMutuas({ limit: 1000 });
  const mutua = mutuasList.data.find(m => m._id === mutuaId);
  
  if (!paciente || !mutua) {
    throw new Error('Paciente o mutua no encontrados');
  }
  
  const total = tratamientos.reduce((sum, t) => sum + (t.precio * t.cantidad), 0);
  const totalCubierto = tratamientos.reduce((sum, t) => sum + t.importeCubierto, 0);
  const totalCopago = tratamientos.reduce((sum, t) => sum + t.copago, 0);
  
  return {
    _id: `pref-${Date.now()}`,
    paciente: {
      _id: paciente._id,
      nombre: paciente.nombre,
      apellidos: paciente.apellidos,
      DNI: paciente.DNI,
    },
    mutua: {
      _id: mutua._id!,
      nombreComercial: mutua.nombreComercial,
      razonSocial: mutua.razonSocial || mutua.nombreComercial,
    },
    tratamientos,
    total,
    totalCubierto,
    totalCopago,
    fechaEmision: new Date().toISOString(),
    estado: 'borrador',
  };
}

/**
 * Confirma el borrador de la factura, la guarda en la base de datos y realiza las acciones pertinentes
 */
export async function confirmarYEnviarFactura(prefacturaId: string): Promise<FacturaMutuaConfirmada> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // En un caso real, aquí se recuperaría la prefactura desde el backend
  // Por ahora, simulamos que se genera una factura nueva
  const numeroFactura = `FAC-MUT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;
  
  // Simulamos que recuperamos la prefactura (en producción vendría del backend)
  // Por ahora, creamos una factura de ejemplo
  const mutuas = await import('./mutuasApi');
  const mutuasList = await mutuas.obtenerMutuas({ limit: 1 });
  const mutua = mutuasList.data[0];
  const paciente = PACIENTES_CON_SEGURO_FALSOS[0];
  
  const factura: FacturaMutuaConfirmada = {
    _id: prefacturaId,
    paciente: {
      _id: paciente._id,
      nombre: paciente.nombre,
      apellidos: paciente.apellidos,
      DNI: paciente.DNI,
    },
    mutua: {
      _id: mutua._id!,
      nombreComercial: mutua.nombreComercial,
      razonSocial: mutua.razonSocial || mutua.nombreComercial,
    },
    tratamientos: [
      {
        tratamientoId: 't1',
        codigoMutua: 'LIM001',
        descripcion: 'Limpieza dental',
        precio: 60,
        cantidad: 1,
        importeCubierto: 60,
        copago: 0,
      },
    ],
    total: 60,
    totalCubierto: 60,
    totalCopago: 0,
    fechaEmision: new Date().toISOString(),
    numeroFactura,
    fechaEnvio: new Date().toISOString(),
    estado: 'enviada',
  };
  
  return factura;
}


