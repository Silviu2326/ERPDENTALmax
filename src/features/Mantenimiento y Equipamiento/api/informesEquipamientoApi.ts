// API para informes de equipamiento
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface FiltrosInformeCostes {
  fechaInicio?: string; // formato YYYY-MM-DD
  fechaFin?: string; // formato YYYY-MM-DD
  sedes?: string[]; // IDs de sedes separadas por comas
  categoria?: string; // ID de la categoría de equipo
}

export interface CosteEquipo {
  equipoId: string;
  nombre: string;
  categoria: {
    _id: string;
    nombre: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  costoAdquisicion: number;
  costeMantenimientoPreventivo: number;
  costeMantenimientoCorrectivo: number;
  costeReparaciones: number;
  costeTotal: number;
  depreciacion: number;
  valorResidual: number;
  fechaAdquisicion: string;
  estado: string;
}

export interface ResumenCostes {
  totalAdquisicion: number;
  totalMantenimiento: number;
  totalReparaciones: number;
  costeGeneral: number;
  totalDepreciacion: number;
  totalEquipos: number;
}

export interface InformeCostesEquipamiento {
  resumen: ResumenCostes;
  desglose: CosteEquipo[];
}

// Obtener informe de costes de equipamiento
export async function obtenerInformeCostes(
  filtros: FiltrosInformeCostes = {}
): Promise<InformeCostesEquipamiento> {
  const params = new URLSearchParams();
  
  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros.sedes && filtros.sedes.length > 0) {
    params.append('sedes', filtros.sedes.join(','));
  }
  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }

  const response = await fetch(`${API_BASE_URL}/equipamiento/informes/costes?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el informe de costes' }));
    throw new Error(error.message || 'Error al obtener el informe de costes');
  }

  return response.json();
}

// Exportar informe en formato PDF
export async function exportarInformePDF(
  filtros: FiltrosInformeCostes = {}
): Promise<Blob> {
  const params = new URLSearchParams();
  
  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros.sedes && filtros.sedes.length > 0) {
    params.append('sedes', filtros.sedes.join(','));
  }
  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }
  params.append('formato', 'pdf');

  const response = await fetch(`${API_BASE_URL}/equipamiento/informes/costes/exportar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al exportar el informe en PDF');
  }

  return response.blob();
}

// Exportar informe en formato CSV
export async function exportarInformeCSV(
  filtros: FiltrosInformeCostes = {}
): Promise<Blob> {
  const params = new URLSearchParams();
  
  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros.sedes && filtros.sedes.length > 0) {
    params.append('sedes', filtros.sedes.join(','));
  }
  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }
  params.append('formato', 'csv');

  const response = await fetch(`${API_BASE_URL}/equipamiento/informes/costes/exportar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al exportar el informe en CSV');
  }

  return response.blob();
}


