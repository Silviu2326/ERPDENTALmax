// API para gestionar integraciones con laboratorios externos para órdenes STL

export interface LaboratorioExterno {
  _id?: string;
  nombre: string;
  cif?: string;
  direccion?: string;
  personaContacto?: string;
  email: string;
  telefono?: string;
  activo: boolean;
  tipoIntegracion: 'api' | 'email' | 'ftp' | 'webhook';
  configuracion: {
    apiKey?: string;
    apiSecret?: string;
    endpoint?: string;
    servidorFtp?: string;
    usuarioFtp?: string;
    passwordFtp?: string;
    carpetaFtp?: string;
    webhookUrl?: string;
  };
  formatosSoportados: string[]; // ['STL', 'OBJ', 'PLY', etc.]
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdenSTL {
  _id?: string;
  ordenLaboratorioId: string;
  laboratorioExternoId: string;
  pacienteId: string;
  numeroOrden: string;
  archivosSTL: {
    nombre: string;
    url: string;
    tamaño: number;
    fechaSubida: Date;
    tipo: 'scan-intraoral' | 'modelo-digital' | 'diseño-protesis';
  }[];
  estado: 'pendiente' | 'enviada' | 'recibida' | 'procesando' | 'completada' | 'error';
  fechaEnvio?: Date;
  fechaRecepcion?: Date;
  fechaCompletada?: Date;
  error?: string;
  metadata?: {
    tipoProtesis?: string;
    material?: string;
    color?: string;
    instrucciones?: string;
  };
  historial: {
    estado: string;
    fecha: Date;
    notas?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevaOrdenSTL {
  ordenLaboratorioId: string;
  laboratorioExternoId: string;
  archivosSTL: File[];
  metadata?: {
    tipoProtesis?: string;
    material?: string;
    color?: string;
    instrucciones?: string;
  };
}

// Funciones para laboratorios externos
export async function obtenerLaboratoriosExternos(): Promise<LaboratorioExterno[]> {
  try {
    const response = await fetch('/api/integraciones/laboratorios-externos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener laboratorios externos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener laboratorios externos:', error);
    throw error;
  }
}

export async function crearLaboratorioExterno(
  laboratorio: Omit<LaboratorioExterno, '_id' | 'createdAt' | 'updatedAt'>
): Promise<LaboratorioExterno> {
  try {
    const response = await fetch('/api/integraciones/laboratorios-externos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(laboratorio),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear laboratorio externo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear laboratorio externo:', error);
    throw error;
  }
}

export async function actualizarLaboratorioExterno(
  id: string,
  laboratorio: Partial<LaboratorioExterno>
): Promise<LaboratorioExterno> {
  try {
    const response = await fetch(`/api/integraciones/laboratorios-externos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(laboratorio),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar laboratorio externo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar laboratorio externo:', error);
    throw error;
  }
}

export async function eliminarLaboratorioExterno(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/integraciones/laboratorios-externos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar laboratorio externo');
    }
  } catch (error) {
    console.error('Error al eliminar laboratorio externo:', error);
    throw error;
  }
}

export async function probarConexionLaboratorio(id: string): Promise<{ exito: boolean; mensaje: string }> {
  try {
    const response = await fetch(`/api/integraciones/laboratorios-externos/${id}/probar-conexion`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al probar conexión');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al probar conexión:', error);
    throw error;
  }
}

// Funciones para órdenes STL
export async function obtenerOrdenesSTL(filtros?: {
  laboratorioExternoId?: string;
  estado?: string;
  page?: number;
  limit?: number;
}): Promise<{ ordenes: OrdenSTL[]; total: number; totalPages: number }> {
  try {
    const queryParams = new URLSearchParams();
    if (filtros?.laboratorioExternoId) {
      queryParams.append('laboratorioExternoId', filtros.laboratorioExternoId);
    }
    if (filtros?.estado) {
      queryParams.append('estado', filtros.estado);
    }
    if (filtros?.page) {
      queryParams.append('page', filtros.page.toString());
    }
    if (filtros?.limit) {
      queryParams.append('limit', filtros.limit.toString());
    }

    const response = await fetch(`/api/integraciones/ordenes-stl?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener órdenes STL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener órdenes STL:', error);
    throw error;
  }
}

export async function crearOrdenSTL(orden: NuevaOrdenSTL): Promise<OrdenSTL> {
  try {
    const formData = new FormData();
    formData.append('ordenLaboratorioId', orden.ordenLaboratorioId);
    formData.append('laboratorioExternoId', orden.laboratorioExternoId);
    
    orden.archivosSTL.forEach((archivo, index) => {
      formData.append(`archivosSTL`, archivo);
    });

    if (orden.metadata) {
      formData.append('metadata', JSON.stringify(orden.metadata));
    }

    const response = await fetch('/api/integraciones/ordenes-stl', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear orden STL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear orden STL:', error);
    throw error;
  }
}

export async function obtenerOrdenSTL(id: string): Promise<OrdenSTL> {
  try {
    const response = await fetch(`/api/integraciones/ordenes-stl/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener orden STL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener orden STL:', error);
    throw error;
  }
}

export async function actualizarEstadoOrdenSTL(
  id: string,
  nuevoEstado: OrdenSTL['estado'],
  notas?: string
): Promise<OrdenSTL> {
  try {
    const response = await fetch(`/api/integraciones/ordenes-stl/${id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ estado: nuevoEstado, notas }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar estado');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    throw error;
  }
}

export async function eliminarOrdenSTL(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/integraciones/ordenes-stl/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar orden STL');
    }
  } catch (error) {
    console.error('Error al eliminar orden STL:', error);
    throw error;
  }
}



