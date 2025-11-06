// API para gestión de Odontograma Interactivo
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Hallazgo {
  _id?: string;
  dienteId: number;
  superficies: string[];
  codigoTratamiento: string;
  nombreTratamiento?: string;
  estado: 'diagnostico' | 'planificado' | 'realizado' | 'en_progreso' | 'descartado' | 'ausente';
  nota?: string;
  fechaRegistro: string;
  fechaActualizacion?: string;
  fechaRealizacion?: string;
  profesionalId?: string;
  profesional?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
}

export interface Odontograma {
  _id?: string;
  pacienteId: string;
  fechaCreacion: string;
  profesionalId?: string;
  hallazgos: Hallazgo[];
}

export interface NuevoHallazgo {
  dienteId: number;
  superficies: string[];
  codigoTratamiento: string;
  estado: 'diagnostico' | 'planificado';
  nota?: string;
}

export interface ActualizarHallazgo {
  estado?: 'realizado' | 'en_progreso' | 'descartado';
  fechaRealizacion?: string;
  profesionalId?: string;
  nota?: string;
}

/**
 * Obtiene el estado completo y actual del odontograma de un paciente específico
 */
export async function obtenerOdontograma(pacienteId: string): Promise<Odontograma> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = parseInt(pacienteId) - 1 || 0;
  
  // Generar hallazgos falsos más completos y variados según el paciente
  const hallazgos: Hallazgo[] = [];
  const profesionales = [
    { _id: 'prof-1', nombre: 'Dr. Juan', apellidos: 'Pérez' },
    { _id: 'prof-2', nombre: 'Dra. María', apellidos: 'González' },
    { _id: 'prof-3', nombre: 'Dr. Carlos', apellidos: 'Martínez' },
  ];
  
  if (index % 2 === 0) {
    // Paciente con más tratamientos
    hallazgos.push({
      _id: 'hallazgo-1',
      dienteId: 36,
      superficies: ['O', 'M'],
      codigoTratamiento: 'D2120',
      nombreTratamiento: 'Obturación de composite',
      estado: 'realizado',
      nota: 'Obturación realizada con éxito. Composite nanohíbrido de alta calidad. Caries de grado 2 tratada en superficies oclusal y mesial. Material: Filtek Z350 XT. Procedimiento sin complicaciones.',
      fechaRegistro: new Date(2024, 10, 15).toISOString(),
      fechaActualizacion: new Date(2024, 10, 25).toISOString(),
      fechaRealizacion: new Date(2024, 10, 25).toISOString(),
      profesional: profesionales[0],
    });
    hallazgos.push({
      _id: 'hallazgo-2',
      dienteId: 16,
      superficies: ['O'],
      codigoTratamiento: 'D1110',
      nombreTratamiento: 'Limpieza dental',
      estado: 'realizado',
      nota: 'Limpieza dental profesional completada. Eliminación de placa y sarro. Aplicación de flúor tópico. Índice de placa reducido del 15% al 5%.',
      fechaRegistro: new Date(2024, 11, 1).toISOString(),
      fechaActualizacion: new Date(2024, 11, 10).toISOString(),
      fechaRealizacion: new Date(2024, 11, 10).toISOString(),
      profesional: profesionales[0],
    });
    hallazgos.push({
      _id: 'hallazgo-3',
      dienteId: 46,
      superficies: ['O'],
      codigoTratamiento: 'D2120',
      nombreTratamiento: 'Obturación de composite',
      estado: 'realizado',
      nota: 'Obturación en pieza 46 completada. Superficie oclusal. Caries de grado 1. Material: composite nanohíbrido. Control post-tratamiento favorable.',
      fechaRegistro: new Date(2024, 9, 20).toISOString(),
      fechaActualizacion: new Date(2024, 9, 20).toISOString(),
      fechaRealizacion: new Date(2024, 9, 20).toISOString(),
      profesional: profesionales[0],
    });
    hallazgos.push({
      _id: 'hallazgo-4',
      dienteId: 26,
      superficies: ['O', 'D'],
      codigoTratamiento: 'D2120',
      nombreTratamiento: 'Obturación de composite',
      estado: 'planificado',
      nota: 'Caries detectada en pieza 26. Requiere obturación en superficies oclusal y distal. Planificado para próxima cita.',
      fechaRegistro: new Date(2024, 11, 10).toISOString(),
      profesional: profesionales[0],
    });
    hallazgos.push({
      _id: 'hallazgo-5',
      dienteId: 14,
      superficies: ['V'],
      codigoTratamiento: 'D3310',
      nombreTratamiento: 'Endodoncia unirradicular',
      estado: 'diagnostico',
      nota: 'Caries profunda que afecta pulpa. Requiere endodoncia. Paciente asintomático actualmente. Planificar tratamiento.',
      fechaRegistro: new Date(2024, 11, 5).toISOString(),
      profesional: profesionales[1],
    });
    hallazgos.push({
      _id: 'hallazgo-6',
      dienteId: 11,
      superficies: ['V'],
      codigoTratamiento: 'D5110',
      nombreTratamiento: 'Corona completa - Porcelana',
      estado: 'planificado',
      nota: 'Fractura de borde incisal. Requiere corona estética de porcelana. Presupuesto presentado al paciente.',
      fechaRegistro: new Date(2024, 10, 1).toISOString(),
      profesional: profesionales[0],
    });
    hallazgos.push({
      _id: 'hallazgo-7',
      dienteId: 48,
      superficies: ['O'],
      codigoTratamiento: 'D7220',
      nombreTratamiento: 'Extracción quirúrgica',
      estado: 'realizado',
      nota: 'Muela del juicio impactada. Extracción quirúrgica completada sin complicaciones. Cicatrización normal.',
      fechaRegistro: new Date(2024, 8, 15).toISOString(),
      fechaActualizacion: new Date(2024, 8, 15).toISOString(),
      fechaRealizacion: new Date(2024, 8, 15).toISOString(),
      profesional: profesionales[2],
    });
  } else {
    // Paciente con menos tratamientos pero más variados
    hallazgos.push({
      _id: 'hallazgo-1',
      dienteId: 11,
      superficies: ['V'],
      codigoTratamiento: 'D0150',
      nombreTratamiento: 'Revisión',
      estado: 'realizado',
      nota: 'Revisión de rutina. Estado normal. Sin patología detectada. Exploración completa sin hallazgos.',
      fechaRegistro: new Date(2024, 11, 5).toISOString(),
      fechaActualizacion: new Date(2024, 11, 5).toISOString(),
      fechaRealizacion: new Date(2024, 11, 5).toISOString(),
      profesional: profesionales[2],
    });
    hallazgos.push({
      _id: 'hallazgo-2',
      dienteId: 21,
      superficies: ['V'],
      codigoTratamiento: 'D2120',
      nombreTratamiento: 'Obturación de composite',
      estado: 'realizado',
      nota: 'Obturación estética en incisivo central superior. Composite de alta calidad. Resultado estético excelente.',
      fechaRegistro: new Date(2024, 10, 20).toISOString(),
      fechaActualizacion: new Date(2024, 10, 20).toISOString(),
      fechaRealizacion: new Date(2024, 10, 20).toISOString(),
      profesional: profesionales[1],
    });
    hallazgos.push({
      _id: 'hallazgo-3',
      dienteId: 37,
      superficies: ['O'],
      codigoTratamiento: 'D2120',
      nombreTratamiento: 'Obturación de composite',
      estado: 'en_progreso',
      nota: 'Obturación en proceso. Primera sesión completada. Restauración temporal colocada. Segunda sesión programada.',
      fechaRegistro: new Date(2024, 11, 1).toISOString(),
      fechaActualizacion: new Date(2024, 11, 8).toISOString(),
      profesional: profesionales[0],
    });
    hallazgos.push({
      _id: 'hallazgo-4',
      dienteId: 18,
      superficies: ['O'],
      codigoTratamiento: 'D1110',
      nombreTratamiento: 'Limpieza dental',
      estado: 'realizado',
      nota: 'Limpieza profunda en zona posterior. Eliminación de cálculo subgingival. Aplicación de flúor.',
      fechaRegistro: new Date(2024, 11, 10).toISOString(),
      fechaActualizacion: new Date(2024, 11, 10).toISOString(),
      fechaRealizacion: new Date(2024, 11, 10).toISOString(),
      profesional: profesionales[0],
    });
  }

  return {
    _id: `odont-${pacienteId}`,
    pacienteId,
    fechaCreacion: new Date(2024, 0, 1).toISOString(),
    hallazgos,
  };
}

/**
 * Agrega un nuevo hallazgo, diagnóstico o tratamiento planificado a una o más piezas dentales
 */
export async function agregarHallazgo(
  pacienteId: string,
  hallazgo: NuevoHallazgo
): Promise<Hallazgo> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    _id: `hallazgo-${Date.now()}`,
    ...hallazgo,
    fechaRegistro: new Date().toISOString(),
    profesional: {
      _id: 'prof-1',
      nombre: 'Dr. Juan',
      apellidos: 'Pérez',
    },
  };
}

/**
 * Actualiza el estado de un hallazgo o tratamiento existente
 */
export async function actualizarHallazgo(
  pacienteId: string,
  hallazgoId: string,
  datos: ActualizarHallazgo
): Promise<Hallazgo> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En una implementación real, obtendríamos el hallazgo existente y lo actualizaríamos
  // Por ahora, retornamos un objeto con los datos actualizados
  return {
    _id: hallazgoId,
    dienteId: 36,
    superficies: ['O'],
    codigoTratamiento: 'D2110',
    nombreTratamiento: 'Obturación',
    estado: datos.estado || 'realizado',
    nota: datos.nota,
    fechaRegistro: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    fechaRealizacion: datos.fechaRealizacion,
    profesional: {
      _id: 'prof-1',
      nombre: 'Dr. Juan',
      apellidos: 'Pérez',
    },
  };
}

/**
 * Elimina un hallazgo o tratamiento registrado por error
 */
export async function eliminarHallazgo(
  pacienteId: string,
  hallazgoId: string
): Promise<{ mensaje: string }> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { mensaje: 'Hallazgo eliminado correctamente' };
}

/**
 * Obtiene el catálogo de tratamientos disponibles
 */
export async function obtenerTratamientos(): Promise<
  Array<{ codigo: string; nombre: string; categoria: string }>
> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    { codigo: 'D1110', nombre: 'Limpieza dental', categoria: 'Prevención' },
    { codigo: 'D2110', nombre: 'Obturación de amalgama', categoria: 'Restauración' },
    { codigo: 'D2120', nombre: 'Obturación de composite', categoria: 'Restauración' },
    { codigo: 'D3310', nombre: 'Endodoncia unirradicular', categoria: 'Endodoncia' },
    { codigo: 'D3320', nombre: 'Endodoncia birradicular', categoria: 'Endodoncia' },
    { codigo: 'D3330', nombre: 'Endodoncia multirradicular', categoria: 'Endodoncia' },
    { codigo: 'D5110', nombre: 'Corona completa - Porcelana', categoria: 'Prótesis' },
    { codigo: 'D5120', nombre: 'Corona completa - Metal', categoria: 'Prótesis' },
    { codigo: 'D7210', nombre: 'Extracción simple', categoria: 'Cirugía' },
    { codigo: 'D7220', nombre: 'Extracción quirúrgica', categoria: 'Cirugía' },
    { codigo: 'D0150', nombre: 'Revisión', categoria: 'Diagnóstico' },
    { codigo: 'D0120', nombre: 'Consulta periódica', categoria: 'Diagnóstico' },
  ];
}

